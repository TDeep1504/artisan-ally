import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Store, Building2, User } from "lucide-react";

type RoleOption = {
  value: "buyer" | "seller" | "business_buyer";
  label: string;
  description: string;
  icon: React.ReactNode;
};

const roles: RoleOption[] = [
  { value: "buyer", label: "Buyer", description: "Browse and buy handmade products", icon: <ShoppingBag className="h-6 w-6" /> },
  { value: "seller", label: "Seller / Artisan", description: "Sell your handcrafted products", icon: <Store className="h-6 w-6" /> },
  { value: "business_buyer", label: "Business Buyer", description: "Wholesale & bulk purchasing", icon: <Building2 className="h-6 w-6" /> },
];

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<RoleOption["value"] | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName, selectedRole);
    setIsLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Join HaathSe</CardTitle>
          <CardDescription>Choose how you want to use the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                    selectedRole === role.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={selectedRole === role.value ? "text-primary" : "text-muted-foreground"}>{role.icon}</div>
                  <span className="text-sm font-medium">{role.label}</span>
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !selectedRole}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
