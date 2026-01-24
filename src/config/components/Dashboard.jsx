import React, { useState, useEffect } from 'react';

// Brand Colors
const BRAND = {
    primary: '#FF4700',
    primaryLight: '#FF6B33',
    primaryDark: '#CC3900',
    accent: '#4CAF50',
    accentBlue: '#2196F3',
    dark: '#1e2226',
    card: '#303641',
    cardHover: '#3a4149',
    border: '#454d5d',
    textPrimary: '#fff',
    textSecondary: '#9aa5b1',
    success: '#4CAF50',
    warning: '#FFC107',
    danger: '#f44336'
};

// CSS Keyframe animations injected via style tag
const injectStyles = () => {
    if (document.getElementById('dashboard-animations')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'dashboard-animations';
    styleEl.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        @keyframes barGrow {
            from { height: 0; }
        }
        .dashboard-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .dashboard-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 24px rgba(0,0,0,0.3) !important;
            border-color: ${BRAND.primary}40 !important;
        }
        .dashboard-btn {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .dashboard-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 20px ${BRAND.primary}40 !important;
        }
        .dashboard-btn:active {
            transform: translateY(0) !important;
        }
        .dashboard-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        .dashboard-btn:hover::after {
            width: 300px;
            height: 300px;
        }
        .dashboard-bar {
            animation: barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            transition: all 0.3s ease !important;
        }
        .dashboard-bar:hover {
            filter: brightness(1.2) !important;
            transform: scaleY(1.05);
            transform-origin: bottom;
        }
        .dashboard-row {
            transition: all 0.2s ease !important;
        }
        .dashboard-row:hover {
            background: ${BRAND.cardHover} !important;
        }
        .stat-value {
            animation: fadeInUp 0.5s ease-out;
        }
        .dashboard-badge {
            transition: all 0.2s ease !important;
        }
        .dashboard-badge:hover {
            transform: scale(1.1) !important;
        }
        .legend-item {
            transition: all 0.2s ease !important;
            padding: 8px;
            border-radius: 8px;
            margin: -8px;
        }
        .legend-item:hover {
            background: rgba(255,255,255,0.05) !important;
        }
        .growth-positive {
            color: ${BRAND.success} !important;
        }
        .growth-negative {
            color: ${BRAND.danger} !important;
        }
    `;
    document.head.appendChild(styleEl);
};

const styles = {
    dashboard: {
        padding: '28px',
        background: 'transparent',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: {
        marginBottom: '28px',
        animation: 'fadeInUp 0.6s ease-out'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        background: `linear-gradient(135deg, ${BRAND.textPrimary} 0%, ${BRAND.primary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    subtitle: {
        color: BRAND.textSecondary,
        fontSize: '13px',
        letterSpacing: '0.3px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    statCard: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
    },
    statCardHighlight: {
        background: `linear-gradient(145deg, ${BRAND.primary}20 0%, ${BRAND.primary}10 100%)`,
        border: `1px solid ${BRAND.primary}50`
    },
    statCardGlow: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle, ${BRAND.primary}20 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: BRAND.textPrimary,
        marginBottom: '4px',
        position: 'relative',
        zIndex: 1
    },
    statLabel: {
        color: BRAND.textSecondary,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '500'
    },
    statChange: {
        fontSize: '12px',
        fontWeight: '600',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: BRAND.textPrimary,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
    },
    chartCard: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    chartTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: BRAND.textPrimary,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${BRAND.border}`
    },
    chartContainer: {
        height: '140px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        justifyContent: 'space-around',
        marginTop: '16px',
        padding: '0 8px'
    },
    bar: {
        width: '50px',
        borderRadius: '6px 6px 0 0',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.2)'
    },
    barLabel: {
        color: BRAND.textSecondary,
        fontSize: '10px',
        textAlign: 'center',
        marginTop: '8px',
        fontWeight: '500'
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: `1px solid ${BRAND.border}30`
    },
    listRank: {
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: BRAND.primary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '700',
        marginRight: '12px'
    },
    listItemName: {
        flex: 1,
        color: BRAND.textPrimary,
        fontSize: '13px',
        fontWeight: '500'
    },
    listItemValue: {
        color: BRAND.primary,
        fontSize: '13px',
        fontWeight: '700'
    },
    tableCard: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        marginBottom: '20px',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0'
    },
    th: {
        textAlign: 'left',
        padding: '12px 14px',
        color: BRAND.textSecondary,
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: `2px solid ${BRAND.border}`,
        fontWeight: '600'
    },
    td: {
        padding: '14px',
        color: BRAND.textPrimary,
        fontSize: '13px',
        borderBottom: `1px solid ${BRAND.border}40`
    },
    statusBadge: {
        padding: '5px 10px',
        borderRadius: '16px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block'
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: BRAND.primary,
        fontSize: '18px',
        fontWeight: '500'
    },
    quickActions: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '24px'
    },
    actionBtn: {
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '12px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: `0 4px 14px ${BRAND.primary}50`
    },
    revenueGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '8px'
    },
    revenueItem: {
        textAlign: 'center',
        padding: '12px',
        background: `${BRAND.dark}80`,
        borderRadius: '10px'
    },
    revenueValue: {
        fontSize: '16px',
        fontWeight: '700',
        color: BRAND.textPrimary
    },
    revenueLabel: {
        fontSize: '10px',
        color: BRAND.textSecondary,
        textTransform: 'uppercase',
        marginTop: '4px'
    }
};

const STATUS_COLORS = {
    active: '#4CAF50',
    pending: '#FFC107',
    expired: '#f44336',
    cancelled: '#9e9e9e',
    delivered: '#4CAF50',
    confirmed: '#2196F3',
    preparing: '#FF9800',
    ready: '#00BCD4',
    accepted: '#2196F3',
    'in-progress': '#FF9800',
    'awaitconfirmation': '#9C27B0'
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        injectStyles();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/v1/admin/dashboard/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data || {});
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-IN').format(value || 0);
    };

    if (loading) {
        return React.createElement('div', { style: styles.loader },
            React.createElement('span', null, '⏳ Loading Dashboard...')
        );
    }

    if (error) {
        return React.createElement('div', { style: { ...styles.loader, color: '#f44336' } },
            `❌ Error: ${error}`
        );
    }

    if (!stats) {
        return React.createElement('div', { style: styles.loader }, 'No dashboard data available');
    }

    const totals = stats.totals || {};
    const today = stats.today || {};
    const revenue = stats.revenue || {};
    const charts = stats.charts || {};
    const bestSellers = stats.bestSellers || [];
    const branchPerformance = stats.branchPerformance || [];
    const ordersByStatus = stats.ordersByStatus || {};
    const payments = stats.payments || {};
    const recentOrders = stats.recentOrders || [];

    const dailyRevenue = charts.dailyRevenue || [];
    const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.revenue || 0), 1);

    const orderCounts = Object.values(ordersByStatus);
    const maxOrderCount = Math.max(...(orderCounts.length > 0 ? orderCounts : [1]), 1);

    return React.createElement('div', { style: styles.dashboard },
        // Header
        React.createElement('div', { style: styles.header },
            React.createElement('div', { style: styles.title }, '📊 Sales Analytics Dashboard'),
            React.createElement('div', { style: styles.subtitle },
                `Last updated: ${new Date().toLocaleString('en-IN')}`
            )
        ),

        // Quick Actions
        React.createElement('div', { style: styles.quickActions },
            React.createElement('a', {
                href: '/admin/pages/ordersByDate',
                style: styles.actionBtn,
                className: 'dashboard-btn'
            }, '📅 Orders by Date'),
            React.createElement('a', {
                href: '/api/v1/admin/export/orders',
                style: styles.actionBtn,
                className: 'dashboard-btn'
            }, '📥 Export CSV'),
            React.createElement('a', {
                href: '/admin/resources/1_AllOrders',
                style: { ...styles.actionBtn, background: `linear-gradient(135deg, ${BRAND.accentBlue} 0%, #1976D2 100%)` },
                className: 'dashboard-btn'
            }, '📋 All Orders')
        ),

        // Revenue Overview Section
        React.createElement('div', { style: { marginBottom: '24px' } },
            React.createElement('div', { style: styles.sectionTitle }, '💰 Revenue Overview'),
            React.createElement('div', { style: styles.statsGrid },
                // Today's Revenue
                React.createElement('div', { style: { ...styles.statCard, ...styles.statCardHighlight }, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statCardGlow }),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.today)),
                    React.createElement('div', { style: styles.statLabel }, "Today's Revenue")
                ),
                // This Week
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statCardGlow }),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.thisWeek)),
                    React.createElement('div', { style: styles.statLabel }, 'This Week')
                ),
                // This Month
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statCardGlow }),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.thisMonth)),
                    React.createElement('div', { style: styles.statLabel }, 'This Month'),
                    React.createElement('div', {
                        style: styles.statChange,
                        className: revenue.growthPercent >= 0 ? 'growth-positive' : 'growth-negative'
                    },
                        revenue.growthPercent >= 0 ? '↑' : '↓',
                        ` ${Math.abs(revenue.growthPercent)}% vs last month`
                    )
                ),
                // Today's Orders
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statCardGlow }),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, today.orders),
                    React.createElement('div', { style: styles.statLabel }, "Today's Orders")
                )
            )
        ),

        // Key Metrics
        React.createElement('div', { style: { marginBottom: '24px' } },
            React.createElement('div', { style: styles.sectionTitle }, '📈 Key Metrics'),
            React.createElement('div', { style: styles.statsGrid },
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatNumber(totals.orders)),
                    React.createElement('div', { style: styles.statLabel }, 'Total Orders')
                ),
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatNumber(totals.customers)),
                    React.createElement('div', { style: styles.statLabel }, 'Total Customers')
                ),
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatNumber(totals.products)),
                    React.createElement('div', { style: styles.statLabel }, 'Active Products')
                ),
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatNumber(totals.branches)),
                    React.createElement('div', { style: styles.statLabel }, 'Active Branches')
                ),
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, payments.verified),
                    React.createElement('div', { style: styles.statLabel }, 'Delivered Orders')
                ),
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card' },
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, payments.pending),
                    React.createElement('div', { style: styles.statLabel }, 'Pending/Active')
                )
            )
        ),

        // Charts Row
        React.createElement('div', { style: styles.chartsGrid },
            // Daily Revenue Chart
            React.createElement('div', { style: styles.chartCard, className: 'dashboard-card' },
                React.createElement('div', { style: styles.chartTitle }, '📊 Daily Revenue (Last 7 Days)'),
                React.createElement('div', { style: styles.chartContainer },
                    dailyRevenue.slice(-7).map((d, idx) =>
                        React.createElement('div', { key: d.date, style: { textAlign: 'center' } },
                            React.createElement('div', {
                                className: 'dashboard-bar',
                                style: {
                                    ...styles.bar,
                                    height: `${(d.revenue / maxDailyRevenue) * 110}px`,
                                    background: `linear-gradient(to top, ${BRAND.primary}, ${BRAND.primaryLight})`,
                                    minHeight: '20px'
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel },
                                new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })
                            ),
                            React.createElement('div', { style: { ...styles.barLabel, color: '#fff', fontWeight: '600' } },
                                `₹${(d.revenue / 1000).toFixed(0)}k`
                            )
                        )
                    )
                )
            ),

            // Order Status Chart
            React.createElement('div', { style: styles.chartCard, className: 'dashboard-card' },
                React.createElement('div', { style: styles.chartTitle }, '📈 Order Status'),
                React.createElement('div', { style: styles.chartContainer },
                    Object.entries(ordersByStatus).filter(([_, count]) => count > 0).slice(0, 6).map(([status, count]) =>
                        React.createElement('div', { key: status, style: { textAlign: 'center' } },
                            React.createElement('div', {
                                className: 'dashboard-bar',
                                style: {
                                    ...styles.bar,
                                    width: '45px',
                                    height: `${(count / maxOrderCount) * 110}px`,
                                    background: `linear-gradient(to top, ${STATUS_COLORS[status] || '#666'}, ${STATUS_COLORS[status] || '#666'}99)`,
                                    minHeight: '20px'
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel }, status.slice(0, 8)),
                            React.createElement('div', { style: { ...styles.barLabel, color: '#fff', fontWeight: '600' } }, count)
                        )
                    )
                )
            ),

            // Best Selling Products
            React.createElement('div', { style: styles.chartCard, className: 'dashboard-card' },
                React.createElement('div', { style: styles.chartTitle }, '🏆 Best Selling Products'),
                React.createElement('div', null,
                    bestSellers.slice(0, 5).map((product, idx) =>
                        React.createElement('div', { key: idx, style: styles.listItem },
                            React.createElement('div', { style: { ...styles.listRank, background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : BRAND.primary } }, idx + 1),
                            React.createElement('div', { style: styles.listItemName }, product.name.slice(0, 25) + (product.name.length > 25 ? '...' : '')),
                            React.createElement('div', { style: styles.listItemValue }, `${product.quantity} sold`)
                        )
                    )
                )
            ),

            // Branch Performance
            React.createElement('div', { style: styles.chartCard, className: 'dashboard-card' },
                React.createElement('div', { style: styles.chartTitle }, '🏢 Branch Performance'),
                React.createElement('div', null,
                    branchPerformance.slice(0, 5).map((branch, idx) =>
                        React.createElement('div', { key: idx, style: styles.listItem },
                            React.createElement('div', { style: { ...styles.listRank, background: BRAND.accentBlue } }, idx + 1),
                            React.createElement('div', { style: styles.listItemName }, branch.name),
                            React.createElement('div', { style: styles.listItemValue }, formatCurrency(branch.revenue))
                        )
                    )
                )
            ),

            // Payment Methods
            React.createElement('div', { style: styles.chartCard, className: 'dashboard-card' },
                React.createElement('div', { style: styles.chartTitle }, '💳 Payment Methods'),
                React.createElement('div', { style: { padding: '12px 0' } },
                    React.createElement('div', { style: styles.listItem },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                            React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#4CAF50' } }),
                            React.createElement('span', { style: { color: BRAND.textPrimary, fontSize: '13px' } }, 'Online Payments')
                        ),
                        React.createElement('span', { style: { color: BRAND.textPrimary, fontWeight: '600' } }, payments.online)
                    ),
                    React.createElement('div', { style: styles.listItem },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                            React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#FFC107' } }),
                            React.createElement('span', { style: { color: BRAND.textPrimary, fontSize: '13px' } }, 'Cash on Delivery')
                        ),
                        React.createElement('span', { style: { color: BRAND.textPrimary, fontWeight: '600' } }, payments.cod)
                    )
                )
            )
        ),

        // Recent Orders Table
        React.createElement('div', { style: styles.tableCard, className: 'dashboard-card' },
            React.createElement('div', { style: styles.chartTitle }, '🧾 Recent Orders'),
            React.createElement('table', { style: styles.table },
                React.createElement('thead', null,
                    React.createElement('tr', null,
                        React.createElement('th', { style: styles.th }, 'Order ID'),
                        React.createElement('th', { style: styles.th }, 'Customer'),
                        React.createElement('th', { style: styles.th }, 'Branch'),
                        React.createElement('th', { style: styles.th }, 'Status'),
                        React.createElement('th', { style: styles.th }, 'Amount')
                    )
                ),
                React.createElement('tbody', null,
                    recentOrders.map(order =>
                        React.createElement('tr', { key: order.id, className: 'dashboard-row' },
                            React.createElement('td', { style: { ...styles.td, fontWeight: '600', color: BRAND.primary } }, order.id),
                            React.createElement('td', { style: styles.td }, order.customer),
                            React.createElement('td', { style: styles.td }, order.branch),
                            React.createElement('td', { style: styles.td },
                                React.createElement('span', {
                                    className: 'dashboard-badge',
                                    style: {
                                        ...styles.statusBadge,
                                        background: `${STATUS_COLORS[order.status] || '#666'}20`,
                                        color: STATUS_COLORS[order.status] || '#fff',
                                        border: `1px solid ${STATUS_COLORS[order.status] || '#666'}50`
                                    }
                                }, order.status)
                            ),
                            React.createElement('td', { style: { ...styles.td, fontWeight: '600' } }, formatCurrency(order.amount))
                        )
                    )
                )
            )
        )
    );
};

export default Dashboard;
