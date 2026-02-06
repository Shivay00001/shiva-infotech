import { createClient } from '@/utils/supabase/server'

export async function getWorkerAssignments() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch assignments for this worker
    const { data: assignments, error } = await supabase
        .from('assignments')
        .select(`
        *,
        order:orders (
            id,
            total_amount,
            status,
            order_items (
                quantity,
                product:products (name, category),
                service:services (name, category)
            )
        )
    `)
        .eq('worker_id', user.id)
        .order('assigned_at', { ascending: false })

    if (error) {
        console.error('Error fetching assignments:', error)
        return []
    }

    return assignments || []
}
