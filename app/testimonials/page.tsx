import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import { revalidatePath } from 'next/cache'

async function getTestimonials() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select(`
      *,
      customer:profiles!customer_id(full_name)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return testimonials || []
}

async function submitTestimonial(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('testimonials')
    .insert({
      customer_id: user.id,
      rating: parseInt(formData.get('rating') as string),
      testimonial_text: formData.get('testimonial_text'),
      is_approved: false
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/testimonials')
  return { success: true }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Customer Testimonials</h1>

          {/* Submit Testimonial Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Share Your Experience</h2>
            <form action={submitTestimonial} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium mb-2">Your Rating</label>
                <select id="rating" name="rating" required className="border rounded-md px-3 py-2">
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>
              <div>
                <label htmlFor="testimonial_text" className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  id="testimonial_text"
                  name="testimonial_text"
                  required
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Tell us about your experience with Shiva Infotech..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Submit Testimonial
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Your testimonial will be reviewed before being published.
              </p>
            </form>
          </div>

          {/* Testimonials List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No testimonials yet. Be the first to share your experience!
              </div>
            ) : (
              testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.testimonial_text}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">
                      {testimonial.customer?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
