import { getUserNotifications, markNotificationAsRead } from '@/utils/customer'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function NotificationsPage() {
    const notifications = await getUserNotifications()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8">Notifications</h1>

                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-gray-500">No notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notif: any) => (
                                <div
                                    key={notif.id}
                                    className={`bg-white rounded-lg shadow-sm border p-4 ${!notif.is_read ? 'border-l-4 border-l-indigo-600' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">{notif.title}</h3>
                                                {!notif.is_read && (
                                                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">New</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(notif.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {notif.link && (
                                            <Link href={notif.link} className="text-indigo-600 hover:text-indigo-700 text-sm">
                                                View →
                                            </Link>
                                        )}
                                    </div>
                                    {!notif.is_read && (
                                        <form action={markNotificationAsRead.bind(null, notif.id)} className="mt-2">
                                            <button className="text-xs text-gray-500 hover:text-gray-700">
                                                Mark as read
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
