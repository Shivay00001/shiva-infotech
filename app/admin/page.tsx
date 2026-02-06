import { Package, ShoppingCart, Users, BadgeIndianRupee } from 'lucide-react'
import { getAdminStats, getRecentOrders } from '@/utils/admin'

function DashboardCard({ title, value, icon: Icon, subtext }: { title: string, value: string | number, icon: any, subtext: string }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground text-gray-500" />
            </div>
            <div className="pt-4">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-gray-500">{subtext}</p>
            </div>
        </div>
    )
}

export default async function AdminDashboard() {
    const stats = await getAdminStats()
    const recentOrders = await getRecentOrders()

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={BadgeIndianRupee}
                    subtext="Lifetime earnings"
                />
                <DashboardCard
                    title="Total Orders"
                    value={stats.ordersCount}
                    icon={ShoppingCart}
                    subtext="All time orders"
                />
                <DashboardCard
                    title="Products in Stock"
                    value={stats.productsCount}
                    icon={Package}
                    subtext="Available inventory"
                />
                <DashboardCard
                    title="Active Workers"
                    value={stats.workersCount}
                    icon={Users}
                    subtext="Registered staff"
                />
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-xl border bg-white shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
                        <p className="text-sm text-gray-500">Recent transactions and bookings.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {recentOrders.length === 0 ? (
                                        <tr className="border-b transition-colors hover:bg-gray-50">
                                            <td colSpan={4} className="p-4 text-center text-gray-500">No orders found.</td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order: any) => (
                                            <tr key={order.id} className="border-b transition-colors hover:bg-gray-50">
                                                <td className="p-4 align-middle font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle">₹{order.total_amount}</td>
                                                <td className="p-4 align-middle text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
