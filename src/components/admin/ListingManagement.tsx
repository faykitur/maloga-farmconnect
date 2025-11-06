import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  status: string;
  created_at: string;
  seller_id: string;
  seller_name?: string;
}

export const ListingManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data: listings, error: listingsError } = await supabase
        .from("livestock_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (listingsError) throw listingsError;

      // Fetch seller names separately
      const listingsWithSellers = await Promise.all(
        (listings || []).map(async (listing) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", listing.seller_id)
            .maybeSingle();

          return {
            ...listing,
            seller_name: profile?.full_name || "Unknown",
          };
        })
      );

      setListings(listingsWithSellers);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (listingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("livestock_listings")
        .update({ status: newStatus })
        .eq("id", listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Listing ${newStatus === "active" ? "approved" : "rejected"}`,
      });

      fetchListings();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    }
  };

  const deleteListing = async () => {
    if (!selectedListing) return;

    try {
      const { error } = await supabase
        .from("livestock_listings")
        .delete()
        .eq("id", selectedListing);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Listing Management</h2>
        </div>
        <Badge variant="secondary">{listings.length} Total Listings</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.title}</TableCell>
              <TableCell>{listing.seller_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{listing.category}</Badge>
              </TableCell>
              <TableCell>KES {listing.price.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={listing.status === "active" ? "default" : "secondary"}
                >
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(listing.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {listing.status !== "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateListingStatus(listing.id, "active")}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {listing.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateListingStatus(listing.id, "inactive")}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedListing(listing.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteListing}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
