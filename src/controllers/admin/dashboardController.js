import * as Models from "../../models/index.js";

/**
 * Get dashboard statistics for AdminJS
 */
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Parallel aggregation queries for performance
        const [
            totalOrders,
            totalCustomers,
            ordersByStatus,
            recentOrders,
            weeklyOrders
        ] = await Promise.all([
            // Total counts
            Models.Order.countDocuments(),
            Models.Customer.countDocuments(),

            // Orders by status
            Models.Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            // Recent orders (last 5)
            Models.Order.find()
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

        res.json({
            success: true,
            data: {
                totals: {
                    orders: totalOrders,
                    customers: totalCustomers,
                },
                ordersByStatus: orderStatusMap,
                recentOrders: recentOrders.map(o => ({
                    id: o.orderId,
                    customer: o.customer?.name || 'N/A',
                    status: o.status,
                    amount: o.totalPrice,
                    date: o.createdAt
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
