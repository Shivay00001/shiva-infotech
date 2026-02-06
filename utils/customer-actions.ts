import { createClient } from '@/utils/supabase/server'

// Reorder functionality
export async function reorderItems(orderId: string) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get order items
    const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId)

    if (!orderItems || orderItems.length === 0) {
        return { error: 'No items found in order' }
    }

    // Add each item to cart
    for (const item of orderItems) {
        // Check if item already exists in cart
        const { data: existingCart } = await supabase
            .from('cart_items')
            .select('*')
            .eq('customer_id', user.id)
            .eq('product_id', item.product_id)
            .single()

        if (existingCart) {
            // Update quantity
            await supabase
                .from('cart_items')
                .update({ quantity: existingCart.quantity + item.quantity })
                .eq('id', existingCart.id)
        } else {
            // Insert new cart item
            await supabase
                .from('cart_items')
                .insert({
                    customer_id: user.id,
                    product_id: item.product_id,
                    quantity: item.quantity
                })
        }
    }

    return { success: true }
}

// Stock alert functionality
export async function createStockAlert(productId: string, email: string) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('stock_alerts')
        .insert({
            customer_id: user.id,
            product_id: productId,
            email: email
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getCustomerOrders() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: orders } = await supabase
        .from('orders')
        .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

    return orders || []
}
