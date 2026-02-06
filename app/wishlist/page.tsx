import { getWishlist, removeFromWishlist } from '@/utils/customer'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function WishlistPage() {
    const wishlistItems = await getWishlist()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                    {wishlistItems.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
                                Browse Products →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {wishlistItems.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="aspect-square w-full bg-gray-200 relative">
                                        {item.product?.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{item.product?.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {item.product?.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-indigo-600 text-xl">
                                                ₹{item.product?.price}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                                >
                                                    View
                                                </Link>
                                                <form action={removeFromWishlist.bind(null, item.id)}>
                                                    <button className="text-sm text-red-600 hover:text-red-800 px-3 py-2">
                                                        Remove
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
