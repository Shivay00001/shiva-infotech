import { createClient } from '@/utils/supabase/server'
import { getProductReviews, getAverageRating, addToWishlist } from '@/utils/customer'
import { addToCart } from '@/utils/cart'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

async function getProduct(id: string) {
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    return product
}

async function submitReview(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            product_id: formData.get('product_id'),
            customer_id: user.id,
            rating: parseInt(formData.get('rating') as string),
            review_text: formData.get('review_text')
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id)
    const reviews = await getProductReviews(params.id)
    const avgRating = await getAverageRating(params.id)

    if (!product) {
        return <div>Product not found</div>
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Product Image */}
                        <div className="bg-white rounded-lg p-8">
                            <div className="aspect-square w-full bg-gray-200 rounded-lg overflow-hidden">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-lg p-8">
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                </span>
                            </div>

                            <p className="text-gray-600 mb-6">{product.description}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-indigo-600">₹{product.price}</span>
                            </div>

                            <div className="mb-6">
                                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <form action={addToCart.bind(null, product.id, null, 1)} className="flex-1">
                                    <button
                                        type="submit"
                                        disabled={product.stock === 0}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                                    >
                                        Add to Cart
                                    </button>
                                </form>
                                <form action={addToWishlist.bind(null, product.id)}>
                                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        ♥ Wishlist
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                        {/* Write Review Form */}
                        <div className="mb-8 pb-8 border-b">
                            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                            <form action={submitReview} className="space-y-4">
                                <input type="hidden" name="product_id" value={product.id} />
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rating</label>
                                    <select name="rating" required className="border rounded-md px-3 py-2">
                                        <option value="5">5 Stars - Excellent</option>
                                        <option value="4">4 Stars - Good</option>
                                        <option value="3">3 Stars - Average</option>
                                        <option value="2">2 Stars - Below Average</option>
                                        <option value="1">1 Star - Poor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Your Review</label>
                                    <textarea
                                        name="review_text"
                                        rows={4}
                                        placeholder="Share your experience with this product..."
                                        className="w-full border rounded-md px-3 py-2"
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                                    Submit Review
                                </button>
                            </form>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map((review: any) => (
                                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="font-medium">{review.customer?.full_name || 'Anonymous'}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{review.review_text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
