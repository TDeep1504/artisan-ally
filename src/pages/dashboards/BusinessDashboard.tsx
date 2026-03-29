import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, FileText, MessageSquare, TrendingUp } from "lucide-react";

const BusinessDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Business Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {profile?.full_name || "Partner"}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Enquiries", value: "0", icon: MessageSquare },
          { label: "Quotations", value: "0", icon: FileText },
          { label: "Orders", value: "0", icon: Building2 },
          { label: "Total Spent", value: "₹0", icon: TrendingUp },
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
          <CardHeader><CardTitle className="font-heading text-lg">My Enquiries</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">No enquiries yet. Browse sellers for bulk orders!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Discover Artisan Groups</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">Find verified SHGs and cooperatives for wholesale partnerships.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDashboard;
