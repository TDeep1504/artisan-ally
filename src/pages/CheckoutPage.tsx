import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [address, setAddress] = useState({ name: "", line1: "", city: "", state: "", pincode: "", phone: "" });
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: cart } = await supabase.from("cart_items").select("*").eq("user_id", user.id);
      if (!cart?.length) { navigate("/cart"); return; }
      const pIds = cart.map(c => c.product_id);
      const { data: prods } = await supabase.from("products").select("id, title, b2c_price, seller_id").in("id", pIds);
      setCartItems(cart.map(c => ({ ...c, product: prods?.find(p => p.id === c.product_id) })));
    };
    load();
  }, [user]);

  const subtotal = cartItems.reduce((a, i) => a + (i.product?.b2c_price || 0) * (i.quantity || 1), 0);
  const fee = cartItems.length * 100;

  const placeOrder = async () => {
    if (!address.name || !address.line1 || !address.city) {
      toast({ title: "Please fill shipping address", variant: "destructive" });
      return;
    }
    setPlacing(true);

    // Group items by seller
    const bySeller: Record<string, any[]> = {};
    cartItems.forEach(i => {
      const sid = i.product?.seller_id;
      if (sid) { bySeller[sid] = bySeller[sid] || []; bySeller[sid].push(i); }
    });

    for (const [sellerId, items] of Object.entries(bySeller)) {
      const orderTotal = items.reduce((a: number, i: any) => a + (i.product?.b2c_price || 0) * (i.quantity || 1), 0);
      const orderFee = items.length * 100;
      await supabase.from("orders").insert({
        buyer_id: user!.id,
        seller_id: sellerId,
        total_amount: orderTotal + orderFee,
        platform_fee: orderFee,
        seller_payout: orderTotal - orderFee,
        shipping_address: address,
        status: "pending",
      });
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", user!.id);
    setPlacing(false);
    setDone(true);
    toast({ title: "Order placed successfully!" });
  };

  if (done) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-olive" />
      <h1 className="font-heading text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-6">Your order has been placed. The artisan will prepare your handcrafted items.</p>
      <div className="flex gap-3 justify-center">
        <Button onClick={() => navigate("/buyer/dashboard")}>My Orders</Button>
        <Button variant="outline" onClick={() => navigate("/marketplace")}>Continue Shopping</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Shipping Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Full Name *</Label><Input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Address Line *</Label><Input value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>City *</Label><Input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} /></div>
                <div className="space-y-2"><Label>State</Label><Input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Pincode</Label><Input value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} /></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span>Items ({cartItems.length})</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Platform Fee</span><span>₹{fee}</span></div>
            <div className="border-t pt-3 flex justify-between font-semibold"><span>Total</span><span>₹{subtotal + fee}</span></div>
            <Button className="w-full" onClick={placeOrder} disabled={placing}>{placing ? "Placing order..." : "Place Order"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
