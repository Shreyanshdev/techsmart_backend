import React, { useState, useEffect } from 'react';

// Styles matching AdminJS dark theme
const styles = {
    container: {
        padding: '24px',
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: {
        marginBottom: '20px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '500',
        color: '#fff',
        marginBottom: '8px'
    },
    subtitle: {
        color: '#9aa5b1',
        fontSize: '13px'
    },
    controls: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    dateInput: {
        background: '#303641',
        border: '1px solid #454d5d',
        borderRadius: '6px',
        padding: '10px 14px',
        color: '#fff',
        fontSize: '14px'
    },
    btn: {
        background: '#454d5d',
        color: '#fff',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '12px'
    },
    btnActive: {
        background: '#3795BD'
    },
    btnPrimary: {
        background: '#3795BD'
    },
    statsRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    statCard: {
        background: '#303641',
        borderRadius: '8px',
        padding: '12px 20px',
        border: '1px solid #454d5d',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
    },
    statCardActive: {
        borderColor: '#3795BD'
    },
    statValue: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#fff'
    },
    statLabel: {
        color: '#9aa5b1',
        fontSize: '11px',
        textTransform: 'uppercase'
    },
    tableCard: {
        background: '#303641',
        borderRadius: '8px',
        border: '1px solid #454d5d',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '14px 16px',
        color: '#9aa5b1',
        fontSize: '12px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #454d5d',
        fontWeight: '600',
        background: '#282d36'
    },
    td: {
        padding: '14px 16px',
        color: '#fff',
        fontSize: '14px',
        borderBottom: '1px solid #3a4149',
        verticalAlign: 'top'
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    itemTag: {
        display: 'inline-block',
        background: '#454d5d',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        marginRight: '6px',
        marginBottom: '6px'
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#9aa5b1',
        fontSize: '14px'
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#9aa5b1'
    },
    downloadLink: {
        background: '#4CAF50',
        color: '#fff',
        textDecoration: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '13px'
    },
    clearBtn: {
        background: 'transparent',
        color: '#9aa5b1',
        border: '1px solid #454d5d',
        padding: '8px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px'
    }
};

const STATUS_COLORS = {
    pending: '#FFC107',
    accepted: '#3795BD',
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
        { key: '', label: 'All', count: data?.summary?.total },
        { key: 'unassigned', label: 'Unassigned', count: data?.summary?.unassigned },
        { key: 'cod', label: 'COD', count: data?.summary?.cod },
        { key: 'online', label: 'Online', count: data?.summary?.online },
        { key: 'paid', label: 'Paid', count: data?.summary?.paid },
        { key: 'pending', label: 'Pending', count: data?.summary?.pending },
        { key: 'delivered', label: 'Delivered', count: data?.summary?.delivered }
    ];

    return React.createElement('div', { style: styles.container },
        // Header
        React.createElement('div', { style: styles.header },
            React.createElement('div', { style: styles.title }, 'Orders by Date'),
            React.createElement('div', { style: styles.subtitle }, formatDate(selectedDate))
        ),

        // Controls
        React.createElement('div', { style: styles.controls },
            React.createElement('input', {
                type: 'date',
                value: selectedDate,
                onChange: (e) => setSelectedDate(e.target.value),
                style: styles.dateInput,
                placeholder: 'Select date'
            }),
            React.createElement('button', {
                onClick: () => setDateRelative(0),
                style: { ...styles.btn, ...(isToday ? styles.btnActive : {}) }
            }, 'Today'),
            React.createElement('button', {
                onClick: () => setDateRelative(-1),
                style: styles.btn
            }, 'Yesterday'),
            React.createElement('button', {
                onClick: () => setDateRelative(-7),
                style: styles.btn
            }, 'Last Week'),
            React.createElement('button', {
                onClick: clearFilters,
                style: styles.clearBtn
            }, 'Clear All'),
            React.createElement('a', {
                href: '/api/v1/admin/export/orders',
                style: styles.downloadLink
            }, 'Download CSV')
        ),

        // Filter Stats
        data && React.createElement('div', { style: styles.statsRow },
            filters.map(f =>
                React.createElement('div', {
                    key: f.key,
                    style: {
                        ...styles.statCard,
                        ...(selectedFilter === f.key ? styles.statCardActive : {})
                    },
                    onClick: () => setSelectedFilter(f.key)
                },
                    React.createElement('div', { style: styles.statValue }, f.count || 0),
                    React.createElement('div', { style: styles.statLabel }, f.label)
                )
            )
        ),

        // Table or Loading
        loading ?
            React.createElement('div', { style: styles.loader }, 'Loading orders...') :
            (!data || data.orders.length === 0) ?
                React.createElement('div', { style: styles.noData }, 'No orders found') :
                React.createElement('div', { style: styles.tableCard },
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
                                React.createElement('tr', { key: i },
                                    React.createElement('td', { style: { ...styles.td, fontWeight: '600' } }, order.orderId),
                                    React.createElement('td', { style: styles.td }, order.customerName),
                                    React.createElement('td', { style: styles.td }, order.phone),
                                    React.createElement('td', { style: styles.td }, order.address),
                                    React.createElement('td', { style: styles.td }, order.deliveryPartner),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', {
                                            style: {
                                                ...styles.statusBadge,
                                                background: STATUS_COLORS[order.status] || '#666',
                                                color: '#fff'
                                            }
                                        }, order.status)
                                    ),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('div', null,
                                            React.createElement('span', {
                                                style: {
                                                    ...styles.statusBadge,
                                                    background: PAYMENT_COLORS[order.paymentMethod] || '#666',
                                                    color: '#fff',
                                                    marginRight: '6px'
                                                }
                                            }, order.paymentMethod),
                                            React.createElement('span', {
                                                style: {
                                                    ...styles.statusBadge,
                                                    background: STATUS_COLORS[order.paymentStatus] || '#666',
                                                    color: '#fff'
                                                }
                                            }, order.paymentStatus)
                                        )
                                    ),
                                    React.createElement('td', { style: { ...styles.td, fontWeight: '600' } }, formatCurrency(order.amount)),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', { style: { color: '#9aa5b1', marginRight: '8px' } }, `(${order.itemCount})`),
                                        order.items.map((item, j) =>
                                            React.createElement('span', { key: j, style: styles.itemTag }, item.display)
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
    );
};

export default OrdersPage;
