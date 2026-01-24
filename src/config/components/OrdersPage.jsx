import React, { useState, useEffect } from 'react';

// Brand Colors
const BRAND = {
    primary: '#FF4700',
    primaryLight: '#FF6B33',
    primaryDark: '#CC3900',
    accent: '#4CAF50',
    card: '#303641',
    cardHover: '#3a4149',
    border: '#454d5d',
    textPrimary: '#fff',
    textSecondary: '#9aa5b1'
};

// CSS Keyframe animations
const injectStyles = () => {
    if (document.getElementById('orders-page-animations')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'orders-page-animations';
    styleEl.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .orders-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .orders-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 24px rgba(0,0,0,0.3) !important;
            border-color: ${BRAND.primary}40 !important;
        }
        .orders-btn {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .orders-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
        }
        .orders-btn:active {
            transform: translateY(0) !important;
        }
        .orders-row {
            transition: all 0.2s ease !important;
        }
        .orders-row:hover {
            background: ${BRAND.cardHover} !important;
        }
        .stat-card-filter {
            transition: all 0.3s ease !important;
        }
        .stat-card-filter:hover {
            transform: scale(1.02) !important;
            border-color: ${BRAND.primary}60 !important;
        }
        .stat-card-active {
            border-color: ${BRAND.primary} !important;
            box-shadow: 0 0 20px ${BRAND.primary}30 !important;
        }
        .orders-badge {
            transition: all 0.2s ease !important;
        }
        .orders-badge:hover {
            transform: scale(1.1) !important;
        }
    `;
    document.head.appendChild(styleEl);
};

const styles = {
    container: {
        padding: '28px',
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
        background: 'transparent',
        minHeight: '100vh'
    },
    header: {
        marginBottom: '24px',
        animation: 'fadeInUp 0.6s ease-out'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        background: `linear-gradient(135deg, ${BRAND.textPrimary} 0%, ${BRAND.primary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px'
    },
    subtitle: {
        color: BRAND.textSecondary,
        fontSize: '14px',
        letterSpacing: '0.3px'
    },
    controls: {
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    dateInput: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        border: `1px solid ${BRAND.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        color: BRAND.textPrimary,
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    btn: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        color: BRAND.textPrimary,
        border: `1px solid ${BRAND.border}`,
        padding: '10px 16px',
        borderRadius: '10px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '13px'
    },
    btnActive: {
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
        border: 'none',
        boxShadow: `0 4px 14px ${BRAND.primary}50`
    },
    btnPrimary: {
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
        border: 'none',
        boxShadow: `0 4px 14px ${BRAND.primary}50`
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
    },
    statCard: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        borderRadius: '14px',
        padding: '16px 20px',
        border: `1px solid ${BRAND.border}`,
        cursor: 'pointer',
        textAlign: 'center'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: BRAND.textPrimary,
        marginBottom: '4px'
    },
    statLabel: {
        color: BRAND.textSecondary,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '500'
    },
    tableCard: {
        background: `linear-gradient(145deg, ${BRAND.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        border: `1px solid ${BRAND.border}`,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0'
    },
    th: {
        textAlign: 'left',
        padding: '16px 18px',
        color: BRAND.textSecondary,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: `2px solid ${BRAND.border}`,
        fontWeight: '600',
        background: 'rgba(0,0,0,0.2)'
    },
    td: {
        padding: '16px 18px',
        color: BRAND.textPrimary,
        fontSize: '14px',
        borderBottom: `1px solid ${BRAND.border}40`,
        verticalAlign: 'middle'
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block'
    },
    itemTag: {
        display: 'inline-block',
        background: `${BRAND.border}80`,
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        marginRight: '6px',
        marginBottom: '6px',
        fontWeight: '500'
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        color: BRAND.primary,
        fontSize: '16px',
        fontWeight: '500'
    },
    noData: {
        textAlign: 'center',
        padding: '60px',
        color: BRAND.textSecondary,
        fontSize: '16px'
    },
    downloadLink: {
        background: `linear-gradient(135deg, ${BRAND.accent} 0%, #388E3C 100%)`,
        color: '#fff',
        textDecoration: 'none',
        padding: '12px 20px',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '13px',
        boxShadow: `0 4px 14px ${BRAND.accent}50`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
    },
    clearBtn: {
        background: 'transparent',
        color: BRAND.textSecondary,
        border: `1px solid ${BRAND.border}`,
        padding: '10px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500'
    }
};

const STATUS_COLORS = {
    pending: '#FFC107',
    accepted: '#2196F3',
    'in-progress': '#9C27B0',
    awaitconfirmation: '#FF9800',
    delivered: '#4CAF50',
    cancelled: '#9e9e9e',
    verified: '#4CAF50',
    failed: '#f44336'
};

const PAYMENT_COLORS = {
    cod: '#FF9800',
    online: '#4CAF50'
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount || 0);
};

const OrdersPage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');

    useEffect(() => {
        injectStyles();
        fetchOrders();
    }, [selectedDate, selectedFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = '/api/v1/admin/dashboard/orders?';
            if (selectedDate) url += `date=${selectedDate}&`;
            if (selectedFilter) url += `filter=${selectedFilter}`;

            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const setDateRelative = (offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const clearFilters = () => {
        setSelectedDate('');
        setSelectedFilter('');
    };

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === 'all') return 'All Time';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const filters = [
        { key: '', label: 'All', count: data?.summary?.total, icon: '📊' },
        { key: 'unassigned', label: 'Unassigned', count: data?.summary?.unassigned, icon: '⏳' },
        { key: 'cod', label: 'COD', count: data?.summary?.cod, icon: '💵' },
        { key: 'online', label: 'Online', count: data?.summary?.online, icon: '💳' },
        { key: 'paid', label: 'Paid', count: data?.summary?.paid, icon: '✅' },
        { key: 'pending', label: 'Pending', count: data?.summary?.pending, icon: '🔄' },
        { key: 'delivered', label: 'Delivered', count: data?.summary?.delivered, icon: '📦' }
    ];

    return React.createElement('div', { style: styles.container },
        // Header
        React.createElement('div', { style: styles.header },
            React.createElement('div', { style: styles.title }, '📅 Orders by Date'),
            React.createElement('div', { style: styles.subtitle }, formatDate(selectedDate))
        ),

        // Controls
        React.createElement('div', { style: styles.controls },
            React.createElement('input', {
                type: 'date',
                value: selectedDate,
                onChange: (e) => setSelectedDate(e.target.value),
                style: styles.dateInput,
                className: 'orders-btn',
                placeholder: 'Select date'
            }),
            React.createElement('button', {
                onClick: () => setDateRelative(0),
                style: { ...styles.btn, ...(isToday ? styles.btnActive : {}) },
                className: 'orders-btn'
            }, '📆 Today'),
            React.createElement('button', {
                onClick: () => setDateRelative(-1),
                style: styles.btn,
                className: 'orders-btn'
            }, 'Yesterday'),
            React.createElement('button', {
                onClick: () => setDateRelative(-7),
                style: styles.btn,
                className: 'orders-btn'
            }, 'Last Week'),
            React.createElement('button', {
                onClick: clearFilters,
                style: styles.clearBtn,
                className: 'orders-btn'
            }, '✕ Clear All'),
            React.createElement('a', {
                href: '/api/v1/admin/export/orders',
                style: styles.downloadLink,
                className: 'orders-btn'
            }, '📥 Download CSV')
        ),

        // Filter Stats
        data && React.createElement('div', { style: styles.statsRow },
            filters.map(f =>
                React.createElement('div', {
                    key: f.key,
                    style: styles.statCard,
                    className: `stat-card-filter ${selectedFilter === f.key ? 'stat-card-active' : ''}`,
                    onClick: () => setSelectedFilter(f.key)
                },
                    React.createElement('div', { style: styles.statValue }, f.count || 0),
                    React.createElement('div', { style: styles.statLabel }, `${f.icon} ${f.label}`)
                )
            )
        ),

        // Table or Loading
        loading ?
            React.createElement('div', { style: styles.loader }, '⏳ Loading orders...') :
            (!data || data.orders.length === 0) ?
                React.createElement('div', { style: styles.noData }, '📭 No orders found for this filter') :
                React.createElement('div', { style: styles.tableCard, className: 'orders-card' },
                    React.createElement('table', { style: styles.table },
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                React.createElement('th', { style: styles.th }, 'Order ID'),
                                React.createElement('th', { style: styles.th }, 'Customer'),
                                React.createElement('th', { style: styles.th }, 'Phone'),
                                React.createElement('th', { style: styles.th }, 'Address'),
                                React.createElement('th', { style: styles.th }, 'Partner'),
                                React.createElement('th', { style: styles.th }, 'Status'),
                                React.createElement('th', { style: styles.th }, 'Payment'),
                                React.createElement('th', { style: styles.th }, 'Amount'),
                                React.createElement('th', { style: styles.th }, 'Items')
                            )
                        ),
                        React.createElement('tbody', null,
                            data.orders.map((order, i) =>
                                React.createElement('tr', { key: i, className: 'orders-row' },
                                    React.createElement('td', { style: { ...styles.td, fontWeight: '600', color: BRAND.primary } }, order.orderId),
                                    React.createElement('td', { style: styles.td }, order.customerName),
                                    React.createElement('td', { style: styles.td }, order.phone),
                                    React.createElement('td', { style: { ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, order.address),
                                    React.createElement('td', { style: styles.td }, order.deliveryPartner || '—'),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', {
                                            style: {
                                                ...styles.statusBadge,
                                                background: `${STATUS_COLORS[order.status] || '#666'}20`,
                                                color: STATUS_COLORS[order.status] || '#fff',
                                                border: `1px solid ${STATUS_COLORS[order.status] || '#666'}50`
                                            },
                                            className: 'orders-badge'
                                        }, order.status)
                                    ),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
                                            React.createElement('span', {
                                                style: {
                                                    ...styles.statusBadge,
                                                    background: `${PAYMENT_COLORS[order.paymentMethod] || '#666'}20`,
                                                    color: PAYMENT_COLORS[order.paymentMethod] || '#fff',
                                                    border: `1px solid ${PAYMENT_COLORS[order.paymentMethod] || '#666'}50`
                                                },
                                                className: 'orders-badge'
                                            }, order.paymentMethod),
                                            React.createElement('span', {
                                                style: {
                                                    ...styles.statusBadge,
                                                    background: `${STATUS_COLORS[order.paymentStatus] || '#666'}20`,
                                                    color: STATUS_COLORS[order.paymentStatus] || '#fff',
                                                    border: `1px solid ${STATUS_COLORS[order.paymentStatus] || '#666'}50`
                                                },
                                                className: 'orders-badge'
                                            }, order.paymentStatus)
                                        )
                                    ),
                                    React.createElement('td', { style: { ...styles.td, fontWeight: '600' } }, formatCurrency(order.amount)),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', { style: { color: BRAND.primary, marginRight: '8px', fontWeight: '600' } }, `(${order.itemCount})`),
                                        order.items.slice(0, 3).map((item, j) =>
                                            React.createElement('span', { key: j, style: styles.itemTag }, item.display)
                                        ),
                                        order.items.length > 3 && React.createElement('span', { style: { ...styles.itemTag, background: BRAND.primary + '30', color: BRAND.primary } }, `+${order.items.length - 3}`)
                                    )
                                )
                            )
                        )
                    )
                )
    );
};

export default OrdersPage;
