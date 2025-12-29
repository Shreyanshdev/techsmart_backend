import * as Models from "../../models/index.js";

/**
 * Get dashboard statistics for AdminJS
 */
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Parallel aggregation queries for performance
        const [
            totalOrders,
            totalSubscriptions,
            totalCustomers,
            ordersByStatus,
            subscriptionsByStatus,
            paymentStats,
            todaysDeliveries,
            recentOrders,
            recentSubscriptions,
            weeklyOrders
        ] = await Promise.all([
            // Total counts
            Models.Order.countDocuments(),
            Models.Subscription.countDocuments(),
            Models.Customer.countDocuments(),

            // Orders by status
            Models.Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            // Subscriptions by status
            Models.Subscription.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            // Payment stats
            Models.Subscription.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$bill" },
                        verifiedPayments: {
                            $sum: { $cond: [{ $eq: ["$paymentStatus", "verified"] }, 1, 0] }
                        },
                        pendingPayments: {
                            $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] }
                        },
                        codPayments: {
                            $sum: { $cond: [{ $eq: ["$paymentDetails.paymentMethod", "cod"] }, 1, 0] }
                        },
                        onlinePayments: {
                            $sum: { $cond: [{ $eq: ["$paymentDetails.paymentMethod", "online"] }, 1, 0] }
                        }
                    }
                }
            ]),

            // Today's deliveries count
            Models.Subscription.aggregate([
                { $unwind: "$deliveries" },
                {
                    $match: {
                        "deliveries.date": { $gte: today, $lt: tomorrow },
                        "deliveries.status": "scheduled"
                    }
                },
                { $count: "total" }
            ]),

            // Recent orders (last 5)
            Models.Order.find()
                .populate('customer', 'name phone')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Recent subscriptions (last 5)
            Models.Subscription.find()
                .populate('customer', 'name phone')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Weekly orders trend
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: weekAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Format order status data
        const orderStatusMap = {
            pending: 0,
            confirmed: 0,
            preparing: 0,
            ready: 0,
            delivered: 0,
            cancelled: 0
        };
        ordersByStatus.forEach(item => {
            if (item._id && orderStatusMap.hasOwnProperty(item._id)) {
                orderStatusMap[item._id] = item.count;
            }
        });

        // Format subscription status data
        const subscriptionStatusMap = {
            active: 0,
            pending: 0,
            expired: 0,
            cancelled: 0
        };
        subscriptionsByStatus.forEach(item => {
            if (item._id && subscriptionStatusMap.hasOwnProperty(item._id)) {
                subscriptionStatusMap[item._id] = item.count;
            }
        });

        // Payment stats defaults
        const paymentData = paymentStats[0] || {
            totalRevenue: 0,
            verifiedPayments: 0,
            pendingPayments: 0,
            codPayments: 0,
            onlinePayments: 0
        };

        res.json({
            success: true,
            data: {
                totals: {
                    orders: totalOrders,
                    subscriptions: totalSubscriptions,
                    customers: totalCustomers,
                    revenue: paymentData.totalRevenue
                },
                ordersByStatus: orderStatusMap,
                subscriptionsByStatus: subscriptionStatusMap,
                payments: {
                    verified: paymentData.verifiedPayments,
                    pending: paymentData.pendingPayments,
                    cod: paymentData.codPayments,
                    online: paymentData.onlinePayments
                },
                todaysDeliveries: todaysDeliveries[0]?.total || 0,
                recentOrders: recentOrders.map(o => ({
                    id: o.orderId,
                    customer: o.customer?.name || 'N/A',
                    status: o.status,
                    amount: o.totalPrice,
                    date: o.createdAt
                })),
                recentSubscriptions: recentSubscriptions.map(s => ({
                    id: s.subscriptionId,
                    customer: s.customer?.name || 'N/A',
                    status: s.status,
                    amount: s.bill,
                    date: s.createdAt
                })),
                weeklyTrend: weeklyOrders
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch dashboard stats" });
    }
};

/**
 * Get deliveries by date as JSON for AdminJS component
 */
export const getDeliveriesJSON = async (req, res) => {
    try {
        const dateParam = req.query.date;
        const targetDate = dateParam ? new Date(dateParam) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Find subscriptions with deliveries on the target date
        const subscriptions = await Models.Subscription.find({
            'deliveries.date': { $gte: targetDate, $lt: nextDay }
        })
            .populate('customer', 'name phone')
            .populate('deliveryAddress')
            .populate('deliveryPartner.partner', 'name phone')
            .lean();

        // Extract deliveries for the target date
        const deliveries = [];
        subscriptions.forEach(sub => {
            const delivery = sub.deliveries.find(d => {
                const dDate = new Date(d.date);
                return dDate >= targetDate && dDate < nextDay;
            });

            if (delivery) {
                const address = sub.deliveryAddress;
                const addressParts = [];
                if (address?.addressLine1) addressParts.push(address.addressLine1);
                if (address?.addressLine2) addressParts.push(address.addressLine2);
                if (address?.city) addressParts.push(address.city);
                if (address?.state) addressParts.push(address.state);
                if (address?.zipCode) addressParts.push(address.zipCode);
                const addressStr = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';

                // Format items with proper quantity display and count
                const items = delivery.products?.map(p => {
                    // Find matching product in subscription to get count
                    const subProduct = sub.products?.find(sp =>
                        sp.subscriptionProductId === p.subscriptionProductId ||
                        sp.productId?.toString() === p.productId?.toString()
                    );
                    const count = subProduct?.count || 1;
                    const qty = `${p.quantityValue || 1}${p.quantityUnit || ''}`;
                    return {
                        name: p.productName,
                        qty: qty,
                        count: count,
                        display: `${p.productName} (${qty}) × ${count}`
                    };
                }) || [];

                deliveries.push({
                    subscriptionId: sub.subscriptionId,
                    customerName: sub.customer?.name || 'N/A',
                    phone: sub.customer?.phone || 'N/A',
                    address: addressStr,
                    deliveryPartner: sub.deliveryPartner?.partner?.name || 'Unassigned',
                    status: delivery.status,
                    itemCount: items.length,
                    items: items
                });
            }
        });

        res.json({
            success: true,
            data: {
                date: targetDate.toISOString().split('T')[0],
                total: deliveries.length,
                deliveries
            }
        });
    } catch (error) {
        console.error("Deliveries JSON Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch deliveries" });
    }
};

/**
 * Get orders by date/filter as JSON for AdminJS component
 */
export const getOrdersJSON = async (req, res) => {
    try {
        const { date, filter } = req.query;

        // Build query
        let query = {};

        // Date filter
        if (date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query.createdAt = { $gte: targetDate, $lt: nextDay };
        }

        // Status/type filter
        if (filter) {
            switch (filter) {
                case 'unassigned':
                    query.deliveryPartner = { $exists: false };
                    break;
                case 'assigned':
                    query.deliveryPartner = { $exists: true, $ne: null };
                    break;
                case 'cod':
                    query['paymentDetails.paymentMethod'] = 'cod';
                    break;
                case 'online':
                    query['paymentDetails.paymentMethod'] = 'online';
                    break;
                case 'paid':
                    query.paymentStatus = 'verified';
                    break;
                case 'pending':
                    query.status = 'pending';
                    break;
                case 'delivered':
                    query.status = 'delivered';
                    break;
                case 'cancelled':
                    query.status = 'cancelled';
                    break;
            }
        }

        const orders = await Models.Order.find(query)
            .populate('customer', 'name phone')
            .populate('deliveryPartner', 'name phone')
            .populate('branch', 'name')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        const formattedOrders = orders.map(order => {
            // Determine payment method - if verified but no method set, it's online
            let paymentMethod = order.paymentDetails?.paymentMethod;
            if (!paymentMethod && order.paymentStatus === 'verified') {
                paymentMethod = 'online';
            } else if (!paymentMethod) {
                paymentMethod = 'N/A';
            }

            return {
                orderId: order.orderId,
                customerName: order.customer?.name || 'N/A',
                phone: order.customer?.phone || 'N/A',
                deliveryPartner: order.deliveryPartner?.name || 'Unassigned',
                address: order.deliveryLocation?.address || 'N/A',
                status: order.status,
                paymentMethod: paymentMethod,
                paymentStatus: order.paymentStatus,
                amount: order.totalPrice,
                itemCount: order.items?.length || 0,
                items: order.items?.map(item => ({
                    name: item.item,
                    count: item.count,
                    display: `${item.item} × ${item.count}`
                })) || [],
                createdAt: order.createdAt
            };
        });

        // Get summary counts
        const allOrders = await Models.Order.find(date ? {
            createdAt: query.createdAt
        } : {}).lean();

        const summary = {
            total: allOrders.length,
            unassigned: allOrders.filter(o => !o.deliveryPartner).length,
            cod: allOrders.filter(o => o.paymentDetails?.paymentMethod === 'cod').length,
            online: allOrders.filter(o => o.paymentDetails?.paymentMethod === 'online').length,
            paid: allOrders.filter(o => o.paymentStatus === 'verified').length,
            pending: allOrders.filter(o => o.status === 'pending').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length
        };

        res.json({
            success: true,
            data: {
                date: date || 'all',
                filter: filter || 'all',
                count: formattedOrders.length,
                summary,
                orders: formattedOrders
            }
        });
    } catch (error) {
        console.error("Orders JSON Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
};
