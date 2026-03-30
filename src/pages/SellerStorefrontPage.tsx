import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Leaf, Package, MapPin, Users } from "lucide-react";

const SellerStorefrontPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    const load = async () => {
      const { data: sp } = await supabase.from("seller_profiles").select("*").eq("user_id", sellerId).single();
      setSeller(sp);
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", sellerId).single();
      setProfile(prof);
      const { data: prods } = await supabase.from("products").select("*").eq("seller_id", sellerId).eq("status", "published").order("created_at", { ascending: false });
      setProducts(prods || []);
      setLoading(false);
    };
    load();
  }, [sellerId]);

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!seller) return <div className="text-center py-20"><h2 className="font-heading text-2xl">Seller not found</h2></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seller header */}
      <div className="bg-card rounded-xl p-6 md:p-8 mb-8 border">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading text-2xl font-bold">{seller.store_name}</h1>
              {seller.is_verified && <Badge className="bg-olive text-olive-foreground">Verified</Badge>}
              {seller.is_women_led && <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" />Women-Led</Badge>}
            </div>
            <p className="text-sm text-muted-foreground capitalize">{seller.seller_type?.replace("_", " ") || "Artisan"}</p>
            {(profile?.state || profile?.country) && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{[profile?.village, profile?.district, profile?.state, profile?.country].filter(Boolean).join(", ")}</p>
            )}
            {seller.store_bio && <p className="mt-3 text-sm">{seller.store_bio}</p>}
          </div>
        </div>
        {seller.artisan_story && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-heading font-semibold mb-2">Our Story</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{seller.artisan_story}</p>
          </div>
        )}
      </div>

      {/* Products */}
      <h2 className="font-heading text-xl font-bold mb-4">Products ({products.length})</h2>
      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <Link to={`/product/${p.id}`} key={p.id}>
              <Card className="haathse-card-hover h-full">
                <div className="aspect-square bg-secondary rounded-t-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/20" />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-heading font-semibold text-sm line-clamp-2">{p.title}</h3>
                  <p className="text-primary font-bold mt-2">₹{p.b2c_price || "—"}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerStorefrontPage;
