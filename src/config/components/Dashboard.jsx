import React, { useState, useEffect } from 'react';

// Styled container and card components using inline styles for AdminJS compatibility
// Colors match AdminJS dark theme: background #1e2226, cards #303641, accent #F5C518
const styles = {
    dashboard: {
        padding: '24px',
        background: 'transparent', // Inherit from AdminJS
        minHeight: '100vh',
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: {
        marginBottom: '24px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '500',
        color: '#fff',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    subtitle: {
        color: '#9aa5b1',
        fontSize: '13px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    statCard: {
        background: '#303641',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #454d5d'
    },
    statIcon: {
        fontSize: '20px',
        marginBottom: '10px'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '4px'
    },
    statLabel: {
        color: '#9aa5b1',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    chartCard: {
        background: '#303641',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #454d5d'
    },
    chartTitle: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#fff',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    chartContainer: {
        height: '140px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        justifyContent: 'space-around',
        marginTop: '20px'
    },
    bar: {
        width: '50px',
        borderRadius: '4px 4px 0 0',
        transition: 'height 0.3s ease'
    },
    barLabel: {
        color: '#9aa5b1',
        fontSize: '11px',
        textAlign: 'center',
        marginTop: '8px'
    },
    pieContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '180px'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
    },
    legendDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%'
    },
    legendText: {
        color: '#fff',
        fontSize: '13px'
    },
    legendValue: {
        color: '#9aa5b1',
        fontSize: '13px',
        marginLeft: 'auto',
        fontWeight: '500'
    },
    tableCard: {
        background: '#303641',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #454d5d',
        marginBottom: '16px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '10px 12px',
        color: '#9aa5b1',
        fontSize: '11px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #454d5d',
        fontWeight: '500'
    },
    td: {
        padding: '10px 12px',
        color: '#fff',
        fontSize: '13px',
        borderBottom: '1px solid #3a4149'
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#fff',
        fontSize: '16px'
    },
    quickActions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px'
    },
    actionBtn: {
        background: '#3795BD',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '12px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
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
    ready: '#00BCD4'
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/v1/admin/dashboard/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return React.createElement('div', { style: styles.loader },
            'Loading Dashboard...'
        );
    }

    if (error) {
        return React.createElement('div', { style: { ...styles.loader, color: '#f44336' } },
            `Error: ${error}`
        );
    }

    const { totals, ordersByStatus, subscriptionsByStatus, payments, todaysDeliveries, recentOrders, recentSubscriptions } = stats;

    // Calculate max for bar chart scaling
    const maxSubscriptionCount = Math.max(...Object.values(subscriptionsByStatus), 1);
    const maxOrderCount = Math.max(...Object.values(ordersByStatus), 1);

    return React.createElement('div', { style: styles.dashboard },
        // Header
        React.createElement('div', { style: styles.header },
            React.createElement('div', { style: styles.title }, 'Dashboard'),
            React.createElement('div', { style: styles.subtitle },
                `Last updated: ${new Date().toLocaleString('en-IN')}`
            )
        ),

        // Quick Actions
        React.createElement('div', { style: styles.quickActions },
            React.createElement('a', {
                href: '/api/v1/admin/reports/deliveries-by-date',
                style: styles.actionBtn
            }, 'Deliveries by Date'),
            React.createElement('a', {
                href: '/api/v1/admin/export/subscriptions',
                style: styles.actionBtn
            }, 'Export Subscriptions'),
            React.createElement('a', {
                href: '/api/v1/admin/export/orders',
                style: styles.actionBtn
            }, 'Export Orders')
        ),

        // Stat Cards
        React.createElement('div', { style: styles.statsGrid },
            // Orders
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, totals.orders),
                React.createElement('div', { style: styles.statLabel }, 'Total Orders')
            ),
            // Subscriptions
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, totals.subscriptions),
                React.createElement('div', { style: styles.statLabel }, 'Total Subscriptions')
            ),
            // Customers
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, totals.customers),
                React.createElement('div', { style: styles.statLabel }, 'Customers')
            ),
            // Revenue
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, formatCurrency(totals.revenue)),
                React.createElement('div', { style: styles.statLabel }, 'Total Revenue')
            ),
            // Today's Deliveries
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, todaysDeliveries),
                React.createElement('div', { style: styles.statLabel }, "Today's Deliveries")
            ),
            // Payment Status
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, payments.verified),
                React.createElement('div', { style: styles.statLabel }, 'Verified Payments')
            )
        ),

        // Charts Grid
        React.createElement('div', { style: styles.chartsGrid },
            // Subscription Status Chart
            React.createElement('div', { style: styles.chartCard },
                React.createElement('div', { style: styles.chartTitle }, 'Subscription Status'),
                React.createElement('div', { style: styles.chartContainer },
                    Object.entries(subscriptionsByStatus).map(([status, count]) =>
                        React.createElement('div', { key: status, style: { textAlign: 'center' } },
                            React.createElement('div', {
                                style: {
                                    ...styles.bar,
                                    height: `${(count / maxSubscriptionCount) * 100}px`,
                                    background: STATUS_COLORS[status] || '#666',
                                    minHeight: '10px'
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel }, status),
                            React.createElement('div', { style: { ...styles.barLabel, color: '#fff' } }, count)
                        )
                    )
                )
            ),

            // Order Status Chart
            React.createElement('div', { style: styles.chartCard },
                React.createElement('div', { style: styles.chartTitle }, 'Order Status'),
                React.createElement('div', { style: styles.chartContainer },
                    Object.entries(ordersByStatus).filter(([_, count]) => count > 0).map(([status, count]) =>
                        React.createElement('div', { key: status, style: { textAlign: 'center' } },
                            React.createElement('div', {
                                style: {
                                    ...styles.bar,
                                    height: `${(count / maxOrderCount) * 100}px`,
                                    background: STATUS_COLORS[status] || '#666',
                                    minHeight: '10px'
                                }
                            }),
                            React.createElement('div', { style: styles.barLabel }, status),
                            React.createElement('div', { style: { ...styles.barLabel, color: '#fff' } }, count)
                        )
                    )
                )
            ),

            // Payment Methods
            React.createElement('div', { style: styles.chartCard },
                React.createElement('div', { style: styles.chartTitle }, 'Payment Methods'),
                React.createElement('div', { style: { padding: '20px' } },
                    React.createElement('div', { style: styles.legendItem },
                        React.createElement('div', { style: { ...styles.legendDot, background: '#4CAF50' } }),
                        React.createElement('span', { style: styles.legendText }, 'Online'),
                        React.createElement('span', { style: styles.legendValue }, payments.online)
                    ),
                    React.createElement('div', { style: styles.legendItem },
                        React.createElement('div', { style: { ...styles.legendDot, background: '#FFC107' } }),
                        React.createElement('span', { style: styles.legendText }, 'COD'),
                        React.createElement('span', { style: styles.legendValue }, payments.cod)
                    ),
                    React.createElement('div', { style: { ...styles.legendItem, marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' } },
                        React.createElement('div', { style: { ...styles.legendDot, background: '#4CAF50' } }),
                        React.createElement('span', { style: styles.legendText }, 'Verified'),
                        React.createElement('span', { style: styles.legendValue }, payments.verified)
                    ),
                    React.createElement('div', { style: styles.legendItem },
                        React.createElement('div', { style: { ...styles.legendDot, background: '#f44336' } }),
                        React.createElement('span', { style: styles.legendText }, 'Pending'),
                        React.createElement('span', { style: styles.legendValue }, payments.pending)
                    )
                )
            )
        ),

        // Recent Tables
        React.createElement('div', { style: styles.chartsGrid },
            // Recent Orders
            React.createElement('div', { style: styles.tableCard },
                React.createElement('div', { style: styles.chartTitle }, 'Recent Orders'),
                React.createElement('table', { style: styles.table },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            React.createElement('th', { style: styles.th }, 'Order ID'),
                            React.createElement('th', { style: styles.th }, 'Customer'),
                            React.createElement('th', { style: styles.th }, 'Status'),
                            React.createElement('th', { style: styles.th }, 'Amount')
                        )
                    ),
                    React.createElement('tbody', null,
                        recentOrders.map(order =>
                            React.createElement('tr', { key: order.id },
                                React.createElement('td', { style: styles.td }, order.id),
                                React.createElement('td', { style: styles.td }, order.customer),
                                React.createElement('td', { style: styles.td },
                                    React.createElement('span', {
                                        style: {
                                            ...styles.statusBadge,
                                            background: STATUS_COLORS[order.status] || '#666',
                                            color: '#fff'
                                        }
                                    }, order.status)
                                ),
                                React.createElement('td', { style: styles.td }, formatCurrency(order.amount))
                            )
                        )
                    )
                )
            ),

            // Recent Subscriptions
            React.createElement('div', { style: styles.tableCard },
                React.createElement('div', { style: styles.chartTitle }, 'Recent Subscriptions'),
                React.createElement('table', { style: styles.table },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            React.createElement('th', { style: styles.th }, 'Sub ID'),
                            React.createElement('th', { style: styles.th }, 'Customer'),
                            React.createElement('th', { style: styles.th }, 'Status'),
                            React.createElement('th', { style: styles.th }, 'Bill')
                        )
                    ),
                    React.createElement('tbody', null,
                        recentSubscriptions.map(sub =>
                            React.createElement('tr', { key: sub.id },
                                React.createElement('td', { style: styles.td }, sub.id),
                                React.createElement('td', { style: styles.td }, sub.customer),
                                React.createElement('td', { style: styles.td },
                                    React.createElement('span', {
                                        style: {
                                            ...styles.statusBadge,
                                            background: STATUS_COLORS[sub.status] || '#666',
                                            color: '#fff'
                                        }
                                    }, sub.status)
                                ),
                                React.createElement('td', { style: styles.td }, formatCurrency(sub.amount))
                            )
                        )
                    )
                )
            )
        )
    );
};

export default Dashboard;
