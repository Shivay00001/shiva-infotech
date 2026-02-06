import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

async function getCustomerOrders() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            shipping_address:customer_addresses!shipping_address_id(*),
            order_items(
                quantity,
                price_at_booking,
                product:products(name),
                service:services(name)
            )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

    return orders || []
}

export default async function OrdersPage() {
    const orders = await getCustomerOrders()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet</p>
                            <Link href="/products" className="text-indigo-600 hover:text-indigo-700">
                                Start Shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order: any) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="text-sm font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-semibold mb-3">Items</h3>
                                                <ul className="space-y-2">
                                                    {order.order_items?.map((item: any, idx: number) => (
                                                        <li key={idx} className="flex justify-between text-sm">
                                                            <span>{item.product?.name || item.service?.name} (x{item.quantity})</span>
                                                            <span className="font-medium">₹{item.price_at_booking * item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="flex justify-between font-bold">
                                                        <span>Total</span>
                                                        <span className="text-indigo-600">₹{order.total_amount}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.shipping_address && (
                                                <div>
                                                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                                                        <p>{order.shipping_address.phone}</p>
                                                        <p>{order.shipping_address.address_line1}</p>
                                                        {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                                        <p>
                                                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="font-semibold mb-4">Order Status</h3>
                                            <div className="flex items-center space-x-4">
                                                <div className={`flex items-center ${order.status !== 'cancelled' ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status !== 'cancelled' ? 'bg-green-100' : 'bg-gray-100'
                                                        }`}>
                                                        ✓
                                                    </div>
                                                    <span className="ml-2 text-sm">Placed</span>
                                                </div>
                                                <div className="flex-1 h-1 bg-gray-200">
                                                    <div className={`h-full transition-all duration-300 ${order.status === 'processing' || order.status === 'completed' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                                                        }`}></div>
                                                </div>
                                                <div className={`flex items-center ${order.status === 'processing' || order.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                                                    }`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'processing' || order.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                                                        }`}>
                                                        {order.status === 'processing' || order.status === 'completed' ? '✓' : '○'}
                                                    </div>
                                                    <span className="ml-2 text-sm">Processing</span>
                                                </div>
                                                <div className="flex-1 h-1 bg-gray-200">
                                                    <div className={`h-full transition-all duration-300 ${order.status === 'completed' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                                                        }`}></div>
                                                </div>
                                                <div className={`flex items-center ${order.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                                                        }`}>
                                                        {order.status === 'completed' ? '✓' : '○'}
                                                    </div>
                                                    <span className="ml-2 text-sm">Completed</span>
                                                </div>
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
