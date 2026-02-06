import { createClient } from '@/utils/supabase/server'
import { saveAddress, placeOrder } from './actions'
import { getCartItems } from '@/utils/cart'
import Navbar from '@/components/Navbar'

async function getAddresses() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false })

    return data || []
}

export default async function CheckoutPage() {
    const addresses = await getAddresses()
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
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Shipping Address */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Shipping Address</h2>

                            {/* Existing Addresses */}
                            {addresses.length > 0 && (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border rounded-lg p-4 bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium">{addr.full_name}</p>
                                                    <p className="text-sm text-gray-600">{addr.phone}</p>
                                                </div>
                                                {addr.is_default && (
                                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                                                {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Address Form */}
                            <div className="bg-white rounded-lg border p-6">
                                <h3 className="font-semibold mb-4">
                                    {addresses.length > 0 ? 'Add New Address' : 'Enter Shipping Address'}
                                </h3>
                                <form action={saveAddress} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                id="full_name"
                                                name="full_name"
                                                type="text"
                                                required
                                                className="w-full border rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                                Phone
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                className="w-full border rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="address_line1" className="block text-sm font-medium mb-1">
                                            Address Line 1
                                        </label>
                                        <input
                                            id="address_line1"
                                            name="address_line1"
                                            type="text"
                                            required
                                            className="w-full border rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address_line2" className="block text-sm font-medium mb-1">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            id="address_line2"
                                            name="address_line2"
                                            type="text"
                                            className="w-full border rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium mb-1">
                                                City
                                            </label>
                                            <input
                                                id="city"
                                                name="city"
                                                type="text"
                                                required
                                                className="w-full border rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium mb-1">
                                                State
                                            </label>
                                            <input
                                                id="state"
                                                name="state"
                                                type="text"
                                                required
                                                className="w-full border rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="pincode" className="block text-sm font-medium mb-1">
                                                Pincode
                                            </label>
                                            <input
                                                id="pincode"
                                                name="pincode"
                                                type="text"
                                                required
                                                className="w-full border rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                                    >
                                        Save Address
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="bg-white rounded-lg border p-6 space-y-4">
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.product?.name || item.service?.name} × {item.quantity}
                                            </span>
                                            <span className="font-medium">
                                                ₹{((item.product?.price || item.service?.price || 0) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-indigo-600">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <form action={placeOrder}>
                                    <button
                                        type="submit"
                                        disabled={addresses.length === 0}
                                        className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Place Order
                                    </button>
                                </form>
                                {addresses.length === 0 && (
                                    <p className="text-xs text-center text-gray-500">
                                        Please add a shipping address to continue
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
