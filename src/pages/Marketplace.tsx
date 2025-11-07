import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Phone, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  image_urls: string[];
  created_at: string;
  seller_id: string;
}

interface SellerProfile {
  full_name: string | null;
  phone: string | null;
}

const Marketplace = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();

    const channel = supabase
      .channel("livestock_listings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "livestock_listings",
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("livestock_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data as any);
    }
    setLoading(false);
  };

  const handleContactSeller = async (sellerId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", sellerId)
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Could not fetch seller information",
        variant: "destructive",
      });
      return;
    }

    setSelectedSeller(data);
    setContactDialogOpen(true);
  };

  const handleDelete = async (listingId: string) => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    const { error } = await supabase
      .from("livestock_listings")
      .delete()
      .eq("id", listingId)
      .eq("seller_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Listing deleted successfully",
    });

    fetchListings();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cattle: "bg-primary/10 text-primary",
      goat: "bg-secondary/10 text-secondary",
      sheep: "bg-accent/10 text-accent",
      poultry: "bg-success/10 text-success",
      other: "bg-muted text-muted-foreground",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Browse livestock listings from farmers</p>
        </div>
        {user && (
          <Link to="/create-listing">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        )}
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No listings available yet</p>
            {user && (
              <Link to="/create-listing">
                <Button>Create First Listing</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {listing.image_urls && listing.image_urls.length > 0 ? (
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${getCategoryColor(listing.category)}`}>
                  {listing.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {listing.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      KES {listing.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {listing.location}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Seller: Verified Farmer
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleContactSeller(listing.seller_id)}
                >
                  Contact Seller
                </Button>
                {user && listing.seller_id === user.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Reach out to the seller using the information below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSeller?.full_name && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Name:</span>
                <span>{selectedSeller.full_name}</span>
              </div>
            )}
            {selectedSeller?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">Phone:</span>
                <a href={`tel:${selectedSeller.phone}`} className="text-primary hover:underline">
                  {selectedSeller.phone}
                </a>
              </div>
            )}
            {!selectedSeller?.phone && !selectedSeller?.full_name && (
              <p className="text-muted-foreground">No contact information available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
