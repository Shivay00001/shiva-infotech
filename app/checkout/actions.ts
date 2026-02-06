'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clearCart, getCartItems } from '@/utils/cart'

export async function saveAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const addressData = {
        customer_id: user.id,
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        address_line1: formData.get('address_line1') as string,
        address_line2: formData.get('address_line2') as string || null,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
        is_default: formData.get('is_default') === 'on'
    }

    const { data, error } = await supabase
        .from('customer_addresses')
        .insert(addressData)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/checkout')
    return { success: true, address: data }
}

export async function placeOrder(addressId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get cart items
    const cartItems = await getCartItems()

    if (cartItems.length === 0) {
        return { error: 'Cart is empty' }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
        const price = item.product?.price || item.service?.price || 0
        return sum + (price * item.quantity)
    }, 0)

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_id: user.id,
            total_amount: total,
            shipping_address_id: addressId,
            status: 'pending'
        })
        .select()
        .single()

    if (orderError) {
        return { error: orderError.message }
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        item_type: item.product_id ? 'product' : 'service',
        product_id: item.product_id,
        service_id: item.service_id,
        quantity: item.quantity,
        price_at_booking: item.product?.price || item.service?.price || 0
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        return { error: itemsError.message }
    }

    // Clear cart
    await clearCart()

    revalidatePath('/cart')
    redirect('/orders')
}
