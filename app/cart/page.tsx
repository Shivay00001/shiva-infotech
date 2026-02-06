import { getCartItems, removeFromCart, updateCartItemQuantity } from '@/utils/cart'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function CartPage() {
    const cartItems = await getCartItems()

    const total = cartItems.reduce((sum, item) => {
        const price = item.product?.price || item.service?.price || 0
        return sum + (price * item.quantity)
    }, 0)

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
                                Continue Shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow">
                                {cartItems.map((item) => {
                                    const itemName = item.product?.name || item.service?.name || 'Unknown'
                                    const itemPrice = item.product?.price || item.service?.price || 0

                                    return (
                                        <div key={item.id} className="p-6 border-b last:border-b-0 flex items-center gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{itemName}</h3>
                                                <p className="text-gray-600">₹{itemPrice} each</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <form action={updateCartItemQuantity.bind(null, item.id, item.quantity - 1)}>
                                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">-</button>
                                                </form>
                                                <span className="px-4">{item.quantity}</span>
                                                <form action={updateCartItemQuantity.bind(null, item.id, item.quantity + 1)}>
                                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">+</button>
                                                </form>
                                            </div>

                                            <div className="text-right min-w-[100px]">
                                                <p className="font-bold">₹{(itemPrice * item.quantity).toFixed(2)}</p>
                                            </div>

                                            <form action={removeFromCart.bind(null, item.id)}>
                                                <button className="text-red-600 hover:text-red-800 px-2">Remove</button>
                                            </form>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
