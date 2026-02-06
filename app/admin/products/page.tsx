import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getProducts() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return products || []
}

async function addProduct(formData: FormData) {
    'use server'

    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .insert({
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string),
            category: formData.get('category'),
            image_url: formData.get('image_url')
        })

    if (error) {
        console.error('Error adding product:', error)
    }

    revalidatePath('/admin/products')
}

async function deleteProduct(productId: string) {
    'use server'

    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        console.error('Error deleting product:', error)
    }

    revalidatePath('/admin/products')
}

export default async function AdminProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Management</h2>
            </div>

            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4">Add New Product</h3>
                <form action={addProduct} className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            name="name"
                            required
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Dell PowerEdge Server"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            name="category"
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Servers"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={2}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="Product description..."
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
                            placeholder="50000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                        <input
                            name="stock"
                            type="number"
                            required
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="10"
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
                            Add Product
                        </button>
                    </div>
                </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No products found. Add your first product above.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {product.image_url ? (
                                                        <img className="h-10 w-10 rounded object-cover" src={product.image_url} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-200"></div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {product.category || 'Uncategorized'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            ₹{product.price}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <form action={deleteProduct.bind(null, product.id)}>
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
