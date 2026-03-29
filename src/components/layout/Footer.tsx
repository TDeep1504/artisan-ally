import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-xl font-bold haathse-gradient-text mb-3">HaathSe</h3>
          <p className="text-sm text-muted-foreground">Empowering rural artisans to reach global markets. Every purchase supports a maker's livelihood.</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">For Buyers</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Browse Products</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
            <li><Link to="/b2b" className="hover:text-foreground transition-colors">Bulk Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">For Sellers</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/register" className="hover:text-foreground transition-colors">Start Selling</Link></li>
            <li><Link to="/seller/dashboard" className="hover:text-foreground transition-colors">Seller Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>help@haathse.com</li>
            <li>Free listing, ₹100 fee per sale</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HaathSe. All rights reserved. Made with ❤️ for artisans worldwide.
      </div>
    </div>
  </footer>
);

export default Footer;
