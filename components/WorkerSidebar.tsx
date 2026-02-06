import Link from 'next/link'
import { ClipboardList, CheckSquare, LogOut } from 'lucide-react'

const navigation = [
    { name: 'My Tasks', href: '/worker', icon: ClipboardList },
    { name: 'Completed', href: '/worker/completed', icon: CheckSquare },
]

export default function WorkerSidebar() {
    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64 min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/worker">
                        <span className="">Worker Panel</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <form action="/auth/signout" method="post">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
