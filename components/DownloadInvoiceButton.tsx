'use client'

import { Download } from 'lucide-react'
import { downloadInvoice } from '@/utils/invoice'

export function DownloadInvoiceButton({ order }: { order: any }) {
    const handleDownload = () => {
        downloadInvoice(order.id, order)
    }

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
            <Download className="h-4 w-4" />
            Download Invoice
        </button>
    )
}
