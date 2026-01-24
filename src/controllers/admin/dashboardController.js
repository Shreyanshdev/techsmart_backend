import * as Models from "../../models/index.js";

/**
 * Get dashboard statistics for AdminJS - Enhanced with Sales Analytics
 */
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        // Parallel aggregation queries for performance
        const [
            totalOrders,
            totalCustomers,
            totalProducts,
            totalBranches,
            ordersByStatus,
            recentOrders,
            todaysOrders,
            todaysRevenue,
            weeklyRevenue,
            monthlyRevenue,
            lastMonthRevenue,
            dailyRevenueData,
            weeklyRevenueData,
            bestSellingProducts,
            branchPerformance,
            paymentMethodStats,
            deliveryStats
        ] = await Promise.all([
            // Total counts
            Models.Order.countDocuments(),
            Models.Customer.countDocuments(),
            Models.Product.countDocuments({ isActive: true }),
            Models.Branch.countDocuments({ isActive: true }),

            // Orders by status
            Models.Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            // Recent orders (last 10)
            Models.Order.find()
                .populate('customer', 'name phone')
                .populate('branch', 'name')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Today's orders count
            Models.Order.countDocuments({ createdAt: { $gte: today } }),

            // Today's revenue
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // This week's revenue
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // This month's revenue
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // Last month's revenue (for comparison)
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // Daily revenue for last 7 days (chart data)
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        revenue: { $sum: "$totalPrice" },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // Weekly revenue for last 4 weeks (chart data)
            Models.Order.aggregate([
                { $match: { createdAt: { $gte: monthAgo }, status: { $ne: 'cancelled' } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-W%V", date: "$createdAt" } },
                        revenue: { $sum: "$totalPrice" },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // Best selling products (top 5)
            Models.Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.productName",
                        totalQuantity: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$items.totalPrice" },
                        orderCount: { $sum: 1 }
                    }
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 }
            ]),

            // Branch-wise performance
            Models.Order.aggregate([
                { $match: { status: { $ne: 'cancelled' }, branch: { $exists: true } } },
                {
                    $group: {
                        _id: "$branch",
                        orders: { $sum: 1 },
                        revenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { revenue: -1 } },
                {
                    $lookup: {
                        from: 'branches',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'branchInfo'
                    }
                },
                { $unwind: { path: "$branchInfo", preserveNullAndEmptyArrays: true } }
            ]),

            // Payment method breakdown
            Models.Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                {
                    $group: {
                        _id: "$paymentDetails.paymentMethod",
                        count: { $sum: 1 },
                        revenue: { $sum: "$totalPrice" }
                    }
                }
            ]),

            // Delivery stats
            Models.Order.aggregate([
                {
                    $group: {
                        _id: null,
                        delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                        inProgress: { $sum: { $cond: [{ $in: ["$status", ["accepted", "in-progress", "awaitconfirmation"]] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
                    }
                }
            ])
        ]);

        // Format order status data
        const orderStatusMap = {};
        ordersByStatus.forEach(item => {
            if (item._id) {
                orderStatusMap[item._id] = item.count;
            }
        });

        // Calculate growth percentage
        const thisMonthRev = monthlyRevenue[0]?.total || 0;
        const lastMonthRev = lastMonthRevenue[0]?.total || 0;
        const growthPercent = lastMonthRev > 0
            ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1)
            : 0;

        // Format payment stats
        const paymentStats = {
            online: 0,
            cod: 0,
            verified: 0,
            pending: 0
        };
        paymentMethodStats.forEach(p => {
            if (p._id === 'online') paymentStats.online = p.count;
            if (p._id === 'cod') paymentStats.cod = p.count;
        });

        // Add verified/pending counts from delivery stats
        const dStats = deliveryStats[0] || { delivered: 0, cancelled: 0, inProgress: 0, pending: 0 };
        paymentStats.verified = dStats.delivered;
        paymentStats.pending = dStats.pending + dStats.inProgress;

        res.json({
            success: true,
            data: {
                // Basic totals
                totals: {
                    orders: totalOrders,
                    customers: totalCustomers,
                    products: totalProducts,
                    branches: totalBranches,
                    revenue: thisMonthRev
                },

                // Today's performance
                today: {
                    orders: todaysOrders,
                    revenue: todaysRevenue[0]?.total || 0
                },

                // Revenue breakdown
                revenue: {
                    today: todaysRevenue[0]?.total || 0,
                    thisWeek: weeklyRevenue[0]?.total || 0,
                    thisMonth: thisMonthRev,
                    lastMonth: lastMonthRev,
                    growthPercent: parseFloat(growthPercent)
                },

                // Chart data
                charts: {
                    dailyRevenue: dailyRevenueData.map(d => ({
                        date: d._id,
                        revenue: d.revenue,
                        orders: d.orders
                    })),
                    weeklyRevenue: weeklyRevenueData.map(w => ({
                        week: w._id,
                        revenue: w.revenue,
                        orders: w.orders
                    }))
                },

                // Best selling products
                bestSellers: bestSellingProducts.map(p => ({
                    name: p._id || 'Unknown',
                    quantity: p.totalQuantity,
                    revenue: p.totalRevenue,
                    orders: p.orderCount
                })),

                // Branch performance
                branchPerformance: branchPerformance.map(b => ({
                    name: b.branchInfo?.name || 'Unknown Branch',
                    orders: b.orders,
                    revenue: b.revenue
                })),

                // Order status
                ordersByStatus: orderStatusMap,

                // Payment method stats
                payments: paymentStats,

                // Delivery stats
                deliveryStats: dStats,

                // Today's deliveries
                todaysDeliveries: todaysOrders,

                // Recent orders
                recentOrders: recentOrders.map(o => ({
                    id: o.orderId,
                    customer: o.customer?.name || 'N/A',
                    branch: o.branch?.name || 'N/A',
                    status: o.status,
                    amount: o.totalPrice,
                    date: o.createdAt
                }))
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
                    name: item.productName || 'Unknown',
                    count: item.quantity || 1,
                    display: `${item.productName || 'Unknown'} × ${item.quantity || 1}`
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

/**
 * Get sales analytics with custom date range
 */
export const getSalesAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        let dateFormat;
        switch (groupBy) {
            case 'week':
                dateFormat = "%Y-W%V";
                break;
            case 'month':
                dateFormat = "%Y-%m";
                break;
            default:
                dateFormat = "%Y-%m-%d";
        }

        const salesData = await Models.Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totals = await Models.Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: "$totalPrice" }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                period: { start, end, groupBy },
                totals: totals[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
                timeline: salesData
            }
        });
    } catch (error) {
        console.error("Sales Analytics Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch sales analytics" });
    }
};

