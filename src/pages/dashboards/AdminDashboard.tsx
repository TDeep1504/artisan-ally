import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, AlertTriangle, IndianRupee, Shield } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Sellers", value: "0", icon: Users, color: "text-primary" },
          { label: "Total Products", value: "0", icon: Package, color: "text-olive" },
          { label: "Total Orders", value: "0", icon: ShoppingCart, color: "text-gold" },
          { label: "Pending Approval", value: "0", icon: AlertTriangle, color: "text-accent" },
          { label: "Revenue (Fees)", value: "₹0", icon: IndianRupee, color: "text-earth" },
          { label: "Verified Sellers", value: "0", icon: Shield, color: "text-olive" },
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

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Pending Sellers</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">No sellers awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Flagged Products</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">No flagged listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Recent B2B Enquiries</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">No enquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      <Card className="mt-6">
        <CardHeader><CardTitle className="font-heading text-lg">Management</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Manage Sellers", emoji: "👥" },
              { label: "Manage Products", emoji: "📦" },
              { label: "Manage Categories", emoji: "📂" },
              { label: "Fee Configuration", emoji: "💰" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-sm font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
