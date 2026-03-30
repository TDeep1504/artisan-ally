import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye } from "lucide-react";

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", short_summary: "", materials: "",
    care_instructions: "", b2c_price: "", b2b_price: "", stock: "1",
    is_handmade: true, is_eco_friendly: false, bulk_order_suitable: false,
    export_suitable: false, tags: "",
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async (status: "draft" | "published") => {
    if (!user || !form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      title: form.title, description: form.description, short_summary: form.short_summary,
      materials: form.materials, care_instructions: form.care_instructions,
      b2c_price: form.b2c_price ? parseFloat(form.b2c_price) : null,
      b2b_price: form.b2b_price ? parseFloat(form.b2b_price) : null,
      stock: parseInt(form.stock) || 0,
      is_handmade: form.is_handmade, is_eco_friendly: form.is_eco_friendly,
      bulk_order_suitable: form.bulk_order_suitable, export_suitable: form.export_suitable,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      status,
    });
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Product saved!" }); navigate("/seller/products"); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Add Product</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Product title" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => update("description", e.target.value)} rows={5} />
          </div>
          <div className="space-y-2">
            <Label>Short Summary</Label>
            <Input value={form.short_summary} onChange={e => update("short_summary", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Materials</Label><Input value={form.materials} onChange={e => update("materials", e.target.value)} /></div>
            <div className="space-y-2"><Label>Care Instructions</Label><Input value={form.care_instructions} onChange={e => update("care_instructions", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>B2C Price (₹)</Label><Input type="number" value={form.b2c_price} onChange={e => update("b2c_price", e.target.value)} /></div>
            <div className="space-y-2"><Label>B2B Price (₹)</Label><Input type="number" value={form.b2b_price} onChange={e => update("b2b_price", e.target.value)} /></div>
            <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => update("stock", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="handmade, bamboo, eco-friendly" /></div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Handmade", key: "is_handmade" },
              { label: "Eco-Friendly", key: "is_eco_friendly" },
              { label: "Bulk Order Suitable", key: "bulk_order_suitable" },
              { label: "Export Suitable", key: "export_suitable" },
            ].map(f => (
              <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={(form as any)[f.key]} onChange={() => update(f.key, !(form as any)[f.key])} className="rounded" />
                {f.label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
        <Button onClick={() => handleSave("published")} disabled={saving}><Eye className="h-4 w-4 mr-2" /> Publish</Button>
      </div>
    </div>
  );
};

export default AddProductPage;
