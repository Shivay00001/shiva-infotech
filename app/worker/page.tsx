import { createClient } from '@/utils/supabase/server'
import { getWorkerOrders } from '@/utils/orders'

export default async function WorkerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Not authenticated</div>
    }

    const assignments = await getWorkerOrders(user.id)

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">My Assigned Tasks</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl border p-10 text-center">
                        <p className="text-gray-500">No tasks assigned yet.</p>
                    </div>
                ) : (
                    assignments.map((assignment: any) => {
                        const order = assignment.order

                        return (
                            <div key={assignment.id} className="rounded-xl border bg-white shadow-sm p-6">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">Order #{order?.id?.slice(0, 8)}</h3>
                                            <p className="text-sm text-gray-500">
                                                Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {assignment.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="border-t pt-3">
                                        <p className="text-sm font-medium text-gray-900">Customer:</p>
                                        <p className="text-sm text-gray-600">{order?.customer?.full_name || order?.customer?.username}</p>
                                    </div>

                                    {/* Delivery Address */}
                                    {order?.shipping_address && (
                                        <div className="border-t pt-3">
                                            <p className="text-sm font-medium text-gray-900">Delivery Address:</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {order.shipping_address.full_name}<br />
                                                {order.shipping_address.phone}<br />
                                                {order.shipping_address.address_line1}, {order.shipping_address.address_line2 && `${order.shipping_address.address_line2}, `}
                                                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                            </p>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="border-t pt-3">
                                        <p className="text-sm font-medium text-gray-900 mb-2">Items:</p>
                                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                                            {order?.order_items?.map((item: any, idx: number) => (
                                                <li key={idx}>
                                                    {item.product?.name || item.service?.name} (x{item.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {assignment.status !== 'completed' && (
                                    <div className="mt-4 pt-4 border-t">
                                        <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                                            {assignment.status === 'pending' ? 'Start Packing' : 'Mark Completed'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
