import { createClient } from '@/utils/supabase/server'

// Reviews
export async function getProductReviews(productId: string) {
    const supabase = await createClient()

    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
      *,
      customer:profiles!customer_id(full_name)
    `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    return reviews || []
}

export async function getAverageRating(productId: string) {
    const supabase = await createClient()

    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)

    if (!reviews || reviews.length === 0) return 0

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return sum / reviews.length
}

// Featured Products
export async function getFeaturedProducts() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false })

    return products || []
}

// Wishlist
export async function getWishlist() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: items } = await supabase
        .from('wishlist')
        .select(`
      *,
      product:products(*)
    `)
        .eq('customer_id', user.id)

    return items || []
}

export async function addToWishlist(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('wishlist')
        .insert({
            customer_id: user.id,
            product_id: productId
        })

    if (error) return { error: error.message }
    return { success: true }
}

export async function removeFromWishlist(wishlistId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId)
        .eq('customer_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

// Notifications
export async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            type,
            title,
            message,
            link
        })

    if (error) {
        console.error('Error creating notification:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function getUserNotifications() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    return notifications || []
}

export async function markNotificationAsRead(notificationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

    if (error) return { error: error.message }
    return { success: true }
}
