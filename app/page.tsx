import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ShieldCheck, Server, Monitor, PenTool } from 'lucide-react'
import { getFeaturedProducts } from '@/utils/customer'
import { createClient } from '@/utils/supabase/server'

async function getFeaturedTestimonials() {
    const supabase = await createClient()
    const { data: testimonials } = await supabase
        .from('testimonials')
        .select(`
      *,
      customer:profiles!customer_id(full_name)
    `)
        .eq('is_approved', true)
        .eq('is_featured', true)
        .limit(3)
    return testimonials || []
}

// Placeholder services data (static)
const services = [
    { title: 'Server Solutions', icon: Server, desc: 'IBM, Lenovo, HP, Dell authorized server setup and maintenance.' },
    { title: 'Security Systems', icon: ShieldCheck, desc: 'CCTV Camera, Biometric Attendance, Video Door Phones.' },
    { title: 'Desktop & Laptops', icon: Monitor, desc: 'Wide range of HP, Lenovo, Dell, Acer desktops and laptops.' },
    { title: 'AMC Services', icon: PenTool, desc: 'Annual Maintenance Contracts for all your IT infrastructure.' },
]

export default async function HomePage() {
    const products = await getFeaturedProducts()
    const testimonials = await getFeaturedTestimonials()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="flex flex-col min-h-screen">
                    {/* Hero Section */}
                    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white z-0" />
                        <div className="container relative z-10 px-4 md:px-6">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                                        Premium IT Solutions for Your Business
                                    </h1>
                                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                        Leading provider of Servers, Desktops, Laptops, Security Systems, and Networking Solutions.
                                    </p>
                                </div>
                                <div className="space-x-4">
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                                        href="#products"
                                    >
                                        Shop Products
                                    </Link>
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                                        href="#services"
                                    >
                                        Book Service
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Expertise</h2>
                                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                        Comprehensive IT infrastructure solutions tailored to your needs.
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                                {services.map((item, index) => (
                                    <div key={index} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm border">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-indigo-100 p-3">
                                                <item.icon className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                        </div>
                                        <p className="text-gray-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    {testimonials.length > 0 && (
                        <section className="w-full py-12 md:py-24 bg-white border-y">
                            <div className="container px-4 md:px-6">
                                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
                                    <p className="max-w-[700px] text-gray-500 md:text-xl">
                                        Trusted by businesses across India
                                    </p>
                                </div>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {testimonials.map((testimonial: any) => (
                                        <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                            <div className="flex gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < testimonial.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-700 mb-4 italic">
                                                "{testimonial.testimonial_text}"
                                            </p>
                                            <p className="font-semibold text-sm">
                                                {testimonial.customer?.full_name || 'Anonymous'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-8">
                                    <Link href="/testimonials" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                        Read More Reviews →
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Products Section */}
                    <section id="products" className="w-full py-12 md:py-24 lg:py-32 bg-white">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
                            </div>

                            {products.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    <p>No products available at the moment. Please check back later.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {products.map((product: any) => (
                                        <div key={product.id} className="group relative rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
                                            <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200 relative">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="text-lg font-semibold group-hover:underline truncate">{product.name}</h3>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="font-bold text-indigo-600">₹{product.price}</span>
                                                    <button className="text-sm rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <footer className="w-full py-6 bg-white border-t">
                <div className="container px-4 md:px-6 flex flex-col items-center gap-2 text-center">
                    <p className="text-sm text-gray-500">© 2024 Shiva Infotech Solutions. All rights reserved.</p>
                    <div className="text-xs text-gray-400">
                        Authorized Dealer: IBM, Lenovo, HP, Dell, Acer | CCTV & Security Systems
                    </div>
                </div>
            </footer>
        </div>
    )
}
