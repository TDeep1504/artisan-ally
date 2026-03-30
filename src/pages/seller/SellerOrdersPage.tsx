import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-gold/20 text-gold-foreground",
  confirmed: "bg-primary/20 text-primary",
  shipped: "bg-olive/20 text-olive",
  delivered: "bg-olive text-olive-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase.from("orders").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    toast({ title: `Order ${status}` });
    fetchOrders();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Orders</h1>
      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20"><span className="text-6xl block mb-4">📋</span><p className="text-muted-foreground">No orders yet</p></div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-heading font-semibold">Order #{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[o.status || "pending"]}>{o.status || "pending"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm space-y-1">
                    <p>Total: <span className="font-semibold">₹{o.total_amount}</span></p>
                    <p className="text-muted-foreground">Your payout: ₹{o.seller_payout} (Fee: ₹{o.platform_fee})</p>
                  </div>
                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(o.id, "confirmed")}>Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, "cancelled")}>Cancel</Button>
                    </div>
                  )}
                  {o.status === "confirmed" && (
                    <Button size="sm" onClick={() => updateStatus(o.id, "shipped")}>Mark Shipped</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
