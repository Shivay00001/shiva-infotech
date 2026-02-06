# Setting Up Preset Accounts - Shiva Infotech

## Prerequisites

1. Ensure the database schema from `supabase/schema.sql` has been run
2. bcryptjs package installed (already done via npm)

## Account Credentials

### Admin Account

- **Username**: shivainfotech@adminarun
- **Password**: 07890@shiva
- **Role**: admin
- **Access**: Full system access

### Worker Account (Preset)

- **Username**: shiva@worker1
- **Password**: shiva@infotech
- **Role**: worker
- **Access**: Assigned tasks only

## Setup Instructions

### Step 1: Generate Password Hashes

Run the initialization script to generate password hashes:

```bash
npx tsx scripts/init-accounts.ts
```

This will output the bcrypt hashes for both accounts.

### Step 2: Insert Accounts into Supabase

Copy the SQL output from the script above and run it in your Supabase SQL Editor.

**Alternative - Manual Setup**:
If you prefer to manually insert, use these SQL commands (replace PASSWORD_HASH with the output from step 1):

```sql
-- Insert Admin Account
INSERT INTO public.profiles (id, username, password_hash, role, full_name)
VALUES (
  gen_random_uuid(),
  'shivainfotech@adminarun',
  'ADMIN_PASSWORD_HASH_FROM_SCRIPT',
  'admin'::user_role,
  'System Administrator'
) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Insert Worker Account
INSERT INTO public.profiles (id, username, password_hash, role, full_name)
VALUES (
  gen_random_uuid(),
  'shiva@worker1',
  'WORKER_PASSWORD_HASH_FROM_SCRIPT',
  'worker'::user_role,
  'Worker One'
) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
```

### Step 3: Test Login

1. **Admin Login**: Navigate to `http://localhost:3000/admin/login`
   - Username: shivainfotech@adminarun
   - Password: 07890@shiva

2. **Worker Login**: Navigate to `http://localhost:3000/worker/login`
   - Username: shiva@worker1
   - Password: shiva@infotech

## Creating Additional Workers

Once logged in as admin:

1. Go to `/admin/workers`
2. Fill in the "Add New Worker" form
3. Click "Add Worker"

The new worker can then log in at `/worker/login` with their credentials.

## Security Notes

- Passwords are hashed using bcrypt with salt rounds of 10
- Admin/Worker authentication is separate from customer Firebase auth
- Each role has specific RLS policies limiting database access
- Workers cannot access admin routes
- Customers cannot access admin or worker routes
