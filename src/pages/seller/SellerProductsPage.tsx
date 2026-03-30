import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Sparkles, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Product {
  id: string;
  title: string;
  b2c_price: number | null;
  stock: number | null;
  status: string | null;
  views: number | null;
  sales: number | null;
  created_at: string;
}

const SellerProductsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("products")
      .select("id, title, b2c_price, stock, status, views, sales, created_at")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [user]);

  const toggleStatus = async (id: string, current: string | null) => {
    const newStatus = current === "published" ? "draft" : "published";
    await supabase.from("products").update({ status: newStatus }).eq("id", id);
    toast({ title: `Product ${newStatus}` });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/seller/listing-studio">
            <Button className="gap-2"><Sparkles className="h-4 w-4" /> AI Listing</Button>
          </Link>
          <Link to="/seller/products/new">
            <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Manual</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📦</span>
          <h2 className="font-heading text-2xl font-semibold mb-2">No products yet</h2>
          <p className="text-muted-foreground mb-4">Create your first listing using our AI studio!</p>
          <Link to="/seller/listing-studio"><Button className="gap-2"><Sparkles className="h-4 w-4" /> AI Listing Studio</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <Card key={p.id} className="haathse-card-hover">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold truncate">{p.title}</h3>
                    <Badge variant={p.status === "published" ? "default" : "secondary"}>
                      {p.status || "draft"}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {p.b2c_price && <span>₹{p.b2c_price}</span>}
                    <span>Stock: {p.stock ?? 0}</span>
                    <span>Views: {p.views ?? 0}</span>
                    <span>Sales: {p.sales ?? 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(p.id, p.status)} title={p.status === "published" ? "Unpublish" : "Publish"}>
                    {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Link to={`/seller/products/${p.id}/edit`}>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
