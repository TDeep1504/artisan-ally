import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Eye, Star, TrendingUp, MessageSquare } from "lucide-react";

const SellerDashboard = () => {
  const { user, profile } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [sellerProfile, setSellerProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("products").select("id, status, sales", { count: "exact" }).eq("seller_id", user.id).then(({ data, count }) => {
      setProductCount(count || 0);
      setActiveCount(data?.filter(p => p.status === "published").length || 0);
    });
    supabase.from("orders").select("id, total_amount, seller_payout").eq("seller_id", user.id).then(({ data }) => {
      setOrderCount(data?.length || 0);
      setTotalSales(data?.reduce((a, o) => a + (o.seller_payout || 0), 0) || 0);
    });
    supabase.from("enquiries").select("id", { count: "exact" }).eq("seller_id", user.id).then(({ count }) => setEnquiryCount(count || 0));
    supabase.from("seller_profiles").select("*").eq("user_id", user.id).single().then(({ data }) => setSellerProfile(data));
  }, [user]);

  const stats = [
    { label: "Total Products", value: String(productCount), icon: Package, color: "text-primary" },
    { label: "Active Listings", value: String(activeCount), icon: Eye, color: "text-olive" },
    { label: "Earnings", value: `₹${totalSales}`, icon: TrendingUp, color: "text-gold" },
    { label: "Orders", value: String(orderCount), icon: ShoppingCart, color: "text-accent" },
    { label: "B2B Enquiries", value: String(enquiryCount), icon: MessageSquare, color: "text-earth" },
    { label: "Avg. Rating", value: "— ★", icon: Star, color: "text-gold" },
  ];

  const completion = sellerProfile?.profile_completion || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || "Artisan"}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.label} className="haathse-card-hover">
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="text-primary font-medium">{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
              </div>
              {completion < 100 && (
                <Link to="/seller/onboarding" className="text-sm text-primary hover:underline block mt-2">
                  Complete your profile →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "AI Listing", emoji: "✨", to: "/seller/listing-studio" },
                { label: "Add Product", emoji: "📦", to: "/seller/products/new" },
                { label: "My Products", emoji: "📋", to: "/seller/products" },
                { label: "Orders", emoji: "🛒", to: "/seller/orders" },
              ].map(action => (
                <Link key={action.label} to={action.to}>
                  <button className="w-full flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <span className="text-2xl">{action.emoji}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
