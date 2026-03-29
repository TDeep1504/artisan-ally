
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('buyer', 'business_buyer', 'seller', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  country TEXT,
  state TEXT,
  district TEXT,
  village TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Seller profiles table
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  seller_type TEXT CHECK (seller_type IN ('individual', 'shg', 'cooperative', 'rural_business')),
  store_bio TEXT,
  artisan_story TEXT,
  categories TEXT[],
  bank_name TEXT,
  bank_account TEXT,
  bank_ifsc TEXT,
  upi_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_women_led BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seller profiles viewable by everyone" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Sellers can insert own profile" ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers can update own profile" ON public.seller_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Business buyer profiles
CREATE TABLE public.business_buyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('boutique', 'retailer', 'interior_designer', 'wholesaler', 'importer', 'other')),
  gst_number TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.business_buyer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business profiles viewable by everyone" ON public.business_buyer_profiles FOR SELECT USING (true);
CREATE POLICY "Business buyers can insert own profile" ON public.business_buyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Business buyers can update own profile" ON public.business_buyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  short_summary TEXT,
  tags TEXT[],
  category_id UUID REFERENCES public.categories(id),
  materials TEXT,
  care_instructions TEXT,
  b2c_price DECIMAL(10,2),
  b2b_price DECIMAL(10,2),
  min_bulk_quantity INTEGER DEFAULT 1,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished', 'flagged')),
  is_handmade BOOLEAN DEFAULT true,
  is_eco_friendly BOOLEAN DEFAULT false,
  bulk_order_suitable BOOLEAN DEFAULT false,
  export_suitable BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  enquiries INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products viewable by everyone" ON public.products FOR SELECT USING (status = 'published' OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

-- Product images
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can insert product images" ON public.product_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
);
CREATE POLICY "Sellers can update product images" ON public.product_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
);
CREATE POLICY "Sellers can delete product images" ON public.product_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 100.00,
  seller_payout DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Order participants can update" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

-- B2B Enquiries
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID REFERENCES public.products(id),
  message TEXT NOT NULL,
  quantity INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'quoted', 'accepted', 'rejected')),
  seller_response TEXT,
  quoted_price DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enquiries" ON public.enquiries FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Buyers can create enquiries" ON public.enquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update enquiries" ON public.enquiries FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Cart
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON public.seller_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_buyer_profiles_updated_at BEFORE UPDATE ON public.business_buyer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Textiles & Handloom', 'textiles-handloom', 'Handwoven fabrics, sarees, and textile art', '🧵'),
  ('Pottery & Ceramics', 'pottery-ceramics', 'Handcrafted pottery, terracotta, and ceramic art', '🏺'),
  ('Woodwork', 'woodwork', 'Carved wood art, furniture, and decorative pieces', '🪵'),
  ('Bamboo & Cane', 'bamboo-cane', 'Sustainable bamboo and cane products', '🎋'),
  ('Metalwork', 'metalwork', 'Brass, copper, and bell metal crafts', '🔔'),
  ('Jewelry', 'jewelry', 'Handcrafted tribal and artisan jewelry', '💍'),
  ('Paintings & Art', 'paintings-art', 'Traditional and folk paintings', '🎨'),
  ('Home Decor', 'home-decor', 'Artisan home decoration pieces', '🏠'),
  ('Food & Spices', 'food-spices', 'Organic spices, honey, and artisan food', '🌿'),
  ('Leather Craft', 'leather-craft', 'Handmade leather goods', '👜');
