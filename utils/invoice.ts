'use client'

import jsPDF from 'jspdf'

interface InvoiceData {
    orderId: string
    orderDate: string
    customerName: string
    customerEmail: string
    customerPhone: string
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
    total: number
    shippingAddress: {
        full_name: string
        address_line1: string
        address_line2?: string
        city: string
        state: string
        pincode: string
    }
}

export function generateInvoice(data: InvoiceData) {
    const doc = new jsPDF()

    // Company Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Shiva Infotech Solutions', 20, 20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Authorized Dealer: IBM, Lenovo, HP, Dell, Acer', 20, 28)
    doc.text('Email: contact@shivainfotech.com', 20, 34)
    doc.text('Phone: +91-XXXXXXXXXX', 20, 40)

    // Invoice Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', 150, 20)

    // Invoice Details
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice No: ${data.orderId.substring(0, 8).toUpperCase()}`, 150, 28)
    doc.text(`Date: ${new Date(data.orderDate).toLocaleDateString('en-IN')}`, 150, 34)

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(20, 48, 190, 48)

    // Bill To Section
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 20, 58)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, 20, 66)
    if (data.customerEmail) doc.text(data.customerEmail, 20, 72)
    if (data.customerPhone) doc.text(data.customerPhone, 20, 78)

    // Ship To Section
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Ship To:', 120, 58)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(data.shippingAddress.full_name, 120, 66)
    doc.text(data.shippingAddress.address_line1, 120, 72)
    if (data.shippingAddress.address_line2) {
        doc.text(data.shippingAddress.address_line2, 120, 78)
    }
    doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.state}`, 120, data.shippingAddress.address_line2 ? 84 : 78)
    doc.text(`PIN: ${data.shippingAddress.pincode}`, 120, data.shippingAddress.address_line2 ? 90 : 84)

    // Items Table Header
    const tableTop = 110
    doc.setFillColor(66, 66, 66)
    doc.rect(20, tableTop, 170, 8, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Item', 25, tableTop + 6)
    doc.text('Qty', 120, tableTop + 6)
    doc.text('Price', 145, tableTop + 6)
    doc.text('Amount', 170, tableTop + 6)

    // Items Table Body
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    let currentY = tableTop + 15
    data.items.forEach((item, index) => {
        if (currentY > 250) {
            doc.addPage()
            currentY = 20
        }

        doc.text(item.name.substring(0, 40), 25, currentY)
        doc.text(item.quantity.toString(), 125, currentY, { align: 'right' })
        doc.text(`₹${item.price.toFixed(2)}`, 165, currentY, { align: 'right' })
        doc.text(`₹${(item.quantity * item.price).toFixed(2)}`, 185, currentY, { align: 'right' })

        currentY += 8
    })

    // Total Section
    currentY += 5
    doc.setLineWidth(0.3)
    doc.line(120, currentY, 190, currentY)

    currentY += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Total:', 145, currentY)
    doc.text(`₹${data.total.toFixed(2)}`, 185, currentY, { align: 'right' })

    // Footer
    const footerY = 270
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('Thank you for your business!', 105, footerY, { align: 'center' })
    doc.text('For any queries, contact us at contact@shivainfotech.com', 105, footerY + 5, { align: 'center' })

    // Save the PDF
    doc.save(`invoice-${data.orderId.substring(0, 8)}.pdf`)
}

export function downloadInvoice(orderId: string, orderData: any) {
    const invoiceData: InvoiceData = {
        orderId: orderData.id,
        orderDate: orderData.created_at,
        customerName: orderData.customer_name || 'Customer',
        customerEmail: orderData.customer_email || '',
        customerPhone: orderData.shipping_address?.phone || '',
        items: orderData.order_items?.map((item: any) => ({
            name: item.product?.name || item.service?.name || 'Item',
            quantity: item.quantity,
            price: item.price_at_booking
        })) || [],
        total: orderData.total_amount,
        shippingAddress: orderData.shipping_address || {
            full_name: 'N/A',
            address_line1: 'N/A',
            city: 'N/A',
            state: 'N/A',
            pincode: '000000'
        }
    }

    generateInvoice(invoiceData)
}
