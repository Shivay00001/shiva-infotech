import { createClient } from '@/utils/supabase/server'

export async function getAdminStats() {
    const supabase = await createClient()

    // Execute queries in parallel for performance
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: workersCount },
        { data: revenueData }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'worker'),
        supabase.from('orders').select('total_amount').eq('status', 'completed')
    ])

    // Calculate total revenue from completed orders
    const totalRevenue = revenueData?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0

    return {
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        workersCount: workersCount || 0,
        totalRevenue
    }
}

export async function getRecentOrders() {
    const supabase = await createClient()
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    return orders || []
}
