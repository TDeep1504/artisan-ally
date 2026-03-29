import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Sparkles, Globe, Heart, Users, Leaf } from "lucide-react";

const categories = [
  { name: "Textiles & Handloom", emoji: "🧵", slug: "textiles-handloom" },
  { name: "Pottery & Ceramics", emoji: "🏺", slug: "pottery-ceramics" },
  { name: "Woodwork", emoji: "🪵", slug: "woodwork" },
  { name: "Bamboo & Cane", emoji: "🎋", slug: "bamboo-cane" },
  { name: "Jewelry", emoji: "💍", slug: "jewelry" },
  { name: "Paintings & Art", emoji: "🎨", slug: "paintings-art" },
  { name: "Home Decor", emoji: "🏠", slug: "home-decor" },
  { name: "Food & Spices", emoji: "🌿", slug: "food-spices" },
];

const trustMarkers = [
  { icon: Shield, label: "Verified Artisans", desc: "Every seller is verified for authenticity" },
  { icon: Heart, label: "Handmade with Love", desc: "100% handcrafted by skilled artisans" },
  { icon: Leaf, label: "Eco-Friendly", desc: "Sustainable materials and processes" },
  { icon: Users, label: "Women-Led Groups", desc: "Supporting women's self-help groups" },
  { icon: Globe, label: "Global Shipping", desc: "Delivering craftsmanship worldwide" },
  { icon: Sparkles, label: "AI-Powered Listings", desc: "Smart tools help artisans sell better" },
];

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="haathse-gradient absolute inset-0 opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium tracking-widest uppercase text-accent mb-4 animate-fade-in">Empowering Rural Artisans</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Where <span className="haathse-gradient-text">Handmade</span> Meets the World
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              HaathSe connects rural artisans, self-help groups, and craft producers directly to buyers worldwide. AI-powered tools make selling effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/marketplace">
                <Button size="lg" className="gap-2">
                  Explore Marketplace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="gap-2">
                  Start Selling — It's Free
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Free to list. Only ₹100 platform fee per sale.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trustMarkers.map((t) => (
              <div key={t.label} className="text-center">
                <t.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold">Browse by Craft</h2>
          <p className="text-muted-foreground mt-2">Discover authentic handmade treasures from artisans across the globe</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link to={`/marketplace?category=${cat.slug}`} key={cat.slug}>
              <Card className="haathse-card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-3 block">{cat.emoji}</span>
                  <p className="font-heading font-semibold">{cat.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works for Sellers */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold">How HaathSe Works for Sellers</h2>
            <p className="text-muted-foreground mt-2">From photos to sales in minutes — powered by AI</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Sign up as an artisan, SHG, or cooperative — free forever." },
              { step: "2", title: "Upload Photos", desc: "Take product photos from your phone. That's all you need." },
              { step: "3", title: "AI Creates Your Listing", desc: "Our AI writes the title, description, tags, and suggests pricing." },
              { step: "4", title: "Start Selling", desc: "Your products go live. We handle the rest. You earn." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">
                  {s.step}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">For Business Buyers</p>
            <h2 className="font-heading text-3xl font-bold mb-4">Source Directly from Artisans</h2>
            <p className="text-muted-foreground mb-6">
              Boutiques, retailers, interior designers, and importers can discover artisan groups,
              request quotations, and place bulk orders with verified craft producers.
            </p>
            <ul className="space-y-3 mb-6">
              {["Verified SHGs & cooperatives", "Bulk pricing & MOQ support", "Direct communication with artisans", "Export-ready product discovery"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <span className="text-olive font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link to="/register">
              <Button className="gap-2">Register as Business Buyer <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="bg-secondary/50 rounded-xl p-8 text-center">
            <span className="text-6xl mb-4 block">🤝</span>
            <p className="font-heading text-xl font-semibold">B2B Marketplace</p>
            <p className="text-sm text-muted-foreground mt-2">Connect with 500+ artisan groups across India and beyond</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="haathse-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join HaathSe today and help preserve traditional craftsmanship while building sustainable livelihoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Selling <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
