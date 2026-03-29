import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Heart, Clock, Star } from "lucide-react";

const BuyerDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-1">Welcome, {profile?.full_name || "Shopper"}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Orders", value: "0", icon: ShoppingBag },
          { label: "Wishlist", value: "0", icon: Heart },
          { label: "Pending", value: "0", icon: Clock },
          { label: "Reviews", value: "0", icon: Star },
        ].map((s) => (
          <Card key={s.label} className="haathse-card-hover">
            <CardContent className="p-4 text-center">
              <s.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold font-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Recent Orders</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet. Explore the marketplace!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Recommended For You</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">Browse the marketplace to get personalized recommendations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;
