(function (React) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    // This component performs a simple client-side redirect to the premium HTML invoice.
    // It bypasses the AdminJS AJAX handling to ensure a full page load of our custom view.
    const InvoiceRedirect = props => {
      const {
        record,
        resource
      } = props;
      React.useEffect(() => {
        if (record && record.id) {
          const id = record.id;
          // Determine if it's a subscription or order
          const type = resource.id.toLowerCase().includes('subscription') ? 'subscription' : 'order';
          const redirectUrl = `/api/v1/admin/preview/${type}/${id}`;
          console.log(`🚀 Redirecting to premium invoice: ${redirectUrl}`);
          window.location.href = redirectUrl;
        }
      }, [record, resource]);
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: '#757575'
        }
      }, 'Preparing your premium invoice...');
    };

    // This component redirects to CSV export endpoint
    const CSVRedirect = props => {
      const {
        resource
      } = props;
      React.useEffect(() => {
        // Determine export type based on resource
        const resourceId = resource.id.toLowerCase();
        let exportUrl = '/api/v1/admin/export/orders';
        if (resourceId.includes('subscription')) {
          exportUrl = '/api/v1/admin/export/subscriptions';
        }
        console.log(`📊 Redirecting to CSV export: ${exportUrl}`);
        window.location.href = exportUrl;
      }, [resource]);
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: '#757575'
        }
      }, 'Generating CSV report...');
    };

    // Styles matching AdminJS dark theme
    const styles$2 = {
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
    const STATUS_COLORS$2 = {
      scheduled: '#3795BD',
      delivered: '#4CAF50',
      missed: '#f44336',
      cancelled: '#9e9e9e'
    };
    const DeliveriesPage = () => {
      const [loading, setLoading] = React.useState(true);
      const [data, setData] = React.useState(null);
      const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
      React.useEffect(() => {
        fetchDeliveries(selectedDate);
      }, [selectedDate]);
      const fetchDeliveries = async date => {
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
      const goToRelative = offset => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
      };
      const formatDate = dateStr => {
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
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.container
      },
      /*#__PURE__*/
      // Header
      React__default.default.createElement('div', {
        style: styles$2.header
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.title
      }, 'Deliveries by Date'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.subtitle
      }, formatDate(selectedDate))),
      /*#__PURE__*/
      // Controls
      React__default.default.createElement('div', {
        style: styles$2.controls
      }, /*#__PURE__*/React__default.default.createElement('input', {
        type: 'date',
        value: selectedDate,
        onChange: e => setSelectedDate(e.target.value),
        style: styles$2.dateInput
      }), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => goToRelative(-1),
        style: styles$2.btn
      }, 'Yesterday'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => goToRelative(0),
        style: {
          ...styles$2.btn,
          ...(isToday ? styles$2.btnActive : {})
        }
      }, 'Today'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => goToRelative(1),
        style: {
          ...styles$2.btn,
          ...(isTomorrow ? styles$2.btnActive : {})
        }
      }, 'Tomorrow'), /*#__PURE__*/React__default.default.createElement('a', {
        href: `/api/v1/admin/export/deliveries-by-date?date=${selectedDate}`,
        style: styles$2.downloadLink
      }, 'Download CSV')),
      // Stats
      data && /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.statsRow
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.statValue
      }, data.total), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.statLabel
      }, 'Total Deliveries'))),
      // Table or Loading
      loading ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.loader
      }, 'Loading deliveries...') : !data || data.deliveries.length === 0 ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.noData
      }, 'No deliveries scheduled for this date') : /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$2.tableCard
      }, /*#__PURE__*/React__default.default.createElement('table', {
        style: styles$2.table
      }, /*#__PURE__*/React__default.default.createElement('thead', null, /*#__PURE__*/React__default.default.createElement('tr', null, /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Sub ID'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Customer'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Phone'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Address'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Partner'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Status'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$2.th
      }, 'Items'))), /*#__PURE__*/React__default.default.createElement('tbody', null, data.deliveries.map((d, i) => /*#__PURE__*/React__default.default.createElement('tr', {
        key: i
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles$2.td,
          fontWeight: '600'
        }
      }, d.subscriptionId), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, d.customerName), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, d.phone), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, d.address), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, d.deliveryPartner), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles$2.statusBadge,
          background: STATUS_COLORS$2[d.status] || '#666',
          color: '#fff'
        }
      }, d.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$2.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: '#9aa5b1',
          marginRight: '8px'
        }
      }, `(${d.itemCount || d.items.length})`), d.items.map((item, j) => /*#__PURE__*/React__default.default.createElement('span', {
        key: j,
        style: styles$2.itemTag
      }, typeof item === 'string' ? item : item.display)))))))));
    };

    // Styled container and card components using inline styles for AdminJS compatibility
    // Colors match AdminJS dark theme: background #1e2226, cards #303641, accent #F5C518
    const styles$1 = {
      dashboard: {
        padding: '24px',
        background: 'transparent',
        // Inherit from AdminJS
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
    const STATUS_COLORS$1 = {
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
      const [stats, setStats] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);
      React.useEffect(() => {
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
      const formatCurrency = value => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(value || 0);
      };
      if (loading) {
        return /*#__PURE__*/React__default.default.createElement('div', {
          style: styles$1.loader
        }, 'Loading Dashboard...');
      }
      if (error) {
        return /*#__PURE__*/React__default.default.createElement('div', {
          style: {
            ...styles$1.loader,
            color: '#f44336'
          }
        }, `Error: ${error}`);
      }
      const {
        totals,
        ordersByStatus,
        subscriptionsByStatus,
        payments,
        todaysDeliveries,
        recentOrders,
        recentSubscriptions
      } = stats;

      // Calculate max for bar chart scaling
      const maxSubscriptionCount = Math.max(...Object.values(subscriptionsByStatus), 1);
      const maxOrderCount = Math.max(...Object.values(ordersByStatus), 1);
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.dashboard
      },
      /*#__PURE__*/
      // Header
      React__default.default.createElement('div', {
        style: styles$1.header
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.title
      }, 'Dashboard'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.subtitle
      }, `Last updated: ${new Date().toLocaleString('en-IN')}`)),
      /*#__PURE__*/
      // Quick Actions
      React__default.default.createElement('div', {
        style: styles$1.quickActions
      }, /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/reports/deliveries-by-date',
        style: styles$1.actionBtn
      }, 'Deliveries by Date'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/export/subscriptions',
        style: styles$1.actionBtn
      }, 'Export Subscriptions'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/export/orders',
        style: styles$1.actionBtn
      }, 'Export Orders')),
      /*#__PURE__*/
      // Stat Cards
      React__default.default.createElement('div', {
        style: styles$1.statsGrid
      },
      /*#__PURE__*/
      // Orders
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, totals.orders), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Total Orders')),
      /*#__PURE__*/
      // Subscriptions
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, totals.subscriptions), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Total Subscriptions')),
      /*#__PURE__*/
      // Customers
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, totals.customers), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Customers')),
      /*#__PURE__*/
      // Revenue
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, formatCurrency(totals.revenue)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Total Revenue')),
      /*#__PURE__*/
      // Today's Deliveries
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, todaysDeliveries), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, "Today's Deliveries")),
      /*#__PURE__*/
      // Payment Status
      React__default.default.createElement('div', {
        style: styles$1.statCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue
      }, payments.verified), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Verified Payments'))),
      /*#__PURE__*/
      // Charts Grid
      React__default.default.createElement('div', {
        style: styles$1.chartsGrid
      },
      /*#__PURE__*/
      // Subscription Status Chart
      React__default.default.createElement('div', {
        style: styles$1.chartCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, 'Subscription Status'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartContainer
      }, Object.entries(subscriptionsByStatus).map(([status, count]) => /*#__PURE__*/React__default.default.createElement('div', {
        key: status,
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.bar,
          height: `${count / maxSubscriptionCount * 100}px`,
          background: STATUS_COLORS$1[status] || '#666',
          minHeight: '10px'
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, status), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: '#fff'
        }
      }, count))))),
      /*#__PURE__*/
      // Order Status Chart
      React__default.default.createElement('div', {
        style: styles$1.chartCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, 'Order Status'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartContainer
      }, Object.entries(ordersByStatus).filter(([_, count]) => count > 0).map(([status, count]) => /*#__PURE__*/React__default.default.createElement('div', {
        key: status,
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.bar,
          height: `${count / maxOrderCount * 100}px`,
          background: STATUS_COLORS$1[status] || '#666',
          minHeight: '10px'
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, status), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: '#fff'
        }
      }, count))))),
      /*#__PURE__*/
      // Payment Methods
      React__default.default.createElement('div', {
        style: styles$1.chartCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, 'Payment Methods'), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          padding: '20px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.legendItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.legendDot,
          background: '#4CAF50'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendText
      }, 'Online'), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendValue
      }, payments.online)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.legendItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.legendDot,
          background: '#FFC107'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendText
      }, 'COD'), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendValue
      }, payments.cod)), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.legendItem,
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.legendDot,
          background: '#4CAF50'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendText
      }, 'Verified'), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendValue
      }, payments.verified)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.legendItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.legendDot,
          background: '#f44336'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendText
      }, 'Pending'), /*#__PURE__*/React__default.default.createElement('span', {
        style: styles$1.legendValue
      }, payments.pending))))),
      /*#__PURE__*/
      // Recent Tables
      React__default.default.createElement('div', {
        style: styles$1.chartsGrid
      },
      /*#__PURE__*/
      // Recent Orders
      React__default.default.createElement('div', {
        style: styles$1.tableCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, 'Recent Orders'), /*#__PURE__*/React__default.default.createElement('table', {
        style: styles$1.table
      }, /*#__PURE__*/React__default.default.createElement('thead', null, /*#__PURE__*/React__default.default.createElement('tr', null, /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Order ID'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Customer'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Status'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Amount'))), /*#__PURE__*/React__default.default.createElement('tbody', null, recentOrders.map(order => /*#__PURE__*/React__default.default.createElement('tr', {
        key: order.id
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, order.id), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, order.customer), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles$1.statusBadge,
          background: STATUS_COLORS$1[order.status] || '#666',
          color: '#fff'
        }
      }, order.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, formatCurrency(order.amount))))))),
      /*#__PURE__*/
      // Recent Subscriptions
      React__default.default.createElement('div', {
        style: styles$1.tableCard
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, 'Recent Subscriptions'), /*#__PURE__*/React__default.default.createElement('table', {
        style: styles$1.table
      }, /*#__PURE__*/React__default.default.createElement('thead', null, /*#__PURE__*/React__default.default.createElement('tr', null, /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Sub ID'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Customer'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Status'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Bill'))), /*#__PURE__*/React__default.default.createElement('tbody', null, recentSubscriptions.map(sub => /*#__PURE__*/React__default.default.createElement('tr', {
        key: sub.id
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, sub.id), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, sub.customer), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles$1.statusBadge,
          background: STATUS_COLORS$1[sub.status] || '#666',
          color: '#fff'
        }
      }, sub.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, formatCurrency(sub.amount)))))))));
    };

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
    const formatCurrency = amount => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
      }).format(amount || 0);
    };
    const OrdersPage = () => {
      const [loading, setLoading] = React.useState(true);
      const [data, setData] = React.useState(null);
      const [selectedDate, setSelectedDate] = React.useState('');
      const [selectedFilter, setSelectedFilter] = React.useState('');
      React.useEffect(() => {
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
      const setDateRelative = offset => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
      };
      const clearFilters = () => {
        setSelectedDate('');
        setSelectedFilter('');
      };
      const formatDate = dateStr => {
        if (!dateStr || dateStr === 'all') return 'All Time';
        return new Date(dateStr).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
      const isToday = selectedDate === new Date().toISOString().split('T')[0];
      const filters = [{
        key: '',
        label: 'All',
        count: data?.summary?.total
      }, {
        key: 'unassigned',
        label: 'Unassigned',
        count: data?.summary?.unassigned
      }, {
        key: 'cod',
        label: 'COD',
        count: data?.summary?.cod
      }, {
        key: 'online',
        label: 'Online',
        count: data?.summary?.online
      }, {
        key: 'paid',
        label: 'Paid',
        count: data?.summary?.paid
      }, {
        key: 'pending',
        label: 'Pending',
        count: data?.summary?.pending
      }, {
        key: 'delivered',
        label: 'Delivered',
        count: data?.summary?.delivered
      }];
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.container
      },
      /*#__PURE__*/
      // Header
      React__default.default.createElement('div', {
        style: styles.header
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.title
      }, 'Orders by Date'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.subtitle
      }, formatDate(selectedDate))),
      /*#__PURE__*/
      // Controls
      React__default.default.createElement('div', {
        style: styles.controls
      }, /*#__PURE__*/React__default.default.createElement('input', {
        type: 'date',
        value: selectedDate,
        onChange: e => setSelectedDate(e.target.value),
        style: styles.dateInput,
        placeholder: 'Select date'
      }), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(0),
        style: {
          ...styles.btn,
          ...(isToday ? styles.btnActive : {})
        }
      }, 'Today'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(-1),
        style: styles.btn
      }, 'Yesterday'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(-7),
        style: styles.btn
      }, 'Last Week'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: clearFilters,
        style: styles.clearBtn
      }, 'Clear All'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/export/orders',
        style: styles.downloadLink
      }, 'Download CSV')),
      // Filter Stats
      data && /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statsRow
      }, filters.map(f => /*#__PURE__*/React__default.default.createElement('div', {
        key: f.key,
        style: {
          ...styles.statCard,
          ...(selectedFilter === f.key ? styles.statCardActive : {})
        },
        onClick: () => setSelectedFilter(f.key)
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statValue
      }, f.count || 0), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statLabel
      }, f.label)))),
      // Table or Loading
      loading ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.loader
      }, 'Loading orders...') : !data || data.orders.length === 0 ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.noData
      }, 'No orders found') : /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.tableCard
      }, /*#__PURE__*/React__default.default.createElement('table', {
        style: styles.table
      }, /*#__PURE__*/React__default.default.createElement('thead', null, /*#__PURE__*/React__default.default.createElement('tr', null, /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Order ID'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Customer'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Phone'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Address'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Partner'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Status'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Payment'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Amount'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles.th
      }, 'Items'))), /*#__PURE__*/React__default.default.createElement('tbody', null, data.orders.map((order, i) => /*#__PURE__*/React__default.default.createElement('tr', {
        key: i
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles.td,
          fontWeight: '600'
        }
      }, order.orderId), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.customerName), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.phone), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.address), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.deliveryPartner), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: STATUS_COLORS[order.status] || '#666',
          color: '#fff'
        }
      }, order.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('div', null, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: PAYMENT_COLORS[order.paymentMethod] || '#666',
          color: '#fff',
          marginRight: '6px'
        }
      }, order.paymentMethod), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: STATUS_COLORS[order.paymentStatus] || '#666',
          color: '#fff'
        }
      }, order.paymentStatus))), /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles.td,
          fontWeight: '600'
        }
      }, formatCurrency(order.amount)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: '#9aa5b1',
          marginRight: '8px'
        }
      }, `(${order.itemCount})`), order.items.map((item, j) => /*#__PURE__*/React__default.default.createElement('span', {
        key: j,
        style: styles.itemTag
      }, item.display)))))))));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.InvoiceRedirect = InvoiceRedirect;
    AdminJS.UserComponents.CSVRedirect = CSVRedirect;
    AdminJS.UserComponents.DeliveriesPage = DeliveriesPage;
    AdminJS.UserComponents.Dashboard = Dashboard;
    AdminJS.UserComponents.OrdersPage = OrdersPage;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvSW52b2ljZVJlZGlyZWN0LmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdC5qc3giLCIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGVsaXZlcmllc1BhZ2UuanN4IiwiLi4vc3JjL2NvbmZpZy9jb21wb25lbnRzL0Rhc2hib2FyZC5qc3giLCIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvT3JkZXJzUGFnZS5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBUaGlzIGNvbXBvbmVudCBwZXJmb3JtcyBhIHNpbXBsZSBjbGllbnQtc2lkZSByZWRpcmVjdCB0byB0aGUgcHJlbWl1bSBIVE1MIGludm9pY2UuXG4vLyBJdCBieXBhc3NlcyB0aGUgQWRtaW5KUyBBSkFYIGhhbmRsaW5nIHRvIGVuc3VyZSBhIGZ1bGwgcGFnZSBsb2FkIG9mIG91ciBjdXN0b20gdmlldy5cbmNvbnN0IEludm9pY2VSZWRpcmVjdCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZC5pZCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSByZWNvcmQuaWQ7XG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgaXQncyBhIHN1YnNjcmlwdGlvbiBvciBvcmRlclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3N1YnNjcmlwdGlvbicpID8gJ3N1YnNjcmlwdGlvbicgOiAnb3JkZXInO1xuICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSBgL2FwaS92MS9hZG1pbi9wcmV2aWV3LyR7dHlwZX0vJHtpZH1gO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg8J+agCBSZWRpcmVjdGluZyB0byBwcmVtaXVtIGludm9pY2U6ICR7cmVkaXJlY3RVcmx9YCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9XG4gICAgfSwgW3JlY29yZCwgcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ1ByZXBhcmluZyB5b3VyIHByZW1pdW0gaW52b2ljZS4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW52b2ljZVJlZGlyZWN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gVGhpcyBjb21wb25lbnQgcmVkaXJlY3RzIHRvIENTViBleHBvcnQgZW5kcG9pbnRcbmNvbnN0IENTVlJlZGlyZWN0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb3J0IHR5cGUgYmFzZWQgb24gcmVzb3VyY2VcbiAgICAgICAgY29uc3QgcmVzb3VyY2VJZCA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBleHBvcnRVcmwgPSAnL2FwaS92MS9hZG1pbi9leHBvcnQvb3JkZXJzJztcblxuICAgICAgICBpZiAocmVzb3VyY2VJZC5pbmNsdWRlcygnc3Vic2NyaXB0aW9uJykpIHtcbiAgICAgICAgICAgIGV4cG9ydFVybCA9ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9zdWJzY3JpcHRpb25zJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGDwn5OKIFJlZGlyZWN0aW5nIHRvIENTViBleHBvcnQ6ICR7ZXhwb3J0VXJsfWApO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV4cG9ydFVybDtcbiAgICB9LCBbcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ0dlbmVyYXRpbmcgQ1NWIHJlcG9ydC4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ1NWUmVkaXJlY3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gU3R5bGVzIG1hdGNoaW5nIEFkbWluSlMgZGFyayB0aGVtZVxuY29uc3Qgc3R5bGVzID0ge1xuICAgIGNvbnRhaW5lcjoge1xuICAgICAgICBwYWRkaW5nOiAnMjRweCcsXG4gICAgICAgIGZvbnRGYW1pbHk6IFwiJ1JvYm90bycsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZlwiXG4gICAgfSxcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCdcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjRweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgfSxcbiAgICBzdWJ0aXRsZToge1xuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnXG4gICAgfSxcbiAgICBjb250cm9sczoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGdhcDogJzEycHgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCcsXG4gICAgICAgIGZsZXhXcmFwOiAnd3JhcCdcbiAgICB9LFxuICAgIGRhdGVJbnB1dDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzMwMzY0MScsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNDU0ZDVkJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTRweCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCdcbiAgICB9LFxuICAgIGJ0bjoge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzM3OTVCRCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnXG4gICAgfSxcbiAgICBidG5BY3RpdmU6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMyZDdhOWUnXG4gICAgfSxcbiAgICBidG5TZWNvbmRhcnk6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyM0NTRkNWQnXG4gICAgfSxcbiAgICBzdGF0c1Jvdzoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGdhcDogJzE2cHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyMHB4J1xuICAgIH0sXG4gICAgc3RhdENhcmQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzMDM2NDEnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMTZweCAyNHB4JyxcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM0NTRkNWQnXG4gICAgfSxcbiAgICBzdGF0VmFsdWU6IHtcbiAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcbiAgICB9LFxuICAgIHN0YXRMYWJlbDoge1xuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xuICAgIH0sXG4gICAgdGFibGVDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjMzAzNjQxJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM0NTRkNWQnLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICB9LFxuICAgIHRhYmxlOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJvcmRlckNvbGxhcHNlOiAnY29sbGFwc2UnXG4gICAgfSxcbiAgICB0aDoge1xuICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgcGFkZGluZzogJzE0cHggMTZweCcsXG4gICAgICAgIGNvbG9yOiAnIzlhYTViMScsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgIzQ1NGQ1ZCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAnIzI4MmQzNidcbiAgICB9LFxuICAgIHRkOiB7XG4gICAgICAgIHBhZGRpbmc6ICcxNHB4IDE2cHgnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgIzNhNDE0OScsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnXG4gICAgfSxcbiAgICBzdGF0dXNCYWRnZToge1xuICAgICAgICBwYWRkaW5nOiAnNHB4IDhweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xuICAgIH0sXG4gICAgaXRlbVRhZzoge1xuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgYmFja2dyb3VuZDogJyM0NTRkNWQnLFxuICAgICAgICBwYWRkaW5nOiAnNXB4IDEwcHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBtYXJnaW5SaWdodDogJzZweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzZweCdcbiAgICB9LFxuICAgIGxvYWRlcjoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJyxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4J1xuICAgIH0sXG4gICAgbm9EYXRhOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIHBhZGRpbmc6ICc0MHB4JyxcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJ1xuICAgIH0sXG4gICAgZG93bmxvYWRMaW5rOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjNENBRjUwJyxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTZweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnXG4gICAgfVxufTtcblxuY29uc3QgU1RBVFVTX0NPTE9SUyA9IHtcbiAgICBzY2hlZHVsZWQ6ICcjMzc5NUJEJyxcbiAgICBkZWxpdmVyZWQ6ICcjNENBRjUwJyxcbiAgICBtaXNzZWQ6ICcjZjQ0MzM2JyxcbiAgICBjYW5jZWxsZWQ6ICcjOWU5ZTllJ1xufTtcblxuY29uc3QgRGVsaXZlcmllc1BhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3NlbGVjdGVkRGF0ZSwgc2V0U2VsZWN0ZWREYXRlXSA9IHVzZVN0YXRlKG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGZldGNoRGVsaXZlcmllcyhzZWxlY3RlZERhdGUpO1xuICAgIH0sIFtzZWxlY3RlZERhdGVdKTtcblxuICAgIGNvbnN0IGZldGNoRGVsaXZlcmllcyA9IGFzeW5jIChkYXRlKSA9PiB7XG4gICAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3YxL2FkbWluL2Rhc2hib2FyZC9kZWxpdmVyaWVzP2RhdGU9JHtkYXRlfWApO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc2V0RGF0YShyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIGRlbGl2ZXJpZXM6JywgZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGdvVG9SZWxhdGl2ZSA9IChvZmZzZXQpID0+IHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIG9mZnNldCk7XG4gICAgICAgIHNldFNlbGVjdGVkRGF0ZShkLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZVN0cikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZVN0cikudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHtcbiAgICAgICAgICAgIHdlZWtkYXk6ICdsb25nJyxcbiAgICAgICAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgICAgICAgIG1vbnRoOiAnbG9uZycsXG4gICAgICAgICAgICBkYXk6ICdudW1lcmljJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgaXNUb2RheSA9IHNlbGVjdGVkRGF0ZSA9PT0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XG4gICAgY29uc3QgdG9tb3Jyb3cgPSBuZXcgRGF0ZSgpO1xuICAgIHRvbW9ycm93LnNldERhdGUodG9tb3Jyb3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgY29uc3QgaXNUb21vcnJvdyA9IHNlbGVjdGVkRGF0ZSA9PT0gdG9tb3Jyb3cudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jb250YWluZXIgfSxcbiAgICAgICAgLy8gSGVhZGVyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5oZWFkZXIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50aXRsZSB9LCAnRGVsaXZlcmllcyBieSBEYXRlJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3VidGl0bGUgfSwgZm9ybWF0RGF0ZShzZWxlY3RlZERhdGUpKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIENvbnRyb2xzXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jb250cm9scyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RhdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RlZERhdGUsXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChlKSA9PiBzZXRTZWxlY3RlZERhdGUoZS50YXJnZXQudmFsdWUpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuZGF0ZUlucHV0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBnb1RvUmVsYXRpdmUoLTEpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuYnRuXG4gICAgICAgICAgICB9LCAnWWVzdGVyZGF5JyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gZ29Ub1JlbGF0aXZlKDApLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7IC4uLnN0eWxlcy5idG4sIC4uLihpc1RvZGF5ID8gc3R5bGVzLmJ0bkFjdGl2ZSA6IHt9KSB9XG4gICAgICAgICAgICB9LCAnVG9kYXknKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBnb1RvUmVsYXRpdmUoMSksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHsgLi4uc3R5bGVzLmJ0biwgLi4uKGlzVG9tb3Jyb3cgPyBzdHlsZXMuYnRuQWN0aXZlIDoge30pIH1cbiAgICAgICAgICAgIH0sICdUb21vcnJvdycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYScsIHtcbiAgICAgICAgICAgICAgICBocmVmOiBgL2FwaS92MS9hZG1pbi9leHBvcnQvZGVsaXZlcmllcy1ieS1kYXRlP2RhdGU9JHtzZWxlY3RlZERhdGV9YCxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmRvd25sb2FkTGlua1xuICAgICAgICAgICAgfSwgJ0Rvd25sb2FkIENTVicpXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gU3RhdHNcbiAgICAgICAgZGF0YSAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdHNSb3cgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUgfSwgZGF0YS50b3RhbCksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVG90YWwgRGVsaXZlcmllcycpXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gVGFibGUgb3IgTG9hZGluZ1xuICAgICAgICBsb2FkaW5nID9cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSwgJ0xvYWRpbmcgZGVsaXZlcmllcy4uLicpIDpcbiAgICAgICAgICAgICghZGF0YSB8fCBkYXRhLmRlbGl2ZXJpZXMubGVuZ3RoID09PSAwKSA/XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLm5vRGF0YSB9LCAnTm8gZGVsaXZlcmllcyBzY2hlZHVsZWQgZm9yIHRoaXMgZGF0ZScpIDpcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGFibGVDYXJkIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBzdHlsZTogc3R5bGVzLnRhYmxlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aGVhZCcsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnU3ViIElEJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdDdXN0b21lcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnUGhvbmUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0FkZHJlc3MnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1BhcnRuZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnSXRlbXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0Ym9keScsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kZWxpdmVyaWVzLm1hcCgoZCwgaSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogaSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBkLnN1YnNjcmlwdGlvbklkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIGQuY3VzdG9tZXJOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIGQucGhvbmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgZC5hZGRyZXNzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIGQuZGVsaXZlcnlQYXJ0bmVyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFNUQVRVU19DT0xPUlNbZC5zdGF0dXNdIHx8ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGQuc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6ICcjOWFhNWIxJywgbWFyZ2luUmlnaHQ6ICc4cHgnIH0gfSwgYCgke2QuaXRlbUNvdW50IHx8IGQuaXRlbXMubGVuZ3RofSlgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLml0ZW1zLm1hcCgoaXRlbSwgaikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsga2V5OiBqLCBzdHlsZTogc3R5bGVzLml0ZW1UYWcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyA/IGl0ZW0gOiBpdGVtLmRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGVsaXZlcmllc1BhZ2U7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gU3R5bGVkIGNvbnRhaW5lciBhbmQgY2FyZCBjb21wb25lbnRzIHVzaW5nIGlubGluZSBzdHlsZXMgZm9yIEFkbWluSlMgY29tcGF0aWJpbGl0eVxuLy8gQ29sb3JzIG1hdGNoIEFkbWluSlMgZGFyayB0aGVtZTogYmFja2dyb3VuZCAjMWUyMjI2LCBjYXJkcyAjMzAzNjQxLCBhY2NlbnQgI0Y1QzUxOFxuY29uc3Qgc3R5bGVzID0ge1xuICAgIGRhc2hib2FyZDoge1xuICAgICAgICBwYWRkaW5nOiAnMjRweCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIC8vIEluaGVyaXQgZnJvbSBBZG1pbkpTXG4gICAgICAgIG1pbkhlaWdodDogJzEwMHZoJyxcbiAgICAgICAgZm9udEZhbWlseTogXCInUm9ib3RvJywgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmXCJcbiAgICB9LFxuICAgIGhlYWRlcjoge1xuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4J1xuICAgIH0sXG4gICAgdGl0bGU6IHtcbiAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzEwcHgnXG4gICAgfSxcbiAgICBzdWJ0aXRsZToge1xuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnXG4gICAgfSxcbiAgICBzdGF0c0dyaWQ6IHtcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMTgwcHgsIDFmcikpJyxcbiAgICAgICAgZ2FwOiAnMTZweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgfSxcbiAgICBzdGF0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzMwMzY0MScsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4JyxcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM0NTRkNWQnXG4gICAgfSxcbiAgICBzdGF0SWNvbjoge1xuICAgICAgICBmb250U2l6ZTogJzIwcHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcxMHB4J1xuICAgIH0sXG4gICAgc3RhdFZhbHVlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjhweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc0cHgnXG4gICAgfSxcbiAgICBzdGF0TGFiZWw6IHtcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJyxcbiAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCdcbiAgICB9LFxuICAgIGNoYXJ0c0dyaWQ6IHtcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMzAwcHgsIDFmcikpJyxcbiAgICAgICAgZ2FwOiAnMTZweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgfSxcbiAgICBjaGFydENhcmQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzMDM2NDEnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMjBweCcsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNDU0ZDVkJ1xuICAgIH0sXG4gICAgY2hhcnRUaXRsZToge1xuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzhweCdcbiAgICB9LFxuICAgIGNoYXJ0Q29udGFpbmVyOiB7XG4gICAgICAgIGhlaWdodDogJzE0MHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICBnYXA6ICcxMnB4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1hcm91bmQnLFxuICAgICAgICBtYXJnaW5Ub3A6ICcyMHB4J1xuICAgIH0sXG4gICAgYmFyOiB7XG4gICAgICAgIHdpZHRoOiAnNTBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzRweCA0cHggMCAwJyxcbiAgICAgICAgdHJhbnNpdGlvbjogJ2hlaWdodCAwLjNzIGVhc2UnXG4gICAgfSxcbiAgICBiYXJMYWJlbDoge1xuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5Ub3A6ICc4cHgnXG4gICAgfSxcbiAgICBwaWVDb250YWluZXI6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBoZWlnaHQ6ICcxODBweCdcbiAgICB9LFxuICAgIGxlZ2VuZEl0ZW06IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnMTBweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzEycHgnXG4gICAgfSxcbiAgICBsZWdlbmREb3Q6IHtcbiAgICAgICAgd2lkdGg6ICcxMHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnMTBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzUwJSdcbiAgICB9LFxuICAgIGxlZ2VuZFRleHQ6IHtcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4J1xuICAgIH0sXG4gICAgbGVnZW5kVmFsdWU6IHtcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgbWFyZ2luTGVmdDogJ2F1dG8nLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgdGFibGVDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjMzAzNjQxJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgcGFkZGluZzogJzIwcHgnLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzQ1NGQ1ZCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnXG4gICAgfSxcbiAgICB0YWJsZToge1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJ1xuICAgIH0sXG4gICAgdGg6IHtcbiAgICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDEycHgnLFxuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICM0NTRkNWQnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgdGQ6IHtcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTJweCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjM2E0MTQ5J1xuICAgIH0sXG4gICAgc3RhdHVzQmFkZ2U6IHtcbiAgICAgICAgcGFkZGluZzogJzRweCA4cHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbiAgICB9LFxuICAgIGxvYWRlcjoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgZm9udFNpemU6ICcxNnB4J1xuICAgIH0sXG4gICAgcXVpY2tBY3Rpb25zOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgZ2FwOiAnMTBweCcsXG4gICAgICAgIGZsZXhXcmFwOiAnd3JhcCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzIwcHgnXG4gICAgfSxcbiAgICBhY3Rpb25CdG46IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzNzk1QkQnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTZweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzZweCdcbiAgICB9XG59O1xuXG5jb25zdCBTVEFUVVNfQ09MT1JTID0ge1xuICAgIGFjdGl2ZTogJyM0Q0FGNTAnLFxuICAgIHBlbmRpbmc6ICcjRkZDMTA3JyxcbiAgICBleHBpcmVkOiAnI2Y0NDMzNicsXG4gICAgY2FuY2VsbGVkOiAnIzllOWU5ZScsXG4gICAgZGVsaXZlcmVkOiAnIzRDQUY1MCcsXG4gICAgY29uZmlybWVkOiAnIzIxOTZGMycsXG4gICAgcHJlcGFyaW5nOiAnI0ZGOTgwMCcsXG4gICAgcmVhZHk6ICcjMDBCQ0Q0J1xufTtcblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IFtzdGF0cywgc2V0U3RhdHNdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGZldGNoU3RhdHMoKTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBmZXRjaFN0YXRzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS92MS9hZG1pbi9kYXNoYm9hcmQvc3RhdHMnKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc2V0U3RhdHMoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IoZGF0YS5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc2V0RXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBkYXNoYm9hcmQgZGF0YScpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tSU4nLCB7XG4gICAgICAgICAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICAgICAgICAgIGN1cnJlbmN5OiAnSU5SJyxcbiAgICAgICAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMFxuICAgICAgICB9KS5mb3JtYXQodmFsdWUgfHwgMCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHtcbiAgICAgICAgICAgIGRheTogJzItZGlnaXQnLFxuICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgICAgICAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0J1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSxcbiAgICAgICAgICAgICdMb2FkaW5nIERhc2hib2FyZC4uLidcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxvYWRlciwgY29sb3I6ICcjZjQ0MzM2JyB9IH0sXG4gICAgICAgICAgICBgRXJyb3I6ICR7ZXJyb3J9YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdG90YWxzLCBvcmRlcnNCeVN0YXR1cywgc3Vic2NyaXB0aW9uc0J5U3RhdHVzLCBwYXltZW50cywgdG9kYXlzRGVsaXZlcmllcywgcmVjZW50T3JkZXJzLCByZWNlbnRTdWJzY3JpcHRpb25zIH0gPSBzdGF0cztcblxuICAgIC8vIENhbGN1bGF0ZSBtYXggZm9yIGJhciBjaGFydCBzY2FsaW5nXG4gICAgY29uc3QgbWF4U3Vic2NyaXB0aW9uQ291bnQgPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWVzKHN1YnNjcmlwdGlvbnNCeVN0YXR1cyksIDEpO1xuICAgIGNvbnN0IG1heE9yZGVyQ291bnQgPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWVzKG9yZGVyc0J5U3RhdHVzKSwgMSk7XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmRhc2hib2FyZCB9LFxuICAgICAgICAvLyBIZWFkZXJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmhlYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRpdGxlIH0sICdEYXNoYm9hcmQnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdWJ0aXRsZSB9LFxuICAgICAgICAgICAgICAgIGBMYXN0IHVwZGF0ZWQ6ICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUXVpY2sgQWN0aW9uc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMucXVpY2tBY3Rpb25zIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYXBpL3YxL2FkbWluL3JlcG9ydHMvZGVsaXZlcmllcy1ieS1kYXRlJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmFjdGlvbkJ0blxuICAgICAgICAgICAgfSwgJ0RlbGl2ZXJpZXMgYnkgRGF0ZScpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYScsIHtcbiAgICAgICAgICAgICAgICBocmVmOiAnL2FwaS92MS9hZG1pbi9leHBvcnQvc3Vic2NyaXB0aW9ucycsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5hY3Rpb25CdG5cbiAgICAgICAgICAgIH0sICdFeHBvcnQgU3Vic2NyaXB0aW9ucycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYScsIHtcbiAgICAgICAgICAgICAgICBocmVmOiAnL2FwaS92MS9hZG1pbi9leHBvcnQvb3JkZXJzJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmFjdGlvbkJ0blxuICAgICAgICAgICAgfSwgJ0V4cG9ydCBPcmRlcnMnKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIFN0YXQgQ2FyZHNcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRzR3JpZCB9LFxuICAgICAgICAgICAgLy8gT3JkZXJzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlIH0sIHRvdGFscy5vcmRlcnMpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1RvdGFsIE9yZGVycycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gU3Vic2NyaXB0aW9uc1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSB9LCB0b3RhbHMuc3Vic2NyaXB0aW9ucyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVG90YWwgU3Vic2NyaXB0aW9ucycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gQ3VzdG9tZXJzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlIH0sIHRvdGFscy5jdXN0b21lcnMpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ0N1c3RvbWVycycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gUmV2ZW51ZVxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSB9LCBmb3JtYXRDdXJyZW5jeSh0b3RhbHMucmV2ZW51ZSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1RvdGFsIFJldmVudWUnKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIC8vIFRvZGF5J3MgRGVsaXZlcmllc1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSB9LCB0b2RheXNEZWxpdmVyaWVzKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sIFwiVG9kYXkncyBEZWxpdmVyaWVzXCIpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gUGF5bWVudCBTdGF0dXNcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUgfSwgcGF5bWVudHMudmVyaWZpZWQpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1ZlcmlmaWVkIFBheW1lbnRzJylcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBDaGFydHMgR3JpZFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRzR3JpZCB9LFxuICAgICAgICAgICAgLy8gU3Vic2NyaXB0aW9uIFN0YXR1cyBDaGFydFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICdTdWJzY3JpcHRpb24gU3RhdHVzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q29udGFpbmVyIH0sXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHN1YnNjcmlwdGlvbnNCeVN0YXR1cykubWFwKChbc3RhdHVzLCBjb3VudF0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGtleTogc3RhdHVzLCBzdHlsZTogeyB0ZXh0QWxpZ246ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuYmFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHsoY291bnQgLyBtYXhTdWJzY3JpcHRpb25Db3VudCkgKiAxMDB9cHhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogU1RBVFVTX0NPTE9SU1tzdGF0dXNdIHx8ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzEwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuYmFyTGFiZWwgfSwgc3RhdHVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5iYXJMYWJlbCwgY29sb3I6ICcjZmZmJyB9IH0sIGNvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gT3JkZXIgU3RhdHVzIENoYXJ0XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ09yZGVyIFN0YXR1cycpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENvbnRhaW5lciB9LFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhvcmRlcnNCeVN0YXR1cykuZmlsdGVyKChbXywgY291bnRdKSA9PiBjb3VudCA+IDApLm1hcCgoW3N0YXR1cywgY291bnRdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBrZXk6IHN0YXR1cywgc3R5bGU6IHsgdGV4dEFsaWduOiAnY2VudGVyJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLmJhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogYCR7KGNvdW50IC8gbWF4T3JkZXJDb3VudCkgKiAxMDB9cHhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogU1RBVFVTX0NPTE9SU1tzdGF0dXNdIHx8ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzEwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuYmFyTGFiZWwgfSwgc3RhdHVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5iYXJMYWJlbCwgY29sb3I6ICcjZmZmJyB9IH0sIGNvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gUGF5bWVudCBNZXRob2RzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ1BheW1lbnQgTWV0aG9kcycpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgcGFkZGluZzogJzIwcHgnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxlZ2VuZEl0ZW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxlZ2VuZERvdCwgYmFja2dyb3VuZDogJyM0Q0FGNTAnIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogc3R5bGVzLmxlZ2VuZFRleHQgfSwgJ09ubGluZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHN0eWxlcy5sZWdlbmRWYWx1ZSB9LCBwYXltZW50cy5vbmxpbmUpXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sZWdlbmRJdGVtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5sZWdlbmREb3QsIGJhY2tncm91bmQ6ICcjRkZDMTA3JyB9IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHN0eWxlcy5sZWdlbmRUZXh0IH0sICdDT0QnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiBzdHlsZXMubGVnZW5kVmFsdWUgfSwgcGF5bWVudHMuY29kKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5sZWdlbmRJdGVtLCBtYXJnaW5Ub3A6ICcyMHB4JywgcGFkZGluZ1RvcDogJzIwcHgnLCBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5sZWdlbmREb3QsIGJhY2tncm91bmQ6ICcjNENBRjUwJyB9IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHN0eWxlcy5sZWdlbmRUZXh0IH0sICdWZXJpZmllZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHN0eWxlcy5sZWdlbmRWYWx1ZSB9LCBwYXltZW50cy52ZXJpZmllZClcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxlZ2VuZEl0ZW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxlZ2VuZERvdCwgYmFja2dyb3VuZDogJyNmNDQzMzYnIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogc3R5bGVzLmxlZ2VuZFRleHQgfSwgJ1BlbmRpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiBzdHlsZXMubGVnZW5kVmFsdWUgfSwgcGF5bWVudHMucGVuZGluZylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBSZWNlbnQgVGFibGVzXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydHNHcmlkIH0sXG4gICAgICAgICAgICAvLyBSZWNlbnQgT3JkZXJzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGFibGVDYXJkIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ1JlY2VudCBPcmRlcnMnKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0YWJsZScsIHsgc3R5bGU6IHN0eWxlcy50YWJsZSB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aGVhZCcsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ09yZGVyIElEJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0N1c3RvbWVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdBbW91bnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0Ym9keScsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNlbnRPcmRlcnMubWFwKG9yZGVyID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogb3JkZXIuaWQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIuaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5jdXN0b21lciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogU1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9yZGVyLnN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgZm9ybWF0Q3VycmVuY3kob3JkZXIuYW1vdW50KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAvLyBSZWNlbnQgU3Vic2NyaXB0aW9uc1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRhYmxlQ2FyZCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICdSZWNlbnQgU3Vic2NyaXB0aW9ucycpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBzdHlsZTogc3R5bGVzLnRhYmxlIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RyJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnU3ViIElEJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0N1c3RvbWVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdCaWxsJylcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGJvZHknLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjZW50U3Vic2NyaXB0aW9ucy5tYXAoc3ViID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogc3ViLmlkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIHN1Yi5pZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIHN1Yi5jdXN0b21lciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogU1RBVFVTX0NPTE9SU1tzdWIuc3RhdHVzXSB8fCAnIzY2NicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBzdWIuc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBmb3JtYXRDdXJyZW5jeShzdWIuYW1vdW50KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbi8vIFN0eWxlcyBtYXRjaGluZyBBZG1pbkpTIGRhcmsgdGhlbWVcbmNvbnN0IHN0eWxlcyA9IHtcbiAgICBjb250YWluZXI6IHtcbiAgICAgICAgcGFkZGluZzogJzI0cHgnLFxuICAgICAgICBmb250RmFtaWx5OiBcIidSb2JvdG8nLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWZcIlxuICAgIH0sXG4gICAgaGVhZGVyOiB7XG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzIwcHgnXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4J1xuICAgIH0sXG4gICAgc3VidGl0bGU6IHtcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4J1xuICAgIH0sXG4gICAgY29udHJvbHM6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBnYXA6ICcxMnB4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzIwcHgnLFxuICAgICAgICBmbGV4V3JhcDogJ3dyYXAnXG4gICAgfSxcbiAgICBkYXRlSW5wdXQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzMDM2NDEnLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzQ1NGQ1ZCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDE0cHgnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnXG4gICAgfSxcbiAgICBidG46IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyM0NTRkNWQnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzhweCAxNHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnXG4gICAgfSxcbiAgICBidG5BY3RpdmU6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzNzk1QkQnXG4gICAgfSxcbiAgICBidG5QcmltYXJ5OiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjMzc5NUJEJ1xuICAgIH0sXG4gICAgc3RhdHNSb3c6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBnYXA6ICcxMnB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCcsXG4gICAgICAgIGZsZXhXcmFwOiAnd3JhcCdcbiAgICB9LFxuICAgIHN0YXRDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjMzAzNjQxJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMjBweCcsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNDU0ZDVkJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIHRyYW5zaXRpb246ICdib3JkZXItY29sb3IgMC4ycydcbiAgICB9LFxuICAgIHN0YXRDYXJkQWN0aXZlOiB7XG4gICAgICAgIGJvcmRlckNvbG9yOiAnIzM3OTVCRCdcbiAgICB9LFxuICAgIHN0YXRWYWx1ZToge1xuICAgICAgICBmb250U2l6ZTogJzIwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgY29sb3I6ICcjZmZmJ1xuICAgIH0sXG4gICAgc3RhdExhYmVsOiB7XG4gICAgICAgIGNvbG9yOiAnIzlhYTViMScsXG4gICAgICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG4gICAgfSxcbiAgICB0YWJsZUNhcmQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyMzMDM2NDEnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzQ1NGQ1ZCcsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgIH0sXG4gICAgdGFibGU6IHtcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgYm9yZGVyQ29sbGFwc2U6ICdjb2xsYXBzZSdcbiAgICB9LFxuICAgIHRoOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgICAgICBwYWRkaW5nOiAnMTRweCAxNnB4JyxcbiAgICAgICAgY29sb3I6ICcjOWFhNWIxJyxcbiAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjNDU0ZDVkJyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICcjMjgyZDM2J1xuICAgIH0sXG4gICAgdGQ6IHtcbiAgICAgICAgcGFkZGluZzogJzE0cHggMTZweCcsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjM2E0MTQ5JyxcbiAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCdcbiAgICB9LFxuICAgIHN0YXR1c0JhZGdlOiB7XG4gICAgICAgIHBhZGRpbmc6ICc0cHggOHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICAgICAgZm9udFNpemU6ICcxMHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG4gICAgfSxcbiAgICBpdGVtVGFnOiB7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICBiYWNrZ3JvdW5kOiAnIzQ1NGQ1ZCcsXG4gICAgICAgIHBhZGRpbmc6ICc1cHggMTBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIG1hcmdpblJpZ2h0OiAnNnB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNnB4J1xuICAgIH0sXG4gICAgbG9hZGVyOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgaGVpZ2h0OiAnMjAwcHgnLFxuICAgICAgICBjb2xvcjogJyM5YWE1YjEnLFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnXG4gICAgfSxcbiAgICBub0RhdGE6IHtcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgcGFkZGluZzogJzQwcHgnLFxuICAgICAgICBjb2xvcjogJyM5YWE1YjEnXG4gICAgfSxcbiAgICBkb3dubG9hZExpbms6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyM0Q0FGNTAnLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCdcbiAgICB9LFxuICAgIGNsZWFyQnRuOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGNvbG9yOiAnIzlhYTViMScsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNDU0ZDVkJyxcbiAgICAgICAgcGFkZGluZzogJzhweCAxNHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCdcbiAgICB9XG59O1xuXG5jb25zdCBTVEFUVVNfQ09MT1JTID0ge1xuICAgIHBlbmRpbmc6ICcjRkZDMTA3JyxcbiAgICBhY2NlcHRlZDogJyMzNzk1QkQnLFxuICAgICdpbi1wcm9ncmVzcyc6ICcjOUMyN0IwJyxcbiAgICBhd2FpdGNvbmZpcm1hdGlvbjogJyNGRjk4MDAnLFxuICAgIGRlbGl2ZXJlZDogJyM0Q0FGNTAnLFxuICAgIGNhbmNlbGxlZDogJyM5ZTllOWUnLFxuICAgIHZlcmlmaWVkOiAnIzRDQUY1MCcsXG4gICAgZmFpbGVkOiAnI2Y0NDMzNidcbn07XG5cbmNvbnN0IFBBWU1FTlRfQ09MT1JTID0ge1xuICAgIGNvZDogJyNGRjk4MDAnLFxuICAgIG9ubGluZTogJyM0Q0FGNTAnXG59O1xuXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9IChhbW91bnQpID0+IHtcbiAgICByZXR1cm4gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1JTicsIHtcbiAgICAgICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgICAgIGN1cnJlbmN5OiAnSU5SJyxcbiAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAwXG4gICAgfSkuZm9ybWF0KGFtb3VudCB8fCAwKTtcbn07XG5cbmNvbnN0IE9yZGVyc1BhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3NlbGVjdGVkRGF0ZSwgc2V0U2VsZWN0ZWREYXRlXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VsZWN0ZWRGaWx0ZXIsIHNldFNlbGVjdGVkRmlsdGVyXSA9IHVzZVN0YXRlKCcnKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGZldGNoT3JkZXJzKCk7XG4gICAgfSwgW3NlbGVjdGVkRGF0ZSwgc2VsZWN0ZWRGaWx0ZXJdKTtcblxuICAgIGNvbnN0IGZldGNoT3JkZXJzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHVybCA9ICcvYXBpL3YxL2FkbWluL2Rhc2hib2FyZC9vcmRlcnM/JztcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZERhdGUpIHVybCArPSBgZGF0ZT0ke3NlbGVjdGVkRGF0ZX0mYDtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpbHRlcikgdXJsICs9IGBmaWx0ZXI9JHtzZWxlY3RlZEZpbHRlcn1gO1xuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBzZXREYXRhKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggb3JkZXJzOicsIGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXREYXRlUmVsYXRpdmUgPSAob2Zmc2V0KSA9PiB7XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgKyBvZmZzZXQpO1xuICAgICAgICBzZXRTZWxlY3RlZERhdGUoZC50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF0pO1xuICAgIH07XG5cbiAgICBjb25zdCBjbGVhckZpbHRlcnMgPSAoKSA9PiB7XG4gICAgICAgIHNldFNlbGVjdGVkRGF0ZSgnJyk7XG4gICAgICAgIHNldFNlbGVjdGVkRmlsdGVyKCcnKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlU3RyKSA9PiB7XG4gICAgICAgIGlmICghZGF0ZVN0ciB8fCBkYXRlU3RyID09PSAnYWxsJykgcmV0dXJuICdBbGwgVGltZSc7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlU3RyKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywge1xuICAgICAgICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgICAgICAgbW9udGg6ICdsb25nJyxcbiAgICAgICAgICAgIGRheTogJ251bWVyaWMnXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBpc1RvZGF5ID0gc2VsZWN0ZWREYXRlID09PSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcblxuICAgIGNvbnN0IGZpbHRlcnMgPSBbXG4gICAgICAgIHsga2V5OiAnJywgbGFiZWw6ICdBbGwnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8udG90YWwgfSxcbiAgICAgICAgeyBrZXk6ICd1bmFzc2lnbmVkJywgbGFiZWw6ICdVbmFzc2lnbmVkJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnVuYXNzaWduZWQgfSxcbiAgICAgICAgeyBrZXk6ICdjb2QnLCBsYWJlbDogJ0NPRCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5jb2QgfSxcbiAgICAgICAgeyBrZXk6ICdvbmxpbmUnLCBsYWJlbDogJ09ubGluZScsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5vbmxpbmUgfSxcbiAgICAgICAgeyBrZXk6ICdwYWlkJywgbGFiZWw6ICdQYWlkJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnBhaWQgfSxcbiAgICAgICAgeyBrZXk6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnBlbmRpbmcgfSxcbiAgICAgICAgeyBrZXk6ICdkZWxpdmVyZWQnLCBsYWJlbDogJ0RlbGl2ZXJlZCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5kZWxpdmVyZWQgfVxuICAgIF07XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNvbnRhaW5lciB9LFxuICAgICAgICAvLyBIZWFkZXJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmhlYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRpdGxlIH0sICdPcmRlcnMgYnkgRGF0ZScpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN1YnRpdGxlIH0sIGZvcm1hdERhdGUoc2VsZWN0ZWREYXRlKSlcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBDb250cm9sc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY29udHJvbHMgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc2VsZWN0ZWREYXRlLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4gc2V0U2VsZWN0ZWREYXRlKGUudGFyZ2V0LnZhbHVlKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmRhdGVJbnB1dCxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBkYXRlJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RGF0ZVJlbGF0aXZlKDApLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7IC4uLnN0eWxlcy5idG4sIC4uLihpc1RvZGF5ID8gc3R5bGVzLmJ0bkFjdGl2ZSA6IHt9KSB9XG4gICAgICAgICAgICB9LCAnVG9kYXknKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREYXRlUmVsYXRpdmUoLTEpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuYnRuXG4gICAgICAgICAgICB9LCAnWWVzdGVyZGF5JyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RGF0ZVJlbGF0aXZlKC03KSxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmJ0blxuICAgICAgICAgICAgfSwgJ0xhc3QgV2VlaycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGNsZWFyRmlsdGVycyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmNsZWFyQnRuXG4gICAgICAgICAgICB9LCAnQ2xlYXIgQWxsJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9vcmRlcnMnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuZG93bmxvYWRMaW5rXG4gICAgICAgICAgICB9LCAnRG93bmxvYWQgQ1NWJylcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBGaWx0ZXIgU3RhdHNcbiAgICAgICAgZGF0YSAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdHNSb3cgfSxcbiAgICAgICAgICAgIGZpbHRlcnMubWFwKGYgPT5cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogZi5rZXksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdENhcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4oc2VsZWN0ZWRGaWx0ZXIgPT09IGYua2V5ID8gc3R5bGVzLnN0YXRDYXJkQWN0aXZlIDoge30pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFNlbGVjdGVkRmlsdGVyKGYua2V5KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUgfSwgZi5jb3VudCB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCBmLmxhYmVsKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBUYWJsZSBvciBMb2FkaW5nXG4gICAgICAgIGxvYWRpbmcgP1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxvYWRlciB9LCAnTG9hZGluZyBvcmRlcnMuLi4nKSA6XG4gICAgICAgICAgICAoIWRhdGEgfHwgZGF0YS5vcmRlcnMubGVuZ3RoID09PSAwKSA/XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLm5vRGF0YSB9LCAnTm8gb3JkZXJzIGZvdW5kJykgOlxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50YWJsZUNhcmQgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGFibGUnLCB7IHN0eWxlOiBzdHlsZXMudGFibGUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdPcmRlciBJRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQ3VzdG9tZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1Bob25lJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdBZGRyZXNzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdQYXJ0bmVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdTdGF0dXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1BheW1lbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0Ftb3VudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnSXRlbXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0Ym9keScsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcmRlcnMubWFwKChvcmRlciwgaSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogaSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBvcmRlci5vcmRlcklkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmN1c3RvbWVyTmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5waG9uZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5hZGRyZXNzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmRlbGl2ZXJ5UGFydG5lciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdHVzQmFkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyM2NjYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIuc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFBBWU1FTlRfQ09MT1JTW29yZGVyLnBheW1lbnRNZXRob2RdIHx8ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAnNnB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvcmRlci5wYXltZW50TWV0aG9kKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFNUQVRVU19DT0xPUlNbb3JkZXIucGF5bWVudFN0YXR1c10gfHwgJyM2NjYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIucGF5bWVudFN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBmb3JtYXRDdXJyZW5jeShvcmRlci5hbW91bnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6ICcjOWFhNWIxJywgbWFyZ2luUmlnaHQ6ICc4cHgnIH0gfSwgYCgke29yZGVyLml0ZW1Db3VudH0pYCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuaXRlbXMubWFwKChpdGVtLCBqKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBrZXk6IGosIHN0eWxlOiBzdHlsZXMuaXRlbVRhZyB9LCBpdGVtLmRpc3BsYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmRlcnNQYWdlO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgSW52b2ljZVJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9JbnZvaWNlUmVkaXJlY3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkludm9pY2VSZWRpcmVjdCA9IEludm9pY2VSZWRpcmVjdFxuaW1wb3J0IENTVlJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ1NWUmVkaXJlY3QgPSBDU1ZSZWRpcmVjdFxuaW1wb3J0IERlbGl2ZXJpZXNQYWdlIGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9EZWxpdmVyaWVzUGFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVsaXZlcmllc1BhZ2UgPSBEZWxpdmVyaWVzUGFnZVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBPcmRlcnNQYWdlIGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlcnNQYWdlID0gT3JkZXJzUGFnZSJdLCJuYW1lcyI6WyJJbnZvaWNlUmVkaXJlY3QiLCJwcm9wcyIsInJlY29yZCIsInJlc291cmNlIiwidXNlRWZmZWN0IiwiaWQiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInJlZGlyZWN0VXJsIiwiY29uc29sZSIsImxvZyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicGFkZGluZyIsInRleHRBbGlnbiIsImZvbnRGYW1pbHkiLCJjb2xvciIsIkNTVlJlZGlyZWN0IiwicmVzb3VyY2VJZCIsImV4cG9ydFVybCIsInN0eWxlcyIsImNvbnRhaW5lciIsImhlYWRlciIsIm1hcmdpbkJvdHRvbSIsInRpdGxlIiwiZm9udFNpemUiLCJmb250V2VpZ2h0Iiwic3VidGl0bGUiLCJjb250cm9scyIsImRpc3BsYXkiLCJnYXAiLCJhbGlnbkl0ZW1zIiwiZmxleFdyYXAiLCJkYXRlSW5wdXQiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwiYnRuIiwiY3Vyc29yIiwiYnRuQWN0aXZlIiwiYnRuU2Vjb25kYXJ5Iiwic3RhdHNSb3ciLCJzdGF0Q2FyZCIsInN0YXRWYWx1ZSIsInN0YXRMYWJlbCIsInRleHRUcmFuc2Zvcm0iLCJ0YWJsZUNhcmQiLCJvdmVyZmxvdyIsInRhYmxlIiwid2lkdGgiLCJib3JkZXJDb2xsYXBzZSIsInRoIiwiYm9yZGVyQm90dG9tIiwidGQiLCJ2ZXJ0aWNhbEFsaWduIiwic3RhdHVzQmFkZ2UiLCJpdGVtVGFnIiwibWFyZ2luUmlnaHQiLCJsb2FkZXIiLCJqdXN0aWZ5Q29udGVudCIsImhlaWdodCIsIm5vRGF0YSIsImRvd25sb2FkTGluayIsInRleHREZWNvcmF0aW9uIiwiU1RBVFVTX0NPTE9SUyIsInNjaGVkdWxlZCIsImRlbGl2ZXJlZCIsIm1pc3NlZCIsImNhbmNlbGxlZCIsIkRlbGl2ZXJpZXNQYWdlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ1c2VTdGF0ZSIsImRhdGEiLCJzZXREYXRhIiwic2VsZWN0ZWREYXRlIiwic2V0U2VsZWN0ZWREYXRlIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwic3BsaXQiLCJmZXRjaERlbGl2ZXJpZXMiLCJkYXRlIiwicmVzcG9uc2UiLCJmZXRjaCIsInJlc3VsdCIsImpzb24iLCJzdWNjZXNzIiwiZXJyIiwiZXJyb3IiLCJnb1RvUmVsYXRpdmUiLCJvZmZzZXQiLCJkIiwic2V0RGF0ZSIsImdldERhdGUiLCJmb3JtYXREYXRlIiwiZGF0ZVN0ciIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIndlZWtkYXkiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJpc1RvZGF5IiwidG9tb3Jyb3ciLCJpc1RvbW9ycm93IiwidmFsdWUiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJvbkNsaWNrIiwidG90YWwiLCJkZWxpdmVyaWVzIiwibGVuZ3RoIiwibWFwIiwiaSIsImtleSIsInN1YnNjcmlwdGlvbklkIiwiY3VzdG9tZXJOYW1lIiwicGhvbmUiLCJhZGRyZXNzIiwiZGVsaXZlcnlQYXJ0bmVyIiwic3RhdHVzIiwiaXRlbUNvdW50IiwiaXRlbXMiLCJpdGVtIiwiaiIsImRhc2hib2FyZCIsIm1pbkhlaWdodCIsInN0YXRzR3JpZCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJzdGF0SWNvbiIsImxldHRlclNwYWNpbmciLCJjaGFydHNHcmlkIiwiY2hhcnRDYXJkIiwiY2hhcnRUaXRsZSIsImNoYXJ0Q29udGFpbmVyIiwibWFyZ2luVG9wIiwiYmFyIiwidHJhbnNpdGlvbiIsImJhckxhYmVsIiwicGllQ29udGFpbmVyIiwibGVnZW5kSXRlbSIsImxlZ2VuZERvdCIsImxlZ2VuZFRleHQiLCJsZWdlbmRWYWx1ZSIsIm1hcmdpbkxlZnQiLCJxdWlja0FjdGlvbnMiLCJhY3Rpb25CdG4iLCJhY3RpdmUiLCJwZW5kaW5nIiwiZXhwaXJlZCIsImNvbmZpcm1lZCIsInByZXBhcmluZyIsInJlYWR5IiwiRGFzaGJvYXJkIiwic3RhdHMiLCJzZXRTdGF0cyIsInNldEVycm9yIiwiZmV0Y2hTdGF0cyIsImZvcm1hdEN1cnJlbmN5IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImN1cnJlbmN5IiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0IiwidG90YWxzIiwib3JkZXJzQnlTdGF0dXMiLCJzdWJzY3JpcHRpb25zQnlTdGF0dXMiLCJwYXltZW50cyIsInRvZGF5c0RlbGl2ZXJpZXMiLCJyZWNlbnRPcmRlcnMiLCJyZWNlbnRTdWJzY3JpcHRpb25zIiwibWF4U3Vic2NyaXB0aW9uQ291bnQiLCJNYXRoIiwibWF4IiwiT2JqZWN0IiwidmFsdWVzIiwibWF4T3JkZXJDb3VudCIsInRvTG9jYWxlU3RyaW5nIiwib3JkZXJzIiwic3Vic2NyaXB0aW9ucyIsImN1c3RvbWVycyIsInJldmVudWUiLCJ2ZXJpZmllZCIsImVudHJpZXMiLCJjb3VudCIsImZpbHRlciIsIl8iLCJvbmxpbmUiLCJjb2QiLCJwYWRkaW5nVG9wIiwiYm9yZGVyVG9wIiwib3JkZXIiLCJjdXN0b21lciIsImFtb3VudCIsInN1YiIsImJ0blByaW1hcnkiLCJzdGF0Q2FyZEFjdGl2ZSIsImJvcmRlckNvbG9yIiwiY2xlYXJCdG4iLCJhY2NlcHRlZCIsImF3YWl0Y29uZmlybWF0aW9uIiwiZmFpbGVkIiwiUEFZTUVOVF9DT0xPUlMiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJPcmRlcnNQYWdlIiwic2VsZWN0ZWRGaWx0ZXIiLCJzZXRTZWxlY3RlZEZpbHRlciIsImZldGNoT3JkZXJzIiwidXJsIiwic2V0RGF0ZVJlbGF0aXZlIiwiY2xlYXJGaWx0ZXJzIiwiZmlsdGVycyIsImxhYmVsIiwic3VtbWFyeSIsInVuYXNzaWduZWQiLCJwYWlkIiwicGxhY2Vob2xkZXIiLCJmIiwib3JkZXJJZCIsInBheW1lbnRNZXRob2QiLCJwYXltZW50U3RhdHVzIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBRUE7SUFDQTtJQUNBLE1BQU1BLGVBQWUsR0FBSUMsS0FBSyxJQUFLO01BQy9CLE1BQU07UUFBRUMsTUFBTTtJQUFFQyxJQUFBQTtJQUFTLEdBQUMsR0FBR0YsS0FB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
