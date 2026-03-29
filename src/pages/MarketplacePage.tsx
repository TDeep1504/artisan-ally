const MarketplacePage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold">Marketplace</h1>
      <p className="text-muted-foreground mt-1">Discover authentic handmade products from artisans worldwide</p>
    </div>

    {/* Filters placeholder */}
    <div className="flex flex-wrap gap-2 mb-6">
      {["All", "Textiles", "Pottery", "Woodwork", "Jewelry", "Eco-Friendly", "Women-Led"].map((f) => (
        <button
          key={f}
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            f === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
          }`}
        >
          {f}
        </button>
      ))}
    </div>

    {/* Empty state */}
    <div className="text-center py-20">
      <span className="text-6xl block mb-4">🛍️</span>
      <h2 className="font-heading text-2xl font-semibold mb-2">Coming Soon</h2>
      <p className="text-muted-foreground">Products will appear here once artisans start listing. Be the first to sell!</p>
    </div>
  </div>
);

export default MarketplacePage;
