import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'

async function processPayment(formData: FormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const orderId = formData.get('order_id') as string
    const paymentMethod = formData.get('payment_method') as string

    // Record payment transaction
    const { error } = await supabase
        .from('payment_transactions')
        .insert({
            order_id: orderId,
            payment_method: paymentMethod,
            amount: parseFloat(formData.get('amount') as string),
            status: paymentMethod === 'cod' ? 'pending' : 'processing',
            payment_date: new Date().toISOString()
        })

    if (error) {
        return { error: error.message }
    }

    // Update order status
    await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

    // Create notification
    await supabase
        .from('notifications')
        .insert({
            user_id: user.id,
            type: 'order',
            title: 'Order Confirmed',
            message: `Your order has been confirmed and will be processed shortly.`,
            link: `/orders`
        })

    redirect('/orders')
}

export default async function PaymentPage({
    searchParams
}: {
    searchParams: { order_id: string; amount: string }
}) {
    if (!searchParams.order_id || !searchParams.amount) {
        redirect('/cart')
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">Order Total</span>
                            <span className="text-3xl font-bold text-indigo-600">₹{searchParams.amount}</span>
                        </div>

                        <form action={processPayment} className="space-y-6">
                            <input type="hidden" name="order_id" value={searchParams.order_id} />
                            <input type="hidden" name="amount" value={searchParams.amount} />

                            <div>
                                <h2 className="font-semibold text-lg mb-4">Select Payment Method</h2>

                                <div className="space-y-3">
                                    {/* Cash on Delivery */}
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment_method" value="cod" required className="mr-3" />
                                        <div>
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                        </div>
                                    </label>

                                    {/* UPI */}
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment_method" value="upi" required className="mr-3" />
                                        <div>
                                            <p className="font-medium">UPI</p>
                                            <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, etc.</p>
                                        </div>
                                    </label>

                                    {/* Card */}
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment_method" value="card" required className="mr-3" />
                                        <div>
                                            <p className="font-medium">Credit/Debit Card</p>
                                            <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                                        </div>
                                    </label>

                                    {/* Net Banking */}
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment_method" value="netbanking" required className="mr-3" />
                                        <div>
                                            <p className="font-medium">Net Banking</p>
                                            <p className="text-sm text-gray-600">All major banks supported</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                Proceed to Payment
                            </button>
                        </form>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        <p>🔒 Your payment information is secure and encrypted</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
