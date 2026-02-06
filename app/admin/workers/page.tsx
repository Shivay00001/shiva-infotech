import { createClient } from '@/utils/supabase/server'
import { createWorker, deleteWorker } from '@/app/auth/actions'

async function getWorkers() {
    const supabase = await createClient()
    const { data: workers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'worker')
        .order('created_at', { ascending: false })

    return workers || []
}

export default async function WorkersPage() {
    const workers = await getWorkers()

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Worker Management
                    </h2>
                </div>
            </div>

            {/* Add Worker Form */}
            <div className="rounded-lg bg-white p-6 shadow-sm border">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Add New Worker
                </h3>
                <form action={createWorker} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                required
                                placeholder="e.g., worker@username"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                id="full_name"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Worker
                        </button>
                    </div>
                </form>
            </div>

            {/* Workers List */}
            <div className="rounded-lg bg-white shadow-sm border">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        Current Workers
                    </h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {workers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No workers found. Add a new worker above.
                                        </td>
                                    </tr>
                                ) : (
                                    workers.map((worker) => (
                                        <tr key={worker.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {worker.username}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {worker.full_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(worker.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <form action={deleteWorker.bind(null, worker.id)} className="inline">
                                                    <button
                                                        type="submit"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
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
        </div>
    )
}
