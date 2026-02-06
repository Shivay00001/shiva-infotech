import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

async function getProducts(ids: string[]) {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)

    return products || []
}

export default async function ProductComparePage({
    searchParams
}: {
    searchParams: { ids?: string }
}) {
    const productIds = searchParams.ids?.split(',').filter(Boolean) || []

    if (productIds.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Comparison</h1>
                    <p className="text-gray-600 mb-6">No products selected for comparison</p>
                    <Link href="/products" className="text-indigo-600 hover:text-indigo-700">
                        Browse Products →
                    </Link>
                </main>
            </div>
        )
    }

    const products = await getProducts(productIds)

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Compare Products</h1>
                        <Link href="/products" className="text-indigo-600 hover:text-indigo-700">
                            ← Back to Products
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Specification
                                    </th>
                                    {products.map((product: any) => (
                                        <th key={product.id} className="px-6 py-4 text-center">
                                            <div className="w-32 h-32 mx-auto mb-2 bg-gray-200 rounded">
                                                {product.image_url && (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded" />
                                                )}
                                            </div>
                                            <div className="font-semibold text-sm">{product.name}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Price */}
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-900">Price</td>
                                    {products.map((product: any) => (
                                        <td key={product.id} className="px-6 py-4 text-center">
                                            <span className="text-xl font-bold text-indigo-600">₹{product.price}</span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Description */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">Description</td>
                                    {products.map((product: any) => (
                                        <td key={product.id} className="px-6 py-4 text-center text-sm text-gray-600">
                                            {product.description || '-'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-900">Category</td>
                                    {products.map((product: any) => (
                                        <td key={product.id} className="px-6 py-4 text-center text-sm">
                                            {product.category || '-'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Stock */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">Availability</td>
                                    {products.map((product: any) => (
                                        <td key={product.id} className="px-6 py-4 text-center text-sm">
                                            {product.stock > 0 ? (
                                                <span className="text-green-600 font-medium">In Stock ({product.stock})</span>
                                            ) : (
                                                <span className="text-red-600 font-medium">Out of Stock</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                {/* Actions */}
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-900">Actions</td>
                                    {products.map((product: any) => (
                                        <td key={product.id} className="px-6 py-4 text-center">
                                            <div className="space-y-2">
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                                                >
                                                    View Details
                                                </Link>
                                                {product.stock > 0 && (
                                                    <button className="w-full bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 text-sm">
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Comparing {products.length} product{products.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </main>
        </div>
    )
}
