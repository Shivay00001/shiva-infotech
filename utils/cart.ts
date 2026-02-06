import { createClient } from '@/utils/supabase/server'

export async function getCartItems() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: items } = await supabase
        .from('cart_items')
        .select(`
      *,
      product:products(*),
      service:services(*)
    `)
        .eq('customer_id', user.id)

    return items || []
}

export async function addToCart(productId: string | null, serviceId: string | null, quantity: number = 1) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check if item already in cart
    const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('customer_id', user.id)
        .eq(productId ? 'product_id' : 'service_id', productId || serviceId)
        .single()

    if (existing) {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)

        if (error) return { error: error.message }
        return { success: true }
    }

    // Add new item
    const { error } = await supabase
        .from('cart_items')
        .insert({
            customer_id: user.id,
            product_id: productId,
            service_id: serviceId,
            quantity
        })

    if (error) return { error: error.message }
    return { success: true }
}

export async function removeFromCart(cartItemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('customer_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    if (quantity <= 0) {
        return removeFromCart(cartItemId)
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('customer_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

export async function clearCart() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('customer_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}
