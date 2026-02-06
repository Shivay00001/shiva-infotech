import { getAllOrders } from '@/utils/orders'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

async function updateOrderStatus(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const orderId = formData.get('order_id') as string
    const newStatus = formData.get('status') as string

    await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

    // Get order details to notify customer
    const { data: order } = await supabase
        .from('orders')
        .select('customer_id')
        .eq('id', orderId)
        .single()

    if (order) {
        await supabase
            .from('notifications')
            .insert({
                user_id: order.customer_id,
                type: 'order_update',
                title: 'Order Status Updated',
                message: `Your order status has been updated to ${newStatus}`,
                link: `/orders`
            })
    }

    revalidatePath('/admin/orders')
}

async function assignWorker(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const orderId = formData.get('order_id') as string
    const workerId = formData.get('worker_id') as string

    // Create assignment
    await supabase
        .from('assignments')
        .insert({
            order_id: orderId,
            worker_id: workerId,
            status: 'pending'
        })

    // Notify worker
    await supabase
        .from('notifications')
        .insert({
            user_id: workerId,
            type: 'new_assignment',
            title: 'New Task Assigned',
            message: 'You have been assigned a new order to process',
            link: `/worker`
        })

    revalidatePath('/admin/orders')
}

async function getWorkers() {
    const supabase = await createClient()
    const { data: workers } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .eq('role', 'worker')

    return workers || []
}

export default async function AdminOrdersPage() {
    const orders = await getAllOrders()
    const workers = await getWorkers()

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Order Management
                    </h2>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-mono">
                                            {order.id.slice(0, 8)}...
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {order.customer?.full_name || order.customer?.username || 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            ₹{order.total_amount}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <form action={updateOrderStatus} className="flex gap-2">
                                                <input type="hidden" name="order_id" value={order.id} />
                                                <select
                                                    name="status"
                                                    defaultValue={order.status}
                                                    className="text-xs border rounded px-2 py-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button type="submit" className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">
                                                    Update
                                                </button>
                                            </form>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <form action={assignWorker} className="flex gap-2">
                                                <input type="hidden" name="order_id" value={order.id} />
                                                <select name="worker_id" className="text-xs border rounded px-2 py-1">
                                                    <option value="">Assign Worker</option>
                                                    {workers.map((worker: any) => (
                                                        <option key={worker.id} value={worker.id}>
                                                            {worker.full_name || worker.username}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button type="submit" className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                                                    Assign
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
