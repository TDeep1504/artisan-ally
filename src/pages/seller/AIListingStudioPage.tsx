import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Upload, Loader2, Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIListingStudioPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [rawNotes, setRawNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generated fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [materials, setMaterials] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [b2cPrice, setB2cPrice] = useState("");
  const [b2bPrice, setB2bPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [bulkOrderSuitable, setBulkOrderSuitable] = useState(false);
  const [exportSuitable, setExportSuitable] = useState(false);
  const [isHandmade, setIsHandmade] = useState(true);
  const [isEcoFriendly, setIsEcoFriendly] = useState(false);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) {
      toast({ title: "Enter product notes", description: "Describe your product so AI can generate a listing.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-listing", {
        body: { notes: rawNotes },
      });
      if (error) throw error;
      const result = data;
      setTitle(result.title || "");
      setDescription(result.description || "");
      setShortSummary(result.short_summary || "");
      setTags(result.tags || []);
      setMaterials(result.materials || "");
      setCareInstructions(result.care_instructions || "");
      setSuggestedCategory(result.suggested_category || "");
      setBulkOrderSuitable(result.bulk_order_suitable || false);
      setExportSuitable(result.export_suitable || false);
      toast({ title: "Listing generated!", description: "Review and edit before publishing." });
    } catch (err: any) {
      toast({ title: "AI generation failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!user || !title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      title,
      description,
      short_summary: shortSummary,
      tags,
      materials,
      care_instructions: careInstructions,
      b2c_price: b2cPrice ? parseFloat(b2cPrice) : null,
      b2b_price: b2bPrice ? parseFloat(b2bPrice) : null,
      stock: parseInt(stock) || 0,
      bulk_order_suitable: bulkOrderSuitable,
      export_suitable: exportSuitable,
      is_handmade: isHandmade,
      is_eco_friendly: isEcoFriendly,
      ai_generated: true,
      status,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "published" ? "Product published!" : "Draft saved!" });
      navigate("/seller/products");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" /> AI Listing Studio
        </h1>
        <p className="text-muted-foreground mt-1">Describe your product and let AI create a professional listing</p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Step 1: Describe Your Product</CardTitle>
          <CardDescription>Enter raw notes, spoken details, or a brief description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={rawNotes}
            onChange={e => setRawNotes(e.target.value)}
            placeholder="e.g. I make bamboo baskets, handwoven, takes 2 days, natural colors, good for home decor, eco-friendly, we are a women group from Assam..."
            rows={5}
          />
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generating..." : "Generate Listing"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Listing */}
      {title && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Step 2: Review & Edit</CardTitle>
              <CardDescription>AI-generated listing — edit anything before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} />
              </div>
              <div className="space-y-2">
                <Label>Short Summary (SEO)</Label>
                <Textarea value={shortSummary} onChange={e => setShortSummary(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setTags(tags.filter((_, j) => j !== i))}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Add tag and press Enter" onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !tags.includes(val)) setTags([...tags, val]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Materials</Label>
                  <Input value={materials} onChange={e => setMaterials(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Suggested Category</Label>
                  <Input value={suggestedCategory} onChange={e => setSuggestedCategory(e.target.value)} readOnly className="bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Care Instructions</Label>
                <Textarea value={careInstructions} onChange={e => setCareInstructions(e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Step 3: Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>B2C Price (₹)</Label>
                  <Input type="number" value={b2cPrice} onChange={e => setB2cPrice(e.target.value)} placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label>B2B Price (₹)</Label>
                  <Input type="number" value={b2bPrice} onChange={e => setB2bPrice(e.target.value)} placeholder="350" />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="10" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Handmade", value: isHandmade, set: setIsHandmade },
                  { label: "Eco-Friendly", value: isEcoFriendly, set: setIsEcoFriendly },
                  { label: "Bulk Order Suitable", value: bulkOrderSuitable, set: setBulkOrderSuitable },
                  { label: "Export Suitable", value: exportSuitable, set: setExportSuitable },
                ].map(flag => (
                  <label key={flag.label} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={flag.value} onChange={() => flag.set(!flag.value)} className="rounded" />
                    {flag.label}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <Button onClick={() => handleSave("published")} disabled={saving}>
              <Eye className="h-4 w-4 mr-2" /> Publish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIListingStudioPage;
