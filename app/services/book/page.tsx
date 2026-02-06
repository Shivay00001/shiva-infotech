import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'

async function getServices() {
    const supabase = await createClient()
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true })

    return services || []
}

async function getAddresses() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: addresses } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false })

    return addresses || []
}

async function bookService(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('service_bookings')
        .insert({
            service_id: formData.get('service_id'),
            customer_id: user.id,
            address_id: formData.get('address_id'),
            booking_date: formData.get('booking_date'),
            time_slot: formData.get('time_slot'),
            issue_description: formData.get('issue_description'),
            status: 'pending'
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export default async function BookServicePage() {
    const services = await getServices()
    const addresses = await getAddresses()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <h1 className="text-3xl font-bold mb-8">Book a Service</h1>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <form action={bookService} className="space-y-6">
                            {/* Service Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Service</label>
                                <select
                                    name="service_id"
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="">Choose a service...</option>
                                    {services.map((service: any) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} - ₹{service.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    name="booking_date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            {/* Time Slot */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                                <select name="time_slot" required className="w-full border rounded-md px-3 py-2">
                                    <option value="">Select time slot...</option>
                                    <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                                    <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                                    <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                                </select>
                            </div>

                            {/* Address Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Service Address</label>
                                {addresses.length > 0 ? (
                                    <select name="address_id" required className="w-full border rounded-md px-3 py-2">
                                        <option value="">Select address...</option>
                                        {addresses.map((addr: any) => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.address_line1}, {addr.city} - {addr.pincode}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No saved addresses. Please add one during checkout.
                                    </p>
                                )}
                            </div>

                            {/* Issue Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Describe the Issue</label>
                                <textarea
                                    name="issue_description"
                                    rows={4}
                                    placeholder="Please describe the problem you're facing..."
                                    className="w-full border rounded-md px-3 py-2"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-medium"
                            >
                                Book Service
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
