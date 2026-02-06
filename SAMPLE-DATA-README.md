# Sample Data Guide

## 📊 Sample Data Overview

This file contains ready-to-use sample data for testing the Shiva Infotech e-commerce platform.

### Included Data

**25 Products** across 7 categories:

- 🖥️ **Servers** (3 items) - Enterprise rack servers
- 💻 **Laptops** (4 items) - Business laptops
- 🖥️ **Desktops** (3 items) - Desktop workstations
- 🌐 **Networking** (4 items) - Switches, routers, access points
- 🔋 **UPS** (3 items) - Uninterruptible power supplies
- 💾 **Storage** (3 items) - NAS devices
- 🖨️ **Printers** (3 items) - Multifunction printers

**17 Services** across 4 categories:

- ⚙️ **Installation** (5 services) - Server, network, CCTV setup
- 🔧 **Maintenance** (4 services) - AMC, health checks, audits
- 🛟 **Support** (5 services) - Data recovery, troubleshooting
- 📚 **Training** (3 services) - IT training and workshops

---

## 🚀 How to Add Sample Data

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to your project at [supabase.com/dashboard](https://supabase.com/dashboard)

2. **Navigate to SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Run Sample Data Script**
   - Open `supabase/sample-data.sql`
   - Copy all contents
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Success**
   - Check for success message showing count of products and services
   - Go to **"Table Editor"** → **"products"** to see your products
   - Go to **"Table Editor"** → **"services"** to see your services

### Option 2: Via Supabase CLI (Advanced)

```bash
# Make sure you're in the project directory
cd shiva-infotech

# Run the sample data script
supabase db reset --db-url "your_database_url"
psql "your_database_url" < supabase/sample-data.sql
```

---

## 🧪 Testing After Adding Data

Once sample data is added:

1. **Refresh your local app** (<http://localhost:3000>)
2. **Go to Products page** - You should see 25 products
3. **Try filters** - Test category dropdown (Servers, Laptops, etc.)
4. **Test search** - Search for "Dell", "HP", "Cisco"
5. **Add to cart** - Click "Add to Cart" on any product
6. **Go to Services** - You should see 17 services
7. **Book a service** - Try the booking form

---

## 📝 Product Categories

| Category | Count | Price Range | Examples |
|----------|-------|-------------|----------|
| Servers | 3 | ₹250k - ₹280k | Dell PowerEdge, HP ProLiant |
| Laptops | 4 | ₹85k - ₹185k | HP EliteBook, ThinkPad X1 |
| Desktops | 3 | ₹35k - ₹65k | ThinkCentre, OptiPlex |
| Networking | 4 | ₹12k - ₹55k | Cisco switches, UniFi |
| UPS | 3 | ₹15k - ₹28k | APC, Eaton, CyberPower |
| Storage | 3 | ₹35k - ₹52k | Synology, QNAP NAS |
| Printers | 3 | ₹15k - ₹95k | HP LaserJet, Canon |

---

## 🛠️ Service Categories

| Category | Count | Price Range | Duration |
|----------|-------|-------------|----------|
| Installation | 5 | ₹2k - ₹15k | 2-8 hours |
| Maintenance | 4 | ₹4k - ₹8k | 3-5 hours |
| Support | 5 | ₹2.5k - ₹18k | 2-8 hours |
| Training | 3 | ₹8k - ₹15k | 6-16 hours |

---

## 🎯 Next Steps

After adding sample data:

1. ✅ Test product browsing and filtering
2. ✅ Test cart functionality (add/remove items)
3. ✅ Test service booking
4. ✅ Create a test customer account
5. ✅ Complete a test order
6. ✅ Test admin panel product management
7. 🚀 **Ready to deploy!**

---

## 🔄 Resetting Data

If you want to clear and re-add sample data:

```sql
-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM services;

-- Then run sample-data.sql again
```

---

## 📦 Production Data

For production deployment:

1. Replace placeholder images with real product photos
2. Update descriptions with actual product specifications
3. Adjust prices based on current market rates
4. Add more products as needed
5. Update service offerings based on your business

---

## 💡 Tips

- **Images**: Currently using placeholder.co URLs - replace with real images for production
- **Prices**: All prices in Indian Rupees (₹)
- **Stock**: Realistic stock quantities set (3-20 units)
- **Categories**: Easily extendable - just add more products with new category names
- **Services**: Duration set in hours for booking calculations

Enjoy testing your e-commerce platform! 🎉
