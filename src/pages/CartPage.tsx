import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: { id: string; title: string; b2c_price: number | null; seller_id: string };
}

const CartPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return;
    const { data: cartData } = await supabase.from("cart_items").select("*").eq("user_id", user.id);
    if (!cartData?.length) { setItems([]); setLoading(false); return; }

    const productIds = cartData.map(c => c.product_id);
    const { data: products } = await supabase.from("products").select("id, title, b2c_price, seller_id").in("id", productIds);

    const merged = cartData.map(c => ({
      ...c,
      quantity: c.quantity ?? 1,
      product: products?.find(p => p.id === c.product_id),
    }));
    setItems(merged);
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({ title: "Removed from cart" });
  };

  const subtotal = items.reduce((acc, i) => acc + (i.product?.b2c_price || 0) * i.quantity, 0);
  const platformFee = items.length > 0 ? 100 * items.length : 0;
  const total = subtotal + platformFee;

  if (!user) return <div className="text-center py-20"><p>Please <Link to="/login" className="text-primary underline">sign in</Link> to view your cart.</p></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-heading text-2xl font-semibold mb-2">Cart is empty</h2>
          <Link to="/marketplace"><Button>Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map(item => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product_id}`} className="font-heading font-semibold hover:text-primary truncate block">
                      {item.product?.title || "Product"}
                    </Link>
                    <p className="text-sm text-muted-foreground">₹{item.product?.b2c_price || 0}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Platform Fee</span><span>₹{platformFee}</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></div>
              <Button className="w-full" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
              <p className="text-xs text-muted-foreground text-center">₹100 marketplace fee per item goes to HaathSe</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;
