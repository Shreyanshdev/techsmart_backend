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

// === SUBSCRIPTIONS CSV EXPORT ===
export const getSubscriptionsCSV = async (req, res) => {
    try {
        const subscriptions = await Models.Subscription.find()
            .populate('customer', 'name phone email')
            .populate('deliveryAddress')
            .sort({ createdAt: -1 });

        const headers = [
            'Subscription No',
            'Customer Name',
            'Mobile',
            'Email',
            'Address',
            'Activation Date',
            'Start Date',
            'End Date',
            'Status',
            'Products',
            'Monthly Bill',
            'Payment Method',
            'Payment Status',
            'Delivery Partner Assigned'
        ];

        const rows = subscriptions.map(sub => [
            sub.subscriptionId || '',
            sub.customer?.name || '',
            sub.customer?.phone || '',
            sub.customer?.email || '',
            [sub.deliveryAddress?.addressLine1, sub.deliveryAddress?.city].filter(Boolean).join(', ') || '',
            formatDate(sub.createdAt),
            formatDate(sub.startDate),
            formatDate(sub.endDate),
            sub.status || '',
            sub.products?.map(p => `${p.productName} (${p.quantityValue}${p.quantityUnit})`).join('; ') || '',
            sub.bill?.toFixed(2) || '0.00',
            sub.paymentDetails?.paymentMethod || 'online',
            sub.paymentStatus || 'pending',
            sub.deliveryPartner?.partner ? 'Yes' : 'No'
        ]);

        const csv = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="subscriptions_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error("Subscriptions CSV Error:", error);
        res.status(500).send("Failed to generate CSV");
    }
};

// === UPCOMING DELIVERIES REPORT ===
export const getUpcomingDeliveries = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + days);

        // Get all active subscriptions
        const subscriptions = await Models.Subscription.find({
            status: { $in: ['active', 'pending'] },
            endDate: { $gte: today }
        })
            .populate('customer', 'name phone')
            .populate('deliveryAddress');

        // Aggregate deliveries by date and product
        const deliveryMap = {};

        subscriptions.forEach(sub => {
            if (!sub.deliveries) return;

            sub.deliveries.forEach(delivery => {
                const deliveryDate = new Date(delivery.date);
                if (deliveryDate >= today && deliveryDate < endDate && delivery.status === 'scheduled') {
                    const dateKey = deliveryDate.toISOString().split('T')[0];

                    if (!deliveryMap[dateKey]) {
                        deliveryMap[dateKey] = {
                            date: dateKey,
                            formattedDate: formatDate(deliveryDate),
                            totalDeliveries: 0,
                            products: {},
                            customers: []
                        };
                    }

                    deliveryMap[dateKey].totalDeliveries++;
                    deliveryMap[dateKey].customers.push({
                        name: sub.customer?.name,
                        phone: sub.customer?.phone,
                        subscriptionId: sub.subscriptionId
                    });

                    // Aggregate products
                    if (delivery.products && delivery.products.length > 0) {
                        delivery.products.forEach(p => {
                            const productKey = `${p.productName}_${p.quantityUnit}`;
                            if (!deliveryMap[dateKey].products[productKey]) {
                                deliveryMap[dateKey].products[productKey] = {
                                    name: p.productName,
                                    unit: p.quantityUnit,
                                    totalQuantity: 0
                                };
                            }
                            deliveryMap[dateKey].products[productKey].totalQuantity += p.quantityValue;
                        });
                    }
                }
            });
        });

        // Convert to array and sort by date
        const report = Object.values(deliveryMap)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(day => ({
                ...day,
                products: Object.values(day.products)
            }));

        // Generate HTML report
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Upcoming Deliveries - Next ${days} Days</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1000px; margin: 0 auto; }
            h1 { color: #333; border-bottom: 3px solid #F5C518; padding-bottom: 10px; }
            .day-card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .day-date { font-size: 20px; font-weight: bold; color: #333; }
            .day-count { background: #F5C518; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .products-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
            .product-item { background: #f9f9f9; padding: 10px 15px; border-radius: 8px; border-left: 4px solid #4CAF50; }
            .product-name { font-weight: bold; }
            .product-qty { color: #666; font-size: 14px; }
            .no-data { text-align: center; padding: 40px; color: #999; }
            .print-btn { position: fixed; bottom: 20px; right: 20px; background: #F5C518; border: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; cursor: pointer; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <button class="print-btn" onclick="window.print()">Print Report</button>
          <div class="container">
            <h1>📦 Upcoming Deliveries - Next ${days} Days</h1>
            ${report.length === 0 ? '<div class="no-data">No scheduled deliveries found</div>' : ''}
            ${report.map(day => `
              <div class="day-card">
                <div class="day-header">
                  <span class="day-date">${day.formattedDate}</span>
                  <span class="day-count">${day.totalDeliveries} Deliveries</span>
                </div>
                <div class="products-list">
                  ${day.products.map(p => `
                    <div class="product-item">
                      <div class="product-name">${p.name}</div>
                      <div class="product-qty">${p.totalQuantity} ${p.unit}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

        res.send(html);
    } catch (error) {
        console.error("Upcoming Deliveries Error:", error);
        res.status(500).send("Failed to generate report");
    }
};

// === DELIVERIES BY DATE REPORT (HTML with Calendar) ===
export const getDeliveriesByDate = async (req, res) => {
    try {
        const dateParam = req.query.date;
        const targetDate = dateParam ? new Date(dateParam) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Get all subscriptions with deliveries on this date
        const subscriptions = await Models.Subscription.find({
            status: { $in: ['active', 'pending'] },
            'deliveries.date': { $gte: targetDate, $lt: nextDay }
        })
            .populate('customer', 'name phone email')
            .populate('deliveryAddress')
            .populate('deliveryPartner.partner', 'name phone');

        // Extract delivery details
        const deliveries = [];
        subscriptions.forEach(sub => {
            const dayDelivery = sub.deliveries?.find(d => {
                const dDate = new Date(d.date);
                dDate.setHours(0, 0, 0, 0);
                return dDate.getTime() === targetDate.getTime();
            });

            if (dayDelivery) {
                // Build items list
                const items = dayDelivery.products?.map(p =>
                    `${p.productName} (${p.quantityValue}${p.quantityUnit})`
                ) || [];

                deliveries.push({
                    subscriptionId: sub.subscriptionId,
                    customerName: sub.customer?.name || 'N/A',
                    phone: sub.customer?.phone || 'N/A',
                    address: [
                        sub.deliveryAddress?.addressLine1,
                        sub.deliveryAddress?.addressLine2,
                        sub.deliveryAddress?.city,
                        sub.deliveryAddress?.pincode
                    ].filter(Boolean).join(', ') || 'N/A',
                    deliveryPartner: sub.deliveryPartner?.partner?.name || 'Not Assigned',
                    status: dayDelivery.status || 'scheduled',
                    items: items
                });
            }
        });

        const formattedDate = formatDate(targetDate);
        const isoDate = targetDate.toISOString().split('T')[0];

        // Generate HTML
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Deliveries - ${formattedDate}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif; padding: 20px; background: #f5f5f5; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 3px solid #F5C518; padding-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        .header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .date-picker { display: flex; align-items: center; gap: 10px; }
        .date-picker input { padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        .date-picker button { background: #F5C518; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .date-picker button:hover { background: #e0b015; }
        .quick-btns { display: flex; gap: 8px; }
        .quick-btns button { background: #fff; border: 1px solid #ddd; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .quick-btns button:hover { background: #f0f0f0; }
        .quick-btns button.active { background: #F5C518; border-color: #F5C518; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .stat-value { font-size: 28px; font-weight: bold; color: #333; }
        .stat-label { color: #666; font-size: 14px; }
        .download-btn { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .download-btn:hover { background: #43a047; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th { background: #333; color: white; padding: 15px; text-align: left; font-weight: 600; }
        td { padding: 12px 15px; border-bottom: 1px solid #eee; }
        tr:hover { background: #f9f9f9; }
        .status { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-scheduled { background: #E3F2FD; color: #1565C0; }
        .status-delivered { background: #E8F5E9; color: #2E7D32; }
        .status-cancelled { background: #FFEBEE; color: #C62828; }
        .items-cell { max-width: 250px; }
        .item-tag { display: inline-block; background: #f0f0f0; padding: 3px 8px; border-radius: 4px; margin: 2px; font-size: 12px; }
        .no-data { text-align: center; padding: 60px; color: #999; background: white; border-radius: 12px; }
        @media print { .header-row, .download-btn { display: none; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>📦 Deliveries Report</h1>
        
        <div class="header-row">
            <div class="date-picker">
                <input type="date" id="datePicker" value="${isoDate}" onchange="goToDate()">
                <button onclick="goToDate()">Go</button>
                <div class="quick-btns">
                    <button onclick="goToRelative(0)" ${isoDate === new Date().toISOString().split('T')[0] ? 'class="active"' : ''}>Today</button>
                    <button onclick="goToRelative(1)">Tomorrow</button>
                    <button onclick="goToRelative(-1)">Yesterday</button>
                </div>
            </div>
            <a href="/api/v1/admin/export/deliveries-by-date?date=${isoDate}" class="download-btn">
                📥 Download CSV
            </a>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${deliveries.length}</div>
                <div class="stat-label">Total Deliveries</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formattedDate}</div>
                <div class="stat-label">Selected Date</div>
            </div>
        </div>

        ${deliveries.length === 0 ? '<div class="no-data">No deliveries scheduled for this date</div>' : `
        <table>
            <thead>
                <tr>
                    <th>Sub ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Partner</th>
                    <th>Status</th>
                    <th>Items</th>
                </tr>
            </thead>
            <tbody>
                ${deliveries.map(d => `
                <tr>
                    <td><strong>${d.subscriptionId}</strong></td>
                    <td>${d.customerName}</td>
                    <td>${d.phone}</td>
                    <td>${d.address}</td>
                    <td>${d.deliveryPartner}</td>
                    <td><span class="status status-${d.status}">${d.status}</span></td>
                    <td class="items-cell">${d.items.map(i => `<span class="item-tag">${i}</span>`).join('')}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        `}
    </div>
    
    <script>
        function goToDate() {
            const date = document.getElementById('datePicker').value;
            window.location.href = '/api/v1/admin/reports/deliveries-by-date?date=' + date;
        }
        function goToRelative(offset) {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            window.location.href = '/api/v1/admin/reports/deliveries-by-date?date=' + d.toISOString().split('T')[0];
        }
    </script>
</body>
</html>
        `;

        res.send(html);
    } catch (error) {
        console.error("Deliveries By Date Error:", error);
        res.status(500).send("Failed to generate report");
    }
};

// === DELIVERIES BY DATE CSV EXPORT ===
export const getDeliveriesCSVByDate = async (req, res) => {
    try {
        const dateParam = req.query.date;
        const targetDate = dateParam ? new Date(dateParam) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Get all subscriptions with deliveries on this date
        const subscriptions = await Models.Subscription.find({
            status: { $in: ['active', 'pending'] },
            'deliveries.date': { $gte: targetDate, $lt: nextDay }
        })
            .populate('customer', 'name phone email')
            .populate('deliveryAddress')
            .populate('deliveryPartner.partner', 'name phone');

        // Find max items count to create dynamic columns
        let maxItems = 0;
        const rows = [];

        subscriptions.forEach(sub => {
            const dayDelivery = sub.deliveries?.find(d => {
                const dDate = new Date(d.date);
                dDate.setHours(0, 0, 0, 0);
                return dDate.getTime() === targetDate.getTime();
            });

            if (dayDelivery) {
                const items = dayDelivery.products?.map(p =>
                    `${p.productName} (${p.quantityValue}${p.quantityUnit})`
                ) || [];

                maxItems = Math.max(maxItems, items.length);

                rows.push({
                    subscriptionId: sub.subscriptionId || '',
                    customerName: sub.customer?.name || '',
                    phone: sub.customer?.phone || '',
                    address: [
                        sub.deliveryAddress?.addressLine1,
                        sub.deliveryAddress?.addressLine2,
                        sub.deliveryAddress?.city,
                        sub.deliveryAddress?.pincode
                    ].filter(Boolean).join(', ') || '',
                    deliveryPartner: sub.deliveryPartner?.partner?.name || 'Not Assigned',
                    status: dayDelivery.status || 'scheduled',
                    items: items
                });
            }
        });

        // Build headers with dynamic item columns
        const headers = [
            'Subscription ID',
            'Customer Name',
            'Phone',
            'Address',
            'Delivery Partner',
            'Status',
            ...Array.from({ length: maxItems }, (_, i) => `Item ${i + 1}`)
        ];

        // Build CSV rows
        const csvRows = rows.map(row => [
            row.subscriptionId,
            row.customerName,
            row.phone,
            row.address,
            row.deliveryPartner,
            row.status,
            ...row.items,
            ...Array(maxItems - row.items.length).fill('') // Pad empty columns
        ]);

        const csv = [
            headers.map(escapeCSV).join(','),
            ...csvRows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const isoDate = targetDate.toISOString().split('T')[0];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="deliveries_${isoDate}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error("Deliveries CSV Error:", error);
        res.status(500).send("Failed to generate CSV");
    }
};
