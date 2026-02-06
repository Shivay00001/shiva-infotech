# Complete Database Setup Guide

## 📊 Database Schema Overview

This schema supports the complete Shiva Infotech e-commerce platform with **18 tables**, **25+ indexes**, and **comprehensive RLS policies**.

## 🗂️ Tables Breakdown

### Core Tables (6)

1. **profiles** - User accounts (customer/admin/worker)
2. **products** - Physical IT products
3. **services** - Installation/support services
4. **customer_addresses** - Shipping addresses
5. **orders** - Purchase orders
6. **order_items** - Individual items in orders

### Shopping Experience (4)

7. **cart_items** - Shopping cart
8. **reviews** - Product reviews & ratings
9. **wishlist** - Saved products
10. **testimonials** - Customer testimonials

### Service Management (3)

11. **service_bookings** - Service appointments
12. **service_photos** - Before/after photos
13. **assignments** - Worker task assignments

### Engagement & Communication (4)

14. **notifications** - User notifications
15. **stock_alerts** - Back-in-stock alerts
16. **product_comparisons** - Saved comparisons
17. **loyalty_points** - Rewards system

### Financial (2)

18. **payment_transactions** - Payment records
19. **coupons** - Discount codes

## 🚀 Setup Instructions

### Step 1: Run Schema in Supabase

1. Go to your Supabase project: <https://supabase.com/dashboard>
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy entire `supabase/schema.sql` content
5. **Paste** and click **Run**
6. Wait for "Success. No rows returned" message

### Step 2: Create Admin Account

```sql
-- In Supabase SQL Editor, after schema is created:

-- First, create user via Supabase Auth Dashboard
-- Email: admin@shivainfotech.com
-- Password: (set your secure password)

-- Then update role to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@shivainfotech.com';
```

### Step 3: Create Worker Accounts (Optional)

```sql
-- Create via Auth Dashboard first, then:
UPDATE public.profiles
SET role = 'worker'
WHERE email IN ('worker1@shivainfotech.com', 'worker2@shivainfotech.com');
```

### Step 4: Add Sample Products

```sql
-- Insert sample products
INSERT INTO public.products (name, description, price, stock, category, image_url) VALUES
('Dell PowerEdge R740 Server', 'Enterprise-grade rack server with dual Xeon processors', 250000, 5, 'Servers', 'https://example.com/dell-r740.jpg'),
('HP EliteBook 840 G8', 'Business laptop with 11th Gen Intel Core i7', 85000, 15, 'Laptops', 'https://example.com/hp-840.jpg'),
('Lenovo ThinkCentre M720q', 'Compact desktop for office use', 35000, 20, 'Desktops', 'https://example.com/lenovo-m720.jpg'),
('Cisco SG350-28 Switch', '28-port managed gigabit switch', 45000, 8, 'Networking', 'https://example.com/cisco-sg350.jpg'),
('APC Smart-UPS 1500VA', 'Uninterruptible power supply', 18000, 12, 'UPS', 'https://example.com/apc-ups.jpg');
```

### Step 5: Add Sample Services

```sql
-- Insert sample services
INSERT INTO public.services (name, description, price, category, duration_hours) VALUES
('Server Installation & Configuration', 'Complete server setup with OS and applications', 15000, 'Installation', 8),
('Network Setup & Deployment', 'LAN/WAN configuration and testing', 10000, 'Installation', 6),
('IT System Maintenance (AMC)', 'Monthly preventive maintenance visit', 5000, 'Maintenance', 4),
('Data Recovery Service', 'Professional data recovery from failed drives', 8000, 'Support', 6),
('CCTV Installation', 'Complete surveillance system setup', 12000, 'Installation', 8);
```

## ✅ Verification Checklist

After running the schema, verify:

- [ ] All 18 tables created
- [ ] Indexes created (check with `\d+ table_name`)
- [ ] RLS policies enabled on all tables
- [ ] Triggers working (updated_at columns)
- [ ] Admin account created and role set
- [ ] Sample products visible in app
- [ ] Sample services visible in app

## 🔐 Security Features

### Row Level Security (RLS)

- **Customers**: See only their own data
- **Workers**: See assigned tasks + own data
- **Admins**: Full access to all data

### Data Protection

- Addresses: Customer-only access
- Orders: Customer can view, admin can manage
- Cart: User-specific, isolated
- Reviews: Public read, owner write
- Testimonials: Approved ones public

## 📈 Performance Optimizations

### Indexes Created

- Profile lookups by email/username
- Product searches by category
- Order queries by customer/status
- Review lookups by product
- Service bookings by date/worker
- Cart operations by customer

### Query Performance

- Fast product catalog loading
- Efficient order history retrieval
- Quick cart operations
- Optimized review display

## 🔧 Common Operations

### Check Table Count

```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return 18
```

### View All Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Check RLS Status

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't' (true)
```

## 🎯 Next Steps

1. ✅ Run schema.sql in Supabase
2. ✅ Create admin account
3. ✅ Add sample products
4. ✅ Add sample services
5. 🔜 Test complete purchase flow
6. 🔜 Test service booking
7. 🔜 Deploy to production

## 📞 Support

If you encounter errors:

1. Check Supabase dashboard for migration errors
2. Verify auth.users table exists
3. Ensure UUID extension is enabled
4. Check foreign key constraints

**Database Status**: Production-ready 🚀
