import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

async function searchProducts(
    query: string = '',
    category?: string,
    minPrice?: number,
    maxPrice?: number
) {
    const supabase = await createClient()
    let queryBuilder = supabase
        .from('products')
        .select('*')

    if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category)
    }

    if (minPrice) {
        queryBuilder = queryBuilder.gte('price', minPrice)
    }

    if (maxPrice) {
        queryBuilder = queryBuilder.lte('price', maxPrice)
    }

    const { data: products } = await queryBuilder.order('created_at', { ascending: false })

    return products || []
}

async function getCategories() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('category')

    const categories = [...new Set(products?.map(p => p.category).filter(Boolean))]
    return categories
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; min?: string; max?: string }
}) {
    const products = await searchProducts(
        searchParams.q || '',
        searchParams.category,
        searchParams.min ? parseFloat(searchParams.min) : undefined,
        searchParams.max ? parseFloat(searchParams.max) : undefined
    )
    const categories = await getCategories()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Products</h1>

                    {/* Search & Filters */}
                    <div className="bg-white rounded-lg p-6 mb-8 shadow">
                        <form className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="search-query" className="block text-sm font-medium mb-1">Search</label>
                                <input
                                    id="search-query"
                                    name="q"
                                    type="text"
                                    placeholder="Search products..."
                                    defaultValue={searchParams.q}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="category-filter" className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    id="category-filter"
                                    name="category"
                                    defaultValue={searchParams.category}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="min-price" className="block text-sm font-medium mb-1">Min Price</label>
                                <input
                                    id="min-price"
                                    name="min"
                                    type="number"
                                    placeholder="Min"
                                    defaultValue={searchParams.min}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="max-price" className="block text-sm font-medium mb-1">Max Price</label>
                                <input
                                    id="max-price"
                                    name="max"
                                    type="number"
                                    placeholder="Max"
                                    defaultValue={searchParams.max}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                                    Apply Filters
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-gray-500">No products found</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    <div className="aspect-square w-full bg-gray-200 relative">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover group-hover:opacity-90"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-indigo-600 text-xl">₹{product.price}</span>
                                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
