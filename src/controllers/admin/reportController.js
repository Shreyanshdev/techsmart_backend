import * as Models from "../../models/index.js";

// Helper to escape CSV fields
const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

// Helper to format date
const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
};

// === ORDERS CSV EXPORT ===
export const getOrdersCSV = async (req, res) => {
    try {
        const orders = await Models.Order.find()
            .populate('customer', 'name phone email')
            .populate('branch', 'name')
            .sort({ createdAt: -1 });

        const headers = [
            'Order No',
            'Order Date',
            'Customer Name',
            'Mobile',
            'Email',
            'Delivery Address',
            'Branch',
            'Items',
            'Total Amount',
            'Payment Method',
            'Payment Status',
            'Order Status',
            'Delivery Partner Assigned'
        ];

        const rows = orders.map(order => [
            order.orderId || '',
            formatDate(order.createdAt),
            order.customer?.name || '',
            order.customer?.phone || '',
            order.customer?.email || '',
            order.deliveryLocation?.address || '',
            order.branch?.name || '',
            order.items?.map(i => i.item).join('; ') || '',
            order.totalPrice?.toFixed(2) || '0.00',
            order.paymentDetails?.paymentMethod || 'online',
            order.paymentStatus || 'pending',
            order.status || '',
            order.deliveryPartner ? 'Yes' : 'No'
        ]);

        const csv = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="orders_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error("Orders CSV Error:", error);
        res.status(500).send("Failed to generate CSV");
    }
};
