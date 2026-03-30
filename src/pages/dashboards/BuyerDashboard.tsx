import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Clock, Star } from "lucide-react";

const BuyerDashboard = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false }).limit(10).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, [user]);

  const stats = [
    { label: "Orders", value: String(orders.length), icon: ShoppingBag },
    { label: "Pending", value: String(orders.filter(o => o.status === "pending").length), icon: Clock },
    { label: "Delivered", value: String(orders.filter(o => o.status === "delivered").length), icon: Heart },
    { label: "Reviews", value: "0", icon: Star },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-1">Welcome, {profile?.full_name || "Shopper"}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="haathse-card-hover">
            <CardContent className="p-4 text-center">
              <s.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold font-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">No orders yet.</p>
                <Link to="/marketplace"><Button size="sm">Browse Products</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between text-sm border-b pb-2">
                    <div>
                      <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{o.total_amount}</p>
                      <Badge variant="outline" className="text-[10px]">{o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Browse Products", emoji: "🛍️", to: "/marketplace" },
                { label: "My Cart", emoji: "🛒", to: "/cart" },
                { label: "Order History", emoji: "📋", to: "/buyer/dashboard" },
                { label: "My Profile", emoji: "👤", to: "/profile" },
              ].map(a => (
                <Link key={a.label} to={a.to}>
                  <button className="w-full flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <span className="text-2xl">{a.emoji}</span>
                    <span className="text-sm font-medium">{a.label}</span>
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

export default BuyerDashboard;
