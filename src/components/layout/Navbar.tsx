import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (roles.includes("admin")) return "/admin";
    if (roles.includes("seller")) return "/seller/dashboard";
    if (roles.includes("business_buyer")) return "/business/dashboard";
    return "/buyer/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold haathse-gradient-text">HaathSe</span>
          <span className="hidden sm:inline text-xs text-muted-foreground font-body">Handmade with love</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/marketplace" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/b2b" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            For Business
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/cart">
                <Button variant="ghost" size="icon"><ShoppingCart className="h-5 w-5" /></Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{profile?.full_name || user.email}</div>
                  <div className="px-2 pb-1.5 text-xs text-muted-foreground capitalize">{roles[0]?.replace("_", " ") || "User"}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3 animate-fade-in">
          <Link to="/marketplace" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          <Link to="/about" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/b2b" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>For Business</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button className="block py-2 text-sm text-destructive" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
