import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Package, ShoppingCart, AlertTriangle, IndianRupee, Shield, CheckCircle, XCircle, Flag, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SellerRow {
  id: string;
  user_id: string;
  store_name: string;
  seller_type: string | null;
  verification_status: string | null;
  is_verified: boolean | null;
  is_women_led: boolean | null;
  profile_completion: number | null;
  created_at: string;
  profile?: { full_name: string | null; email: string | null } | null;
}

interface ProductRow {
  id: string;
  title: string;
  status: string | null;
  b2c_price: number | null;
  stock: number | null;
  seller_id: string;
  created_at: string;
  seller_profile?: { store_name: string } | null;
}

interface OrderRow {
  id: string;
  total_amount: number;
  platform_fee: number | null;
  seller_payout: number | null;
  status: string | null;
  created_at: string;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

const AdminDashboard = () => {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Category form state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryRow | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [sellersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
      supabase.from("seller_profiles").select("*"),
      supabase.from("products").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("categories").select("*"),
    ]);
    
    // Fetch profile info for sellers
    const sellerData = sellersRes.data || [];
    if (sellerData.length > 0) {
      const userIds = sellerData.map(s => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      sellerData.forEach((s: any) => { s.profile = profileMap.get(s.user_id) || null; });
    }

    // Fetch seller store names for products
    const productData = productsRes.data || [];
    if (productData.length > 0) {
      const sellerIds = [...new Set(productData.map(p => p.seller_id))];
      const { data: sellerProfiles } = await supabase.from("seller_profiles").select("user_id, store_name").in("user_id", sellerIds);
      const sellerMap = new Map(sellerProfiles?.map(s => [s.user_id, s]) || []);
      productData.forEach((p: any) => { p.seller_profile = sellerMap.get(p.seller_id) || null; });
    }

    setSellers(sellerData as SellerRow[]);
    setProducts(productData as ProductRow[]);
    setOrders(ordersRes.data || []);
    setCategories(categoriesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.platform_fee || 0), 0);
  const pendingSellers = sellers.filter(s => s.verification_status === "pending");
  const verifiedSellers = sellers.filter(s => s.is_verified);
  const flaggedProducts = products.filter(p => p.status === "flagged");
  const totalOrders = orders.length;

  // Seller actions
  const updateSellerStatus = async (sellerId: string, status: "approved" | "rejected") => {
    const isApproved = status === "approved";
    const { error } = await supabase.from("seller_profiles").update({
      verification_status: status,
      is_verified: isApproved,
    }).eq("id", sellerId);
    if (error) { toast.error("Failed to update seller"); return; }
    toast.success(`Seller ${status}`);
    fetchAll();
  };

  // Product actions
  const updateProductStatus = async (productId: string, status: string) => {
    const { error } = await supabase.from("products").update({ status }).eq("id", productId);
    if (error) { toast.error("Failed to update product"); return; }
    toast.success(`Product ${status}`);
    fetchAll();
  };

  // Category CRUD
  const openCatDialog = (cat?: CategoryRow) => {
    if (cat) {
      setEditingCat(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDesc(cat.description || "");
      setCatIcon(cat.icon || "");
    } else {
      setEditingCat(null);
      setCatName("");
      setCatSlug("");
      setCatDesc("");
      setCatIcon("");
    }
    setCatDialogOpen(true);
  };

  const saveCat = async () => {
    if (!catName || !catSlug) { toast.error("Name and slug are required"); return; }
    const payload = { name: catName, slug: catSlug, description: catDesc || null, icon: catIcon || null };
    if (editingCat) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingCat.id);
      if (error) { toast.error("Failed to update category"); return; }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { toast.error("Failed to create category"); return; }
      toast.success("Category created");
    }
    setCatDialogOpen(false);
    fetchAll();
  };

  const deleteCat = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error("Failed to delete category"); return; }
    toast.success("Category deleted");
    fetchAll();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Sellers", value: String(sellers.length), icon: Users, color: "text-primary" },
          { label: "Total Products", value: String(products.length), icon: Package, color: "text-olive" },
          { label: "Total Orders", value: String(totalOrders), icon: ShoppingCart, color: "text-gold" },
          { label: "Pending Approval", value: String(pendingSellers.length), icon: AlertTriangle, color: "text-accent" },
          { label: "Revenue (Fees)", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-earth" },
          { label: "Verified Sellers", value: String(verifiedSellers.length), icon: Shield, color: "text-olive" },
        ].map((s) => (
          <Card key={s.label} className="haathse-card-hover">
            <CardContent className="p-4 text-center">
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-bold font-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sellers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Sellers Tab */}
        <TabsContent value="sellers">
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Manage Sellers</CardTitle></CardHeader>
            <CardContent>
              {sellers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No sellers registered yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store Name</TableHead>
                      <TableHead className="hidden md:table-cell">Owner</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Completion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.store_name}</TableCell>
                        <TableCell className="hidden md:table-cell">{s.profile?.full_name || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="capitalize">{s.seller_type || "individual"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.verification_status === "approved" ? "default" : s.verification_status === "rejected" ? "destructive" : "secondary"} className="capitalize">
                            {s.verification_status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{s.profile_completion || 0}%</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {s.verification_status !== "approved" && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => updateSellerStatus(s.id, "approved")} title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {s.verification_status !== "rejected" && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => updateSellerStatus(s.id, "rejected")} title="Reject">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Manage Products</CardTitle></CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No products listed yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Seller</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{p.seller_profile?.store_name || "—"}</TableCell>
                        <TableCell>₹{p.b2c_price?.toLocaleString("en-IN") || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "published" ? "default" : p.status === "flagged" ? "destructive" : "secondary"} className="capitalize">
                            {p.status || "draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {p.status !== "published" && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => updateProductStatus(p.id, "published")} title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {p.status !== "flagged" && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-600" onClick={() => updateProductStatus(p.id, "flagged")} title="Flag">
                                <Flag className="h-4 w-4" />
                              </Button>
                            )}
                            {p.status === "flagged" && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => updateProductStatus(p.id, "removed")} title="Remove">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Revenue from Platform Fees</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total GMV</p>
                        <p className="text-xl font-bold font-heading">₹{orders.reduce((s, o) => s + o.total_amount, 0).toLocaleString("en-IN")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Platform Fees</p>
                        <p className="text-xl font-bold font-heading text-primary">₹{totalRevenue.toLocaleString("en-IN")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Seller Payouts</p>
                        <p className="text-xl font-bold font-heading">₹{orders.reduce((s, o) => s + (o.seller_payout || 0), 0).toLocaleString("en-IN")}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Payout</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}…</TableCell>
                          <TableCell>₹{o.total_amount.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-primary font-medium">₹{(o.platform_fee || 0).toLocaleString("en-IN")}</TableCell>
                          <TableCell>₹{(o.seller_payout || 0).toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <Badge variant={o.status === "delivered" ? "default" : "secondary"} className="capitalize">{o.status || "pending"}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs">{new Date(o.created_at).toLocaleDateString("en-IN")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg">Manage Categories</CardTitle>
              <Button size="sm" onClick={() => openCatDialog()}>
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </Button>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No categories</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Slug</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-xl">{c.icon || "📦"}</TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{c.slug}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{c.description || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openCatDialog(c)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => deleteCat(c.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCat ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={catName} onChange={(e) => { setCatName(e.target.value); if (!editingCat) setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} placeholder="e.g. Textiles & Handloom" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="e.g. textiles-handloom" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Short description" />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input value={catIcon} onChange={(e) => setCatIcon(e.target.value)} placeholder="🧵" />
            </div>
            <Button className="w-full" onClick={saveCat}>{editingCat ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
