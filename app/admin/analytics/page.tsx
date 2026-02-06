import { createClient } from '@/utils/supabase/server'

async function getAnalytics() {
    const supabase = await createClient()

    // Total Revenue
    const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')

    const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total_amount.toString()), 0) || 0
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0

    // Customer Count
    const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')

    // Product Count
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // Recent Orders
    const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
      *,
      customer:profiles!customer_id(full_name)
    `)
        .order('created_at', { ascending: false })
        .limit(5)

    // Top Products
    const { data: topProducts } = await supabase
        .from('order_items')
        .select(`
      product_id,
      quantity,
      product:products(name)
    `)
        .not('product_id', 'is', null)

    const productSales = topProducts?.reduce((acc: any, item: any) => {
        const id = item.product_id
        if (!acc[id]) {
            acc[id] = { name: item.product?.name, quantity: 0 }
        }
        acc[id].quantity += item.quantity
        return acc
    }, {})

    const topProductsList = Object.values(productSales || {})
        .sort((a: any, b: any) => b.quantity - a.quantity)
        .slice(0, 5)

    return {
        totalRevenue,
        completedOrders,
        pendingOrders,
        customerCount: customerCount || 0,
        productCount: productCount || 0,
        recentOrders: recentOrders || [],
        topProducts: topProductsList
    }
}

export default async function AnalyticsPage() {
    const analytics = await getAnalytics()

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">₹{analytics.totalRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600 mb-1">Completed Orders</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.completedOrders}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-indigo-600">{analytics.customerCount}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-purple-600">{analytics.productCount}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {analytics.recentOrders.map((order: any) => (
                            <div key={order.id} className="flex justify-between items-center text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{order.customer?.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">₹{order.total_amount}</p>
                                    <p className="text-xs capitalize">{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-semibold text-lg mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {analytics.topProducts.map((product: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    <span>{product.name}</span>
                                </div>
                                <span className="font-medium">{product.quantity} sold</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4">Order Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Chart visualization would go here<br />
                        <span className="text-sm">(Install recharts for visual charts)</span></p>
                </div>
            </div>
        </div>
    )
}
