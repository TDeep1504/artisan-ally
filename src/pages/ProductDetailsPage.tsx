import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Shield, Leaf, Users, Package } from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSellerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: p } = await supabase.from("products").select("*").eq("id", id).single();
      setProduct(p);
      if (p) {
        const { data: sp } = await supabase.from("seller_profiles").select("*").eq("user_id", p.seller_id).single();
        setSellerProfile(sp);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; }
    const { error } = await supabase.from("cart_items").insert({ user_id: user.id, product_id: id!, quantity: 1 });
    if (error?.code === "23505") toast({ title: "Already in cart" });
    else if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Added to cart!" });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!product) return <div className="text-center py-20"><h2 className="font-heading text-2xl">Product not found</h2></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image placeholder */}
        <div className="bg-secondary rounded-xl aspect-square flex items-center justify-center">
          <Package className="h-20 w-20 text-muted-foreground/30" />
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.is_handmade && <Badge variant="secondary" className="gap-1"><Heart className="h-3 w-3" /> Handmade</Badge>}
            {product.is_eco_friendly && <Badge variant="secondary" className="gap-1"><Leaf className="h-3 w-3" /> Eco-Friendly</Badge>}
            {product.bulk_order_suitable && <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" /> Bulk Available</Badge>}
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">{product.title}</h1>
          {product.short_summary && <p className="text-muted-foreground mb-4">{product.short_summary}</p>}
          
          <div className="flex items-baseline gap-4 mb-6">
            {product.b2c_price && <span className="text-3xl font-bold text-primary">₹{product.b2c_price}</span>}
            {product.b2b_price && <span className="text-sm text-muted-foreground">B2B: ₹{product.b2b_price}/unit</span>}
          </div>

          <div className="flex gap-3 mb-8">
            <Button className="flex-1 gap-2" onClick={addToCart}><ShoppingCart className="h-4 w-4" /> Add to Cart</Button>
            <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
          </div>

          {/* Product info */}
          <div className="space-y-4 text-sm">
            {product.materials && <div><span className="font-medium">Materials:</span> {product.materials}</div>}
            {product.care_instructions && <div><span className="font-medium">Care:</span> {product.care_instructions}</div>}
            <div><span className="font-medium">Stock:</span> {product.stock ?? 0} available</div>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag: string) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
              </div>
            )}
          </div>

          {/* Seller info */}
          {seller && (
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold">{seller.store_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{seller.seller_type?.replace("_", " ") || "Artisan"} {seller.is_verified && "• Verified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h3 className="font-heading font-semibold text-lg mb-2">About this product</h3>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
