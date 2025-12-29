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
        background: '#3795BD',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '13px'
    },
    btnActive: {
        background: '#2d7a9e'
    },
    btnSecondary: {
        background: '#454d5d'
    },
    statsRow: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px'
    },
    statCard: {
        background: '#303641',
        borderRadius: '8px',
        padding: '16px 24px',
        border: '1px solid #454d5d'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#fff'
    },
    statLabel: {
        color: '#9aa5b1',
        fontSize: '12px',
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
    }
};

const STATUS_COLORS = {
    scheduled: '#3795BD',
    delivered: '#4CAF50',
    missed: '#f44336',
    cancelled: '#9e9e9e'
};

const DeliveriesPage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDeliveries(selectedDate);
    }, [selectedDate]);

    const fetchDeliveries = async (date) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/admin/dashboard/deliveries?date=${date}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch deliveries:', err);
        } finally {
            setLoading(false);
        }
    };

    const goToRelative = (offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = selectedDate === tomorrow.toISOString().split('T')[0];

    return React.createElement('div', { style: styles.container },
        // Header
        React.createElement('div', { style: styles.header },
            React.createElement('div', { style: styles.title }, 'Deliveries by Date'),
            React.createElement('div', { style: styles.subtitle }, formatDate(selectedDate))
        ),

        // Controls
        React.createElement('div', { style: styles.controls },
            React.createElement('input', {
                type: 'date',
                value: selectedDate,
                onChange: (e) => setSelectedDate(e.target.value),
                style: styles.dateInput
            }),
            React.createElement('button', {
                onClick: () => goToRelative(-1),
                style: styles.btn
            }, 'Yesterday'),
            React.createElement('button', {
                onClick: () => goToRelative(0),
                style: { ...styles.btn, ...(isToday ? styles.btnActive : {}) }
            }, 'Today'),
            React.createElement('button', {
                onClick: () => goToRelative(1),
                style: { ...styles.btn, ...(isTomorrow ? styles.btnActive : {}) }
            }, 'Tomorrow'),
            React.createElement('a', {
                href: `/api/v1/admin/export/deliveries-by-date?date=${selectedDate}`,
                style: styles.downloadLink
            }, 'Download CSV')
        ),

        // Stats
        data && React.createElement('div', { style: styles.statsRow },
            React.createElement('div', { style: styles.statCard },
                React.createElement('div', { style: styles.statValue }, data.total),
                React.createElement('div', { style: styles.statLabel }, 'Total Deliveries')
            )
        ),

        // Table or Loading
        loading ?
            React.createElement('div', { style: styles.loader }, 'Loading deliveries...') :
            (!data || data.deliveries.length === 0) ?
                React.createElement('div', { style: styles.noData }, 'No deliveries scheduled for this date') :
                React.createElement('div', { style: styles.tableCard },
                    React.createElement('table', { style: styles.table },
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                React.createElement('th', { style: styles.th }, 'Sub ID'),
                                React.createElement('th', { style: styles.th }, 'Customer'),
                                React.createElement('th', { style: styles.th }, 'Phone'),
                                React.createElement('th', { style: styles.th }, 'Address'),
                                React.createElement('th', { style: styles.th }, 'Partner'),
                                React.createElement('th', { style: styles.th }, 'Status'),
                                React.createElement('th', { style: styles.th }, 'Items')
                            )
                        ),
                        React.createElement('tbody', null,
                            data.deliveries.map((d, i) =>
                                React.createElement('tr', { key: i },
                                    React.createElement('td', { style: { ...styles.td, fontWeight: '600' } }, d.subscriptionId),
                                    React.createElement('td', { style: styles.td }, d.customerName),
                                    React.createElement('td', { style: styles.td }, d.phone),
                                    React.createElement('td', { style: styles.td }, d.address),
                                    React.createElement('td', { style: styles.td }, d.deliveryPartner),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', {
                                            style: {
                                                ...styles.statusBadge,
                                                background: STATUS_COLORS[d.status] || '#666',
                                                color: '#fff'
                                            }
                                        }, d.status)
                                    ),
                                    React.createElement('td', { style: styles.td },
                                        React.createElement('span', { style: { color: '#9aa5b1', marginRight: '8px' } }, `(${d.itemCount || d.items.length})`),
                                        d.items.map((item, j) =>
                                            React.createElement('span', { key: j, style: styles.itemTag },
                                                typeof item === 'string' ? item : item.display
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
    );
};

export default DeliveriesPage;
