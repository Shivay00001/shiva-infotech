import bcrypt from 'bcryptjs'
import { createClient } from '@/utils/supabase/server'

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function validateAdminWorkerLogin(username: string, password: string) {
    const supabase = await createClient()

    // Fetch user by username
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !profile) {
        return { success: false, error: 'Invalid username or password' }
    }

    // Verify password
    const isValid = await verifyPassword(password, profile.password_hash)

    if (!isValid) {
        return { success: false, error: 'Invalid username or password' }
    }

    // Check role is admin or worker
    if (profile.role !== 'admin' && profile.role !== 'worker') {
        return { success: false, error: 'Unauthorized access' }
    }

    return {
        success: true,
        profile: {
            id: profile.id,
            username: profile.username,
            role: profile.role,
            full_name: profile.full_name
        }
    }
}

export async function createWorkerAccount(
    username: string,
    password: string,
    fullName: string,
    createdBy: string
) {
    const supabase = await createClient()

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create auth user (using Supabase admin API would be ideal, but for now we'll just create profile)
    // In production, you'd want to use Supabase Admin API to create the auth.users entry

    // For now, create a UUID for the new worker
    const { data: newUser, error: createError } = await supabase.rpc('create_worker_profile', {
        p_username: username,
        p_password_hash: passwordHash,
        p_full_name: fullName,
        p_created_by: createdBy
    })

    if (createError) {
        return { success: false, error: createError.message }
    }

    return { success: true, data: newUser }
}
