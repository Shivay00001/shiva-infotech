// Run this script to initialize admin and worker accounts
// Usage: node --loader ts-node/esm scripts/init-accounts.ts

import { hashPassword } from '../utils/auth'

async function initAccounts() {
    console.log('Initializing preset accounts...')

    const adminPassword = await hashPassword('07890@shiva')
    const workerPassword = await hashPassword('shiva@infotech')

    console.log('\n=== Admin Account ===')
    console.log('Username: shivainfotech@adminarun')
    console.log('Password Hash:', adminPassword)

    console.log('\n=== Worker Account ===')
    console.log('Username: shiva@worker1')
    console.log('Password Hash:', workerPassword)

    console.log('\n\nSQL to run in Supabase SQL Editor:')
    console.log(`
-- Insert Admin Account
INSERT INTO public.profiles (id, username, password_hash, role, full_name)
VALUES (
  gen_random_uuid(),
  'shivainfotech@adminarun',
  '${adminPassword}',
  'admin'::user_role,
  'System Administrator'
) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Insert Worker Account  
INSERT INTO public.profiles (id, username, password_hash, role, full_name)
VALUES (
  gen_random_uuid(),
  'shiva@worker1',
  '${workerPassword}',
  'worker'::user_role,
  'Worker One'
) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
  `)
}

initAccounts().catch(console.error)
