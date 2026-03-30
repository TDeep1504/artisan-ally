import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Leaf, Package, Search } from "lucide-react";

const filterOptions = ["All", "Textiles & Handloom", "Pottery & Ceramics", "Woodwork", "Bamboo & Cane", "Jewelry", "Paintings & Art", "Home Decor", "Food & Spices"];

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    const load = async () => {
      let query = supabase.from("products").select("*").eq("status", "published").order("created_at", { ascending: false });
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    load();
  }, [search]);

  const filtered = activeFilter === "All" ? products : products.filter(p => p.tags?.some((t: string) => t.toLowerCase().includes(activeFilter.toLowerCase().split(" ")[0].toLowerCase())));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground mt-1">Discover authentic handmade products from artisans worldwide</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              f === activeFilter ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🛍️</span>
          <h2 className="font-heading text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">Try a different search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Link to={`/product/${p.id}`} key={p.id}>
              <Card className="haathse-card-hover h-full">
                <div className="aspect-square bg-secondary rounded-t-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/20" />
                </div>
                <CardContent className="p-3">
                  <div className="flex gap-1 mb-2">
                    {p.is_handmade && <Badge variant="outline" className="text-[10px] px-1"><Heart className="h-2 w-2 mr-0.5" />Handmade</Badge>}
                    {p.is_eco_friendly && <Badge variant="outline" className="text-[10px] px-1"><Leaf className="h-2 w-2 mr-0.5" />Eco</Badge>}
                  </div>
                  <h3 className="font-heading font-semibold text-sm line-clamp-2">{p.title}</h3>
                  {p.short_summary && <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.short_summary}</p>}
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

export default MarketplacePage;
