import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Commission {
  id: string;
  amount: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
  listing_id: string;
  seller_id: string;
}

interface Stats {
  totalListings: number;
  totalUsers: number;
  totalCommissions: number;
  pendingCommissions: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    totalUsers: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
  });
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isSuperAdmin = roles?.some((r) => r.role === "superadmin");
      
      if (!isSuperAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [listingsRes, usersRes, commissionsRes] = await Promise.all([
        supabase.from("livestock_listings").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("commissions").select("*"),
      ]);

      const commissionsData = commissionsRes.data || [];
      const totalCommissionsAmount = commissionsData.reduce(
        (sum, c) => sum + Number(c.commission_amount || 0),
        0
      );
      const pendingCommissionsAmount = commissionsData
        .filter((c) => c.status === "pending")
        .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

      setStats({
        totalListings: listingsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalCommissions: totalCommissionsAmount,
        pendingCommissions: pendingCommissionsAmount,
      });

      setCommissions(commissionsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform performance and manage commissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Live on marketplace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
          <CardDescription>Track your earnings from platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sale Amount</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Your Earnings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No commissions yet
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      {new Date(commission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${Number(commission.amount).toFixed(2)}</TableCell>
                    <TableCell>{commission.commission_rate}%</TableCell>
                    <TableCell className="font-semibold">
                      ${Number(commission.commission_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          commission.status === "completed"
                            ? "default"
                            : commission.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {commission.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
