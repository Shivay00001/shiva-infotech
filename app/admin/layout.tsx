import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <div className="flex flex-col w-full">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <div className="w-full flex-1">
                        {/* Header content like Breadcrumbs or Search could go here */}
                        <h1 className="font-semibold text-lg">Admin Panel</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Dropdown or Avatar could go here */}
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
