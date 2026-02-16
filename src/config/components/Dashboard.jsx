import React, { useState, useEffect } from 'react';

// Brand Colors - Re-imagined for a Premium, Modern look
const BRAND = {
    primary: '#FF4700',      // Intense TakeSmart Orange
    primaryLight: '#FF7D4D',
    primaryDark: '#D93D00',
    secondary: '#0F172A',    // Deep Slate
    accent: '#10B981',       // Emerald
    info: '#3B82F6',         // Blue
    warning: '#F59E0B',      // Amber
    danger: '#EF4444',       // Red
    surface: '#FFFFFF',      // Pure White Card
    background: '#F1F5F9',   // Slightly darker Slate 100 for better contrast
    textPrimary: '#1E293B',  // Slate 800
    textSecondary: '#64748B',// Slate 500
    border: '#CBD5E1',       // Slate 300 - more visible
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
};

// CSS Keyframe animations injected via style tag
const injectStyles = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('dashboard-animations')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'dashboard-animations';
    styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-subtle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px ${BRAND.primary}40; }
            50% { box-shadow: 0 0 40px ${BRAND.primary}80; }
        }
        .highlight-card {
            animation: glow 3s infinite ease-in-out;
            border: 2px solid ${BRAND.primary} !important;
        }
        .dashboard-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            border: 1px solid ${BRAND.border} !important;
            background: #ffffff !important;
            box-shadow: ${BRAND.cardShadow} !important;
        }
        .dashboard-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
            border-color: ${BRAND.primary}50 !important;
            z-index: 10;
        }
        .dashboard-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            border-radius: 14px !important;
            position: relative;
            overflow: hidden;
            border: 2px solid transparent !important;
        }
        .dashboard-btn:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 15px 30px -5px ${BRAND.primary}60 !important;
            filter: brightness(1.2);
        }
        .dashboard-btn:active {
            transform: translateY(-1px) scale(0.98) !important;
        }
        .dashboard-btn-secondary:hover {
            box-shadow: 0 15px 30px -5px ${BRAND.secondary}60 !important;
        }
        .dashboard-btn-info:hover {
            box-shadow: 0 15px 30px -5px ${BRAND.info}60 !important;
        }
        .dashboard-bar {
            border-radius: 10px 10px 4px 4px !important;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            cursor: pointer;
        }
        .dashboard-bar:hover {
            filter: saturate(1.8) !important;
            transform: scaleY(1.1) translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .dashboard-row {
            transition: all 0.2s ease !important;
        }
        .dashboard-row:hover {
            background: ${BRAND.background} !important;
        }
        .stat-value {
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-border {
            position: relative;
        }
        .premium-border::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: ${BRAND.primary};
            transition: width 0.3s ease, left 0.3s ease;
        }
        .dashboard-card:hover.premium-border::after {
            width: 80%;
            left: 10%;
        }
    `;
    document.head.appendChild(styleEl);
};

const styles = {
    dashboard: {
        padding: '32px',
        background: BRAND.background,
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        color: BRAND.textPrimary
    },
    header: {
        marginBottom: '32px',
        animation: 'fadeInUp 0.8s ease-out',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: BRAND.secondary,
        letterSpacing: '-0.5px',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    subtitle: {
        color: BRAND.textSecondary,
        fontSize: '14px',
        fontWeight: '500'
    },
    quickActions: {
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        marginBottom: '32px'
    },
    actionBtn: {
        background: BRAND.primary,
        color: '#fff',
        border: 'none',
        padding: '14px 28px',
        borderRadius: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '15px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: `0 8px 16px ${BRAND.primary}30`
    },
    actionBtnSecondary: {
        background: BRAND.secondary,
        boxShadow: `0 4px 12px ${BRAND.secondary}30`
    },
    actionBtnInfo: {
        background: BRAND.info,
        boxShadow: `0 4px 12px ${BRAND.info}30`
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: BRAND.secondary,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
    },
    statCard: {
        background: BRAND.surface,
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: BRAND.cardShadow,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    statCardHighlight: {
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
        color: '#FFFFFF'
    },
    statValue: {
        fontSize: '30px',
        fontWeight: '800',
        marginBottom: '6px',
        letterSpacing: '-1px'
    },
    statLabel: {
        fontSize: '13px',
        fontWeight: '600',
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    statIcon: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontSize: '24px',
        opacity: 0.2
    },
    statChange: {
        fontSize: '13px',
        fontWeight: '700',
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '8px',
        width: 'fit-content'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    chartCard: {
        background: BRAND.surface,
        borderRadius: '24px',
        padding: '28px',
        boxShadow: BRAND.cardShadow,
        border: `1px solid ${BRAND.border}`
    },
    chartTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: BRAND.secondary,
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    chartContainer: {
        height: '180px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        justifyContent: 'space-around',
        marginTop: '16px'
    },
    bar: {
        width: '100%',
        maxWidth: '60px',
        minWidth: '35px',
        borderRadius: '12px 12px 4px 4px',
        position: 'relative',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    barLabel: {
        color: BRAND.textSecondary,
        fontSize: '12px',
        textAlign: 'center',
        marginTop: '12px',
        fontWeight: '700'
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: `1px solid ${BRAND.border}`
    },
    listRank: {
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: `${BRAND.primary}15`,
        color: BRAND.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        marginRight: '14px'
    },
    listItemName: {
        flex: 1,
        color: BRAND.textPrimary,
        fontSize: '14px',
        fontWeight: '600'
    },
    listItemValue: {
        color: BRAND.primary,
        fontSize: '14px',
        fontWeight: '700'
    },
    tableCard: {
        background: BRAND.surface,
        borderRadius: '24px',
        padding: '28px',
        boxShadow: BRAND.cardShadow,
        border: `1px solid ${BRAND.border}`,
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 8px'
    },
    th: {
        textAlign: 'left',
        padding: '12px 16px',
        color: BRAND.textSecondary,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '700'
    },
    td: {
        padding: '20px 16px',
        color: BRAND.textPrimary,
        fontSize: '14px',
        background: '#fff',
        borderTop: `1px solid ${BRAND.border}50`,
        borderBottom: `1px solid ${BRAND.border}50`,
        transition: 'all 0.2s ease'
    },
    tdFirst: {
        borderLeft: `1px solid ${BRAND.border}`,
        borderRadius: '12px 0 0 12px'
    },
    tdLast: {
        borderRight: `1px solid ${BRAND.border}`,
        borderRadius: '0 12px 12px 0'
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
    },
    loader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: BRAND.background,
        color: BRAND.primary,
        gap: '16px'
    },
    loaderSpinner: {
        width: '40px',
        height: '40px',
        border: `4px solid ${BRAND.primary}20`,
        borderTop: `4px solid ${BRAND.primary}`,
        borderRadius: '50%',
        animation: 'pulse-subtle 1.5s infinite ease-in-out'
    }
};

const STATUS_COLORS = {
    active: BRAND.accent,
    pending: BRAND.warning,
    expired: BRAND.danger,
    cancelled: BRAND.textSecondary,
    delivered: BRAND.accent,
    confirmed: BRAND.info,
    preparing: BRAND.warning,
    ready: '#0ea5e9',
    accepted: BRAND.info,
    'in-progress': BRAND.warning,
    'awaitconfirmation': '#8b5cf6'
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
                style: { ...styles.actionBtn, ...styles.actionBtnSecondary },
                className: 'dashboard-btn dashboard-btn-secondary'
            }, '📥 Export CSV'),
            React.createElement('a', {
                href: '/admin/resources/1_AllOrders',
                style: { ...styles.actionBtn, ...styles.actionBtnInfo },
                className: 'dashboard-btn dashboard-btn-info'
            }, '📋 All Orders')
        ),

        // Revenue Overview Section
        React.createElement('div', { style: { marginBottom: '32px' } },
            React.createElement('div', { style: styles.sectionTitle },
                React.createElement('span', null, '💰'),
                'Revenue Overview'
            ),
            React.createElement('div', { style: styles.statsGrid },
                // Today's Revenue
                React.createElement('div', { style: { ...styles.statCard, ...styles.statCardHighlight }, className: 'dashboard-card highlight-card' },
                    React.createElement('div', { style: styles.statIcon }, '💰'),
                    React.createElement('div', null,
                        React.createElement('div', { style: styles.statLabel }, "Today's Revenue"),
                        React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.today))
                    )
                ),
                // This Week
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card premium-border' },
                    React.createElement('div', { style: styles.statIcon }, '📅'),
                    React.createElement('div', { style: styles.statLabel }, 'This Week'),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.thisWeek))
                ),
                // This Month
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card premium-border' },
                    React.createElement('div', { style: styles.statIcon }, '📈'),
                    React.createElement('div', { style: styles.statLabel }, 'This Month'),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, formatCurrency(revenue.thisMonth)),
                    React.createElement('div', {
                        style: {
                            ...styles.statChange,
                            background: revenue.growthPercent >= 0 ? `${BRAND.accent}15` : `${BRAND.danger}15`,
                            color: revenue.growthPercent >= 0 ? BRAND.accent : BRAND.danger
                        }
                    },
                        revenue.growthPercent >= 0 ? '↗' : '↘',
                        ` ${Math.abs(revenue.growthPercent)}%`
                    )
                ),
                // Today's Orders
                React.createElement('div', { style: styles.statCard, className: 'dashboard-card premium-border' },
                    React.createElement('div', { style: styles.statIcon }, '📦'),
                    React.createElement('div', { style: styles.statLabel }, "Today's Orders"),
                    React.createElement('div', { style: styles.statValue, className: 'stat-value' }, today.orders)
                )
            )
        ),

        // Key Metrics
        React.createElement('div', { style: { marginBottom: '32px' } },
            React.createElement('div', { style: styles.sectionTitle },
                React.createElement('span', null, '📊'),
                'Key Metrics'
            ),
            React.createElement('div', { style: styles.statsGrid },
                [
                    { label: 'Total Orders', value: formatNumber(totals.orders), icon: '📝' },
                    { label: 'Total Customers', value: formatNumber(totals.customers), icon: '👥' },
                    { label: 'Active Products', value: formatNumber(totals.products), icon: '🏷️' },
                    { label: 'Active Branches', value: formatNumber(totals.branches), icon: '🏢' },
                    { label: 'Delivered Orders', value: payments.verified, icon: '✅' },
                    { label: 'Pending/Active', value: payments.pending, icon: '⏳' }
                ].map((item, idx) =>
                    React.createElement('div', { key: idx, style: styles.statCard, className: 'dashboard-card premium-border' },
                        React.createElement('div', { style: styles.statIcon }, item.icon),
                        React.createElement('div', null,
                            React.createElement('div', { style: styles.statLabel }, item.label),
                            React.createElement('div', { style: styles.statValue, className: 'stat-value' }, item.value)
                        )
                    )
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
                        React.createElement('div', { key: d.date, style: { textAlign: 'center', flex: 1 } },
                            React.createElement('div', {
                                className: 'dashboard-bar',
                                style: {
                                    ...styles.bar,
                                    height: `${(d.revenue / maxDailyRevenue) * 120}px`,
                                    background: `linear-gradient(to top, ${BRAND.primary}, ${BRAND.primaryLight})`,
                                    margin: '0 auto',
                                    minHeight: '4px'
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel },
                                new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })
                            ),
                            React.createElement('div', { style: { ...styles.barLabel, color: BRAND.textPrimary, fontWeight: '700', marginTop: '4px' } },
                                `₹${(d.revenue / 1000).toFixed(1)}k`
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
                        React.createElement('div', { key: status, style: { textAlign: 'center', flex: 1 } },
                            React.createElement('div', {
                                className: 'dashboard-bar',
                                style: {
                                    ...styles.bar,
                                    height: `${(count / maxOrderCount) * 120}px`,
                                    background: STATUS_COLORS[status] || BRAND.secondary,
                                    margin: '0 auto',
                                    minHeight: '4px',
                                    opacity: 0.9
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel }, status.charAt(0).toUpperCase() + status.slice(1, 8)),
                            React.createElement('div', { style: { ...styles.barLabel, color: BRAND.textPrimary, fontWeight: '700', marginTop: '4px' } }, count)
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
                            React.createElement('div', {
                                style: {
                                    ...styles.listRank,
                                    background: idx === 0 ? '#FBBF24' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : `${BRAND.primary}15`,
                                    color: idx <= 2 ? '#fff' : BRAND.primary
                                }
                            }, idx + 1),
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
                            React.createElement('div', { style: { ...styles.listRank, background: `${BRAND.info}15`, color: BRAND.info } }, idx + 1),
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
                            React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: BRAND.accent } }),
                            React.createElement('span', { style: { color: BRAND.textPrimary, fontSize: '13px', fontWeight: '500' } }, 'Online Payments')
                        ),
                        React.createElement('span', { style: { color: BRAND.textPrimary, fontWeight: '700' } }, payments.online)
                    ),
                    React.createElement('div', { style: styles.listItem },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                            React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: BRAND.warning } }),
                            React.createElement('span', { style: { color: BRAND.textPrimary, fontSize: '13px', fontWeight: '500' } }, 'Cash on Delivery')
                        ),
                        React.createElement('span', { style: { color: BRAND.textPrimary, fontWeight: '700' } }, payments.cod)
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
                            React.createElement('td', { style: { ...styles.td, ...styles.tdFirst, fontWeight: '700', color: BRAND.primary } }, order.id),
                            React.createElement('td', { style: styles.td }, order.customer),
                            React.createElement('td', { style: styles.td }, order.branch),
                            React.createElement('td', { style: styles.td },
                                React.createElement('span', {
                                    className: 'dashboard-badge',
                                    style: {
                                        ...styles.statusBadge,
                                        background: `${STATUS_COLORS[order.status] || BRAND.secondary}15`,
                                        color: STATUS_COLORS[order.status] || BRAND.textPrimary,
                                    }
                                }, order.status)
                            ),
                            React.createElement('td', { style: { ...styles.td, ...styles.tdLast, fontWeight: '700' } }, formatCurrency(order.amount))
                        )
                    )
                )
            )
        )
    );
};

export default Dashboard;
