import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingCart, Eye, Star, TrendingUp, MessageSquare } from "lucide-react";

const stats = [
  { label: "Total Products", value: "12", icon: Package, color: "text-primary" },
  { label: "Active Listings", value: "8", icon: Eye, color: "text-olive" },
  { label: "Total Sales", value: "₹24,500", icon: TrendingUp, color: "text-gold" },
  { label: "Pending Orders", value: "3", icon: ShoppingCart, color: "text-accent" },
  { label: "B2B Enquiries", value: "5", icon: MessageSquare, color: "text-earth" },
  { label: "Avg. Rating", value: "4.5 ★", icon: Star, color: "text-gold" },
];

const SellerDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || "Artisan"}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="haathse-card-hover">
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="text-primary font-medium">60%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary" style={{ width: "60%" }} />
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-olive">✓</span> Basic profile</li>
                <li className="flex items-center gap-2"><span className="text-olive">✓</span> Store name</li>
                <li className="flex items-center gap-2"><span className="text-olive">✓</span> Contact details</li>
                <li className="flex items-center gap-2"><span className="text-warm-gray">○</span> Bank details</li>
                <li className="flex items-center gap-2"><span className="text-warm-gray">○</span> Artisan story</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground text-center py-8">No orders yet. Start listing products to receive orders!</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Add Product", emoji: "📦" },
                { label: "AI Listing Studio", emoji: "✨" },
                { label: "View Orders", emoji: "📋" },
                { label: "Manage Inventory", emoji: "📊" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl">{action.emoji}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
