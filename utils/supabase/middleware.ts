import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Get env vars - in edge runtime we need to access them differently
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Skip auth if env vars are missing (let pages handle it)
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Middleware] Supabase env vars missing - skipping auth check')
        return supabaseResponse
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        )
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Refresh session if exists
        await supabase.auth.getUser()

        return supabaseResponse
    } catch (error) {
        console.error('[Middleware] Error:', error)
        return supabaseResponse
    }
}
