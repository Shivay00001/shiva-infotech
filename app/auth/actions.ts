'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { validateAdminWorkerLogin, hashPassword } from '@/utils/auth'

// Customer login/signup (Supabase auth)
export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

// Admin/Worker login (preset credentials)

export async function adminLogin(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const result = await validateAdminWorkerLogin(username, password)

    if (!result.success) {
        redirect(`/admin/login?error=${encodeURIComponent(result.error || 'Invalid credentials')}`)
    }

    if (result.profile?.role !== 'admin') {
        redirect('/admin/login?error=Unauthorized:%20Admin%20access%20only')
    }

    // Create Supabase session manually
    const supabase = await createClient()

    // Sign in with the profile ID (this is a workaround - in production use proper auth)
    // For now, we'll set a custom session
    const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@admin.local`,
        password: password
    })

    if (error) {
        // If user doesn't exist in auth.users, we need to handle this differently
        console.error('Auth error:', error)
        redirect(`/admin/login?error=${encodeURIComponent('Authentication failed')}`)
    }

    revalidatePath('/admin')
    redirect('/admin')
}

export async function workerLogin(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const result = await validateAdminWorkerLogin(username, password)

    if (!result.success) {
        redirect(`/worker/login?error=${encodeURIComponent(result.error || 'Invalid credentials')}`)
    }

    if (result.profile?.role !== 'worker') {
        redirect('/worker/login?error=Unauthorized:%20Worker%20access%20only')
    }

    // Create session
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@worker.local`,
        password: password
    })

    if (error) {
        console.error('Auth error:', error)
        redirect(`/worker/login?error=${encodeURIComponent('Authentication failed')}`)
    }

    revalidatePath('/worker')
    redirect('/worker')
}

export async function createWorker(formData: FormData) {
    const supabase = await createClient()

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized: Admin access only' }
    }

    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create worker profile (simplified - in production would create auth.users too)
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            username,
            password_hash: passwordHash,
            role: 'worker',
            full_name: fullName
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/workers')
    return { success: true, data }
}

export async function deleteWorker(workerId: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', workerId)
        .eq('role', 'worker') // Safety check

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/workers')
    return { success: true }
}
