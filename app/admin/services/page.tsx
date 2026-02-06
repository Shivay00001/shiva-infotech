import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getServices() {
    const supabase = await createClient()
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

    return services || []
}

async function addService(formData: FormData) {
    'use server'

    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .insert({
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price') as string),
            category: formData.get('category'),
            image_url: formData.get('image_url')
        })

    if (error) {
        console.error('Error adding service:', error)
    }

    revalidatePath('/admin/services')
}

async function deleteService(serviceId: string) {
    'use server'

    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

    if (error) {
        console.error('Error deleting service:', error)
    }

    revalidatePath('/admin/services')
}

export default async function AdminServicesPage() {
    const services = await getServices()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Service Management</h2>
            </div>

            {/* Add Service Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4">Add New Service</h3>
                <form action={addService} className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Service Name</label>
                        <input
                            name="name"
                            required
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Server Installation"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            name="category"
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Installation"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={2}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Service description..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            required
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="5000"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                            name="image_url"
                            type="url"
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                        >
                            Add Service
                        </button>
                    </div>
                </form>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No services found. Add your first service above.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service: any) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {service.image_url ? (
                                                        <img className="h-10 w-10 rounded object-cover" src={service.image_url} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-200"></div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{service.name}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {service.category || 'Uncategorized'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            ₹{service.price}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <form action={deleteService.bind(null, service.id)}>
                                                <button className="text-red-600 hover:text-red-900">Delete</button>
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
