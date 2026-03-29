const AboutPage = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-3xl mx-auto">
      <h1 className="font-heading text-4xl font-bold mb-6">About HaathSe</h1>
      <p className="text-lg text-muted-foreground mb-8">
        HaathSe (meaning "by hand" in Hindi) is an AI-enabled global marketplace platform designed to empower rural artisans, self-help groups, and small craft producers.
      </p>
      <div className="space-y-6 text-foreground/80">
        <div>
          <h2 className="font-heading text-2xl font-semibold mb-3">Our Mission</h2>
          <p>To bridge the digital divide for artisans who create beautiful handmade products but lack access to global marketplaces. We use AI to simplify the selling process, making it accessible even for low-tech users.</p>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold mb-3">How We Help</h2>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Free registration and product listing</li>
            <li>AI-powered listing generation from simple photos</li>
            <li>Voice-first support for artisans</li>
            <li>B2B connections with wholesalers and retailers</li>
            <li>Only ₹100 platform fee per completed sale</li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold mb-3">Platform Fee Model</h2>
          <p>Registration is <strong>free</strong>. Listing products is <strong>free</strong>. We only charge ₹100 per completed B2C sale as a marketplace fee. Seller payout = selling price - ₹100.</p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
