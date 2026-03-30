import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = ["Store Info", "Location", "Bank Details", "Your Story"];

const SellerOnboardingPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    store_name: "",
    seller_type: "",
    store_bio: "",
    artisan_story: "",
    is_women_led: false,
    categories: [] as string[],
    bank_name: "",
    bank_account: "",
    bank_ifsc: "",
    upi_id: "",
    country: "",
    state: "",
    district: "",
    village: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;
    // Load existing seller profile
    supabase.from("seller_profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setForm(prev => ({
          ...prev,
          store_name: data.store_name || "",
          seller_type: data.seller_type || "",
          store_bio: data.store_bio || "",
          artisan_story: data.artisan_story || "",
          is_women_led: data.is_women_led || false,
          categories: data.categories || [],
          bank_name: data.bank_name || "",
          bank_account: data.bank_account || "",
          bank_ifsc: data.bank_ifsc || "",
          upi_id: data.upi_id || "",
        }));
      }
    });
    // Load profile location
    if (profile) {
      setForm(prev => ({
        ...prev,
        country: profile.country || "",
        state: profile.state || "",
        phone: "",
      }));
    }
  }, [user, profile]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const computeCompletion = () => {
    let total = 0;
    if (form.store_name) total += 15;
    if (form.seller_type) total += 10;
    if (form.store_bio) total += 10;
    if (form.country && form.state) total += 15;
    if (form.bank_name && form.bank_account) total += 20;
    if (form.artisan_story) total += 15;
    if (form.categories.length > 0) total += 15;
    return Math.min(total, 100);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const completion = computeCompletion();

    // Upsert seller profile
    const { error: sellerError } = await supabase.from("seller_profiles").upsert({
      user_id: user.id,
      store_name: form.store_name || "My Store",
      seller_type: form.seller_type,
      store_bio: form.store_bio,
      artisan_story: form.artisan_story,
      is_women_led: form.is_women_led,
      categories: form.categories,
      bank_name: form.bank_name,
      bank_account: form.bank_account,
      bank_ifsc: form.bank_ifsc,
      upi_id: form.upi_id,
      profile_completion: completion,
    }, { onConflict: "user_id" });

    // Update profile location
    await supabase.from("profiles").update({
      country: form.country,
      state: form.state,
      district: form.district,
      village: form.village,
      phone: form.phone,
    }).eq("user_id", user.id);

    setSaving(false);
    if (sellerError) {
      toast({ title: "Error saving", description: sellerError.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved!" });
      if (step === STEPS.length - 1) navigate("/seller/dashboard");
    }
  };

  const categoryOptions = ["Textiles & Handloom", "Pottery & Ceramics", "Woodwork", "Bamboo & Cane", "Jewelry", "Paintings & Art", "Home Decor", "Food & Spices"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Seller Onboarding</h1>
        <p className="text-muted-foreground mt-1">Set up your store to start selling on HaathSe</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1 ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
      </div>

      {/* Step 0: Store Info */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Store Information</CardTitle>
            <CardDescription>Tell us about your craft business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Name *</Label>
              <Input value={form.store_name} onChange={e => update("store_name", e.target.value)} placeholder="e.g. Warli Art Collective" />
            </div>
            <div className="space-y-2">
              <Label>Seller Type</Label>
              <Select value={form.seller_type} onValueChange={v => update("seller_type", v)}>
                <SelectTrigger><SelectValue placeholder="Select your type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Artisan</SelectItem>
                  <SelectItem value="shg">Self-Help Group (SHG)</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="rural_business">Rural Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Store Bio</Label>
              <Textarea value={form.store_bio} onChange={e => update("store_bio", e.target.value)} placeholder="A short description of your store" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.categories.includes(cat)}
                      onCheckedChange={(checked) => {
                        if (checked) update("categories", [...form.categories, cat]);
                        else update("categories", form.categories.filter(c => c !== cat));
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={form.is_women_led} onCheckedChange={v => update("is_women_led", !!v)} />
              <Label className="cursor-pointer">This is a women-led group / business</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Location */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Location & Contact</CardTitle>
            <CardDescription>Where are you based?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={form.country} onChange={e => update("country", e.target.value)} placeholder="India" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={form.state} onChange={e => update("state", e.target.value)} placeholder="Maharashtra" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={form.district} onChange={e => update("district", e.target.value)} placeholder="Thane" />
              </div>
              <div className="space-y-2">
                <Label>Village / Town</Label>
                <Input value={form.village} onChange={e => update("village", e.target.value)} placeholder="Your village" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Bank Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Payment Details</CardTitle>
            <CardDescription>Where should we send your earnings?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input value={form.bank_name} onChange={e => update("bank_name", e.target.value)} placeholder="State Bank of India" />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input value={form.bank_account} onChange={e => update("bank_account", e.target.value)} placeholder="Account number" />
            </div>
            <div className="space-y-2">
              <Label>IFSC Code</Label>
              <Input value={form.bank_ifsc} onChange={e => update("bank_ifsc", e.target.value)} placeholder="SBIN0001234" />
            </div>
            <div className="space-y-2">
              <Label>UPI ID (optional)</Label>
              <Input value={form.upi_id} onChange={e => update("upi_id", e.target.value)} placeholder="yourname@upi" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Artisan Story */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Your Artisan Story</CardTitle>
            <CardDescription>Share your journey — buyers love authentic stories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={form.artisan_story}
              onChange={e => update("artisan_story", e.target.value)}
              placeholder="Tell us about your craft tradition, how you learned it, what inspires you, and what makes your products special..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">This will be shown on your seller storefront page.</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => { handleSave(); setStep(s => s + 1); }}>
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Complete Setup"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SellerOnboardingPage;
