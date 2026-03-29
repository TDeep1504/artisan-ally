import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const B2BPage = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="font-heading text-4xl font-bold mb-4">HaathSe for Business</h1>
      <p className="text-lg text-muted-foreground">Source authentic handcrafted products directly from verified artisan groups, SHGs, and cooperatives.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {[
        { title: "Boutiques & Retailers", desc: "Curate unique collections sourced directly from artisans", emoji: "🏪" },
        { title: "Interior Designers", desc: "Find handcrafted decor and furniture for your projects", emoji: "🎨" },
        { title: "Wholesalers & Importers", desc: "Bulk order handmade products at competitive prices", emoji: "📦" },
      ].map((item) => (
        <Card key={item.title} className="haathse-card-hover">
          <CardContent className="p-6 text-center">
            <span className="text-4xl block mb-3">{item.emoji}</span>
            <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="text-center">
      <Link to="/register">
        <Button size="lg" className="gap-2">Register as Business Buyer <ArrowRight className="h-4 w-4" /></Button>
      </Link>
    </div>
  </div>
);

export default B2BPage;
