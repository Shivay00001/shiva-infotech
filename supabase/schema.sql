-- ============================================================================
-- SHIVA INFOTECH E-COMMERCE PLATFORM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0
-- Description: Production-ready schema for IT e-commerce with service booking
-- Features: Products, Services, Orders, Reviews, Testimonials, AMC, Workers
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'worker')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  category TEXT,
  image_url TEXT,
  specifications JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT,
  duration_hours INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Customer Addresses
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shipping_address_id UUID REFERENCES public.customer_addresses(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_booking DECIMAL(10,2) NOT NULL CHECK (price_at_booking >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT product_or_service CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT cart_product_or_service CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  ),
  CONSTRAINT unique_cart_item UNIQUE (customer_id, product_id, service_id)
);

-- ============================================================================
-- REVIEW & ENGAGEMENT TABLES
-- ============================================================================

-- Product Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_review UNIQUE (product_id, customer_id)
);

-- Wishlist
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_wishlist UNIQUE (customer_id, product_id)
);

-- Customer Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial_text TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stock Availability Alerts
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  is_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_stock_alert UNIQUE (customer_id, product_id)
);

-- Product Comparisons
CREATE TABLE IF NOT EXISTS public.product_comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- SERVICE BOOKING TABLES
-- ============================================================================

-- Service Bookings
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Service Photos (before/after)
CREATE TABLE IF NOT EXISTS public.service_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('before', 'after')),
  uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Worker Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- NOTIFICATION & COMMUNICATION TABLES
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('order', 'service', 'system', 'promotion')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- PAYMENT & FINANCIAL TABLES
-- ============================================================================

-- Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Loyalty Points
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('earned', 'redeemed')) NOT NULL,
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_customer ON public.cart_items(customer_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON public.reviews(customer_id);

-- Service bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.service_bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.service_bookings(scheduled_date);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- View own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Update own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- PRODUCTS POLICIES (Public Read, Admin Write)
-- ============================================================================

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- SERVICES POLICIES (Public Read, Admin Write)
-- ============================================================================

CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- CUSTOMER ADDRESSES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own addresses" ON public.customer_addresses
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Users can insert own addresses" ON public.customer_addresses
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update own addresses" ON public.customer_addresses
  FOR UPDATE USING (customer_id = auth.uid());

CREATE POLICY "Users can delete own addresses" ON public.customer_addresses
  FOR DELETE USING (customer_id = auth.uid());

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- ORDER ITEMS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid())
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- CART POLICIES
-- ============================================================================

CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (customer_id = auth.uid());

-- ============================================================================
-- REVIEWS POLICIES
-- ============================================================================

CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own reviews" ON public.reviews
  FOR UPDATE USING (customer_id = auth.uid());

-- ============================================================================
-- WISHLIST POLICIES
-- ============================================================================

CREATE POLICY "Users can manage own wishlist" ON public.wishlist
  FOR ALL USING (customer_id = auth.uid());

-- ============================================================================
-- TESTIMONIALS POLICIES
-- ============================================================================

CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Customers can submit testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- STOCK ALERTS POLICIES
-- ============================================================================

CREATE POLICY "Users can manage own stock alerts" ON public.stock_alerts
  FOR ALL USING (customer_id = auth.uid());

-- ============================================================================
-- SERVICE BOOKINGS POLICIES
-- ============================================================================

CREATE POLICY "Customers can view own bookings" ON public.service_bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create bookings" ON public.service_bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Workers can view assigned bookings" ON public.service_bookings
  FOR SELECT USING (
    worker_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage all bookings" ON public.service_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- WORKER ASSIGNMENTS POLICIES
-- ============================================================================

CREATE POLICY "Workers can view own assignments" ON public.assignments
  FOR SELECT USING (
    worker_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage assignments" ON public.assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- COUPONS POLICIES
-- ============================================================================

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true AND valid_until > now());

CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- LOYALTY POINTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own loyalty points" ON public.loyalty_points
  FOR SELECT USING (customer_id = auth.uid());

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- INITIAL DATA (Optional - for testing)
-- ============================================================================

-- Sample admin user (password needs to be set via Supabase Auth)
-- INSERT INTO auth.users (email, raw_user_meta_data) VALUES
-- ('admin@shivainfotech.com', '{"full_name": "Admin User", "role": "admin"}');

-- Sample categories
-- You can insert sample products/services here for testing

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- Run this script in your Supabase SQL Editor
-- After running, you can:
-- 1. Create admin user via Supabase Auth
-- 2. Update admin user's role in profiles table
-- 3. Add products and services via admin panel
-- 4. Start using the platform
-- ============================================================================
