import { createClient } from '@/utils/supabase/server'

export async function getOrderDetails(orderId: string) {
    const supabase = await createClient()

    const { data: order, error } = await supabase
        .from('orders')
        .select(`
      *,
      customer:profiles!customer_id(
        id,
        full_name,
        username
      ),
      shipping_address:customer_addresses!shipping_address_id(
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode
      ),
      order_items(
        id,
        quantity,
        price_at_booking,
        item_type,
        product:products(id, name, category),
        service:services(id, name, category)
      )
    `)
        .eq('id', orderId)
        .single()

    if (error) {
        console.error('Error fetching order:', error)
        return null
    }

    return order
}

export async function getAllOrders() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select(`
      *,
      customer:profiles!customer_id(full_name, username),
      shipping_address:customer_addresses!shipping_address_id(city, state),
      order_items(quantity)
    `)
        .order('created_at', { ascending: false })

    return orders || []
}

export async function getWorkerOrders(workerId: string) {
    const supabase = await createClient()

    const { data: assignments } = await supabase
        .from('assignments')
        .select(`
      *,
      order:orders!order_id(
        id,
        total_amount,
        status,
        created_at,
        customer:profiles!customer_id(full_name, username),
        shipping_address:customer_addresses!shipping_address_id(*),
        order_items(
          quantity,
          price_at_booking,
          product:products(name, category),
          service:services(name, category)
        )
      )
    `)
        .eq('worker_id', workerId)
        .order('assigned_at', { ascending: false })

    return assignments || []
}
