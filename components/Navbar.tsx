import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Shiva Infotech
                </Link>

                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
                    <Link href="/products" className="text-gray-700 hover:text-indigo-600">Products</Link>
                    <Link href="/services/book" className="text-gray-700 hover:text-indigo-600">Services</Link>
                    <Link href="/orders" className="text-gray-700 hover:text-indigo-600">My Orders</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/wishlist" className="text-gray-700 hover:text-indigo-600" title="Wishlist">
                        <Heart className="h-5 w-5" />
                    </Link>
                    <Link href="/cart" className="text-gray-700 hover:text-indigo-600" title="Cart">
                        <ShoppingCart className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/login"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    )
}
