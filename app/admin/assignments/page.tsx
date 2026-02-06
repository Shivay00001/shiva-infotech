import { createClient } from '@/utils/supabase/server'

async function getAssignments() {
    const supabase = await createClient()
    const { data: assignments } = await supabase
        .from('assignments')
        .select(`
      *,
      order:orders(*),
      worker:profiles!worker_id(full_name, username)
    `)
        .order('assigned_at', { ascending: false })

    return assignments || []
}

async function getWorkers() {
    const supabase = await createClient()
    const { data: workers } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .eq('role', 'worker')

    return workers || []
}

export default async function AdminAssignmentsPage() {
    const assignments = await getAssignments()
    const workers = await getWorkers()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Task Assignments</h2>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Assigned Worker
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Assigned Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No assignments found. Assign orders to workers from the Orders page.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment: any) => (
                                    <tr key={assignment.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-mono">
                                            {assignment.order_id?.slice(0, 8)}...
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {assignment.worker?.full_name || assignment.worker?.username || 'Unassigned'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {assignment.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {new Date(assignment.assigned_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {assignment.notes || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <p className="text-sm text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {assignments.filter((a: any) => a.status === 'in_progress').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {assignments.filter((a: any) => a.status === 'completed').length}
                    </p>
                </div>
            </div>
        </div>
    )
}
