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

    // Brand Colors
    const BRAND$1 = {
      primary: '#FF4700',
      primaryLight: '#FF6B33',
      primaryDark: '#CC3900',
      accentBlue: '#2196F3',
      card: '#303641',
      cardHover: '#3a4149',
      border: '#454d5d',
      textPrimary: '#fff',
      textSecondary: '#9aa5b1',
      success: '#4CAF50',
      danger: '#f44336'
    };

    // CSS Keyframe animations injected via style tag
    const injectStyles$1 = () => {
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
            border-color: ${BRAND$1.primary}40 !important;
        }
        .dashboard-btn {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .dashboard-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 20px ${BRAND$1.primary}40 !important;
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
            background: ${BRAND$1.cardHover} !important;
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
            color: ${BRAND$1.success} !important;
        }
        .growth-negative {
            color: ${BRAND$1.danger} !important;
        }
    `;
      document.head.appendChild(styleEl);
    };
    const styles$1 = {
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
        background: `linear-gradient(135deg, ${BRAND$1.textPrimary} 0%, ${BRAND$1.primary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      },
      subtitle: {
        color: BRAND$1.textSecondary,
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
        background: `linear-gradient(145deg, ${BRAND$1.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND$1.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
      },
      statCardHighlight: {
        background: `linear-gradient(145deg, ${BRAND$1.primary}20 0%, ${BRAND$1.primary}10 100%)`,
        border: `1px solid ${BRAND$1.primary}50`
      },
      statCardGlow: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle, ${BRAND$1.primary}20 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)'
      },
      statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: BRAND$1.textPrimary,
        marginBottom: '4px',
        position: 'relative',
        zIndex: 1
      },
      statLabel: {
        color: BRAND$1.textSecondary,
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
        color: BRAND$1.textPrimary,
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
        background: `linear-gradient(145deg, ${BRAND$1.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND$1.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      },
      chartTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: BRAND$1.textPrimary,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${BRAND$1.border}`
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
        color: BRAND$1.textSecondary,
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
        borderBottom: `1px solid ${BRAND$1.border}30`
      },
      listRank: {
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: BRAND$1.primary,
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
        color: BRAND$1.textPrimary,
        fontSize: '13px',
        fontWeight: '500'
      },
      listItemValue: {
        color: BRAND$1.primary,
        fontSize: '13px',
        fontWeight: '700'
      },
      tableCard: {
        background: `linear-gradient(145deg, ${BRAND$1.card} 0%, #282d35 100%)`,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${BRAND$1.border}`,
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
        color: BRAND$1.textSecondary,
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: `2px solid ${BRAND$1.border}`,
        fontWeight: '600'
      },
      td: {
        padding: '14px',
        color: BRAND$1.textPrimary,
        fontSize: '13px',
        borderBottom: `1px solid ${BRAND$1.border}40`
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
        color: BRAND$1.primary,
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
        background: `linear-gradient(135deg, ${BRAND$1.primary} 0%, ${BRAND$1.primaryDark} 100%)`,
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
        boxShadow: `0 4px 14px ${BRAND$1.primary}50`
      }};
    const STATUS_COLORS$1 = {
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
      const [stats, setStats] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);
      React.useEffect(() => {
        injectStyles$1();
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
      const formatCurrency = value => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(value || 0);
      };
      const formatNumber = value => {
        return new Intl.NumberFormat('en-IN').format(value || 0);
      };
      if (loading) {
        return /*#__PURE__*/React__default.default.createElement('div', {
          style: styles$1.loader
        }, /*#__PURE__*/React__default.default.createElement('span', null, '⏳ Loading Dashboard...'));
      }
      if (error) {
        return /*#__PURE__*/React__default.default.createElement('div', {
          style: {
            ...styles$1.loader,
            color: '#f44336'
          }
        }, `❌ Error: ${error}`);
      }
      if (!stats) {
        return /*#__PURE__*/React__default.default.createElement('div', {
          style: styles$1.loader
        }, 'No dashboard data available');
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
      return /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.dashboard
      },
      /*#__PURE__*/
      // Header
      React__default.default.createElement('div', {
        style: styles$1.header
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.title
      }, '📊 Sales Analytics Dashboard'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.subtitle
      }, `Last updated: ${new Date().toLocaleString('en-IN')}`)),
      /*#__PURE__*/
      // Quick Actions
      React__default.default.createElement('div', {
        style: styles$1.quickActions
      }, /*#__PURE__*/React__default.default.createElement('a', {
        href: '/admin/pages/ordersByDate',
        style: styles$1.actionBtn,
        className: 'dashboard-btn'
      }, '📅 Orders by Date'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/export/orders',
        style: styles$1.actionBtn,
        className: 'dashboard-btn'
      }, '📥 Export CSV'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/admin/resources/1_AllOrders',
        style: {
          ...styles$1.actionBtn,
          background: `linear-gradient(135deg, ${BRAND$1.accentBlue} 0%, #1976D2 100%)`
        },
        className: 'dashboard-btn'
      }, '📋 All Orders')),
      /*#__PURE__*/
      // Revenue Overview Section
      React__default.default.createElement('div', {
        style: {
          marginBottom: '24px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.sectionTitle
      }, '💰 Revenue Overview'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statsGrid
      },
      /*#__PURE__*/
      // Today's Revenue
      React__default.default.createElement('div', {
        style: {
          ...styles$1.statCard,
          ...styles$1.statCardHighlight
        },
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCardGlow
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.today)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, "Today's Revenue")),
      /*#__PURE__*/
      // This Week
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCardGlow
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.thisWeek)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'This Week')),
      /*#__PURE__*/
      // This Month
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCardGlow
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.thisMonth)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'This Month'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statChange,
        className: revenue.growthPercent >= 0 ? 'growth-positive' : 'growth-negative'
      }, revenue.growthPercent >= 0 ? '↑' : '↓', ` ${Math.abs(revenue.growthPercent)}% vs last month`)),
      /*#__PURE__*/
      // Today's Orders
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCardGlow
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, today.orders), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, "Today's Orders")))),
      /*#__PURE__*/
      // Key Metrics
      React__default.default.createElement('div', {
        style: {
          marginBottom: '24px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.sectionTitle
      }, '📈 Key Metrics'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statsGrid
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatNumber(totals.orders)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Total Orders')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatNumber(totals.customers)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Total Customers')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatNumber(totals.products)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Active Products')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatNumber(totals.branches)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Active Branches')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, payments.verified), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Delivered Orders')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, payments.pending), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'Pending/Active')))),
      /*#__PURE__*/
      // Charts Row
      React__default.default.createElement('div', {
        style: styles$1.chartsGrid
      },
      /*#__PURE__*/
      // Daily Revenue Chart
      React__default.default.createElement('div', {
        style: styles$1.chartCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '📊 Daily Revenue (Last 7 Days)'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartContainer
      }, dailyRevenue.slice(-7).map((d, idx) => /*#__PURE__*/React__default.default.createElement('div', {
        key: d.date,
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        className: 'dashboard-bar',
        style: {
          ...styles$1.bar,
          height: `${d.revenue / maxDailyRevenue * 110}px`,
          background: `linear-gradient(to top, ${BRAND$1.primary}, ${BRAND$1.primaryLight})`,
          minHeight: '20px'
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, new Date(d.date).toLocaleDateString('en-IN', {
        weekday: 'short'
      })), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: '#fff',
          fontWeight: '600'
        }
      }, `₹${(d.revenue / 1000).toFixed(0)}k`))))),
      /*#__PURE__*/
      // Order Status Chart
      React__default.default.createElement('div', {
        style: styles$1.chartCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '📈 Order Status'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartContainer
      }, Object.entries(ordersByStatus).filter(([_, count]) => count > 0).slice(0, 6).map(([status, count]) => /*#__PURE__*/React__default.default.createElement('div', {
        key: status,
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        className: 'dashboard-bar',
        style: {
          ...styles$1.bar,
          width: '45px',
          height: `${count / maxOrderCount * 110}px`,
          background: `linear-gradient(to top, ${STATUS_COLORS$1[status] || '#666'}, ${STATUS_COLORS$1[status] || '#666'}99)`,
          minHeight: '20px'
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, status.slice(0, 8)), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: '#fff',
          fontWeight: '600'
        }
      }, count))))),
      /*#__PURE__*/
      // Best Selling Products
      React__default.default.createElement('div', {
        style: styles$1.chartCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '🏆 Best Selling Products'), /*#__PURE__*/React__default.default.createElement('div', null, bestSellers.slice(0, 5).map((product, idx) => /*#__PURE__*/React__default.default.createElement('div', {
        key: idx,
        style: styles$1.listItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.listRank,
          background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : BRAND$1.primary
        }
      }, idx + 1), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItemName
      }, product.name.slice(0, 25) + (product.name.length > 25 ? '...' : '')), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItemValue
      }, `${product.quantity} sold`))))),
      /*#__PURE__*/
      // Branch Performance
      React__default.default.createElement('div', {
        style: styles$1.chartCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '🏢 Branch Performance'), /*#__PURE__*/React__default.default.createElement('div', null, branchPerformance.slice(0, 5).map((branch, idx) => /*#__PURE__*/React__default.default.createElement('div', {
        key: idx,
        style: styles$1.listItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.listRank,
          background: BRAND$1.accentBlue
        }
      }, idx + 1), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItemName
      }, branch.name), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItemValue
      }, formatCurrency(branch.revenue)))))),
      /*#__PURE__*/
      // Payment Methods
      React__default.default.createElement('div', {
        style: styles$1.chartCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '💳 Payment Methods'), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          padding: '12px 0'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#4CAF50'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontSize: '13px'
        }
      }, 'Online Payments')), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontWeight: '600'
        }
      }, payments.online)), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.listItem
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#FFC107'
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontSize: '13px'
        }
      }, 'Cash on Delivery')), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontWeight: '600'
        }
      }, payments.cod))))),
      /*#__PURE__*/
      // Recent Orders Table
      React__default.default.createElement('div', {
        style: styles$1.tableCard,
        className: 'dashboard-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.chartTitle
      }, '🧾 Recent Orders'), /*#__PURE__*/React__default.default.createElement('table', {
        style: styles$1.table
      }, /*#__PURE__*/React__default.default.createElement('thead', null, /*#__PURE__*/React__default.default.createElement('tr', null, /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Order ID'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Customer'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Branch'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Status'), /*#__PURE__*/React__default.default.createElement('th', {
        style: styles$1.th
      }, 'Amount'))), /*#__PURE__*/React__default.default.createElement('tbody', null, recentOrders.map(order => /*#__PURE__*/React__default.default.createElement('tr', {
        key: order.id,
        className: 'dashboard-row'
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles$1.td,
          fontWeight: '600',
          color: BRAND$1.primary
        }
      }, order.id), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, order.customer), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, order.branch), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles$1.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        className: 'dashboard-badge',
        style: {
          ...styles$1.statusBadge,
          background: `${STATUS_COLORS$1[order.status] || '#666'}20`,
          color: STATUS_COLORS$1[order.status] || '#fff',
          border: `1px solid ${STATUS_COLORS$1[order.status] || '#666'}50`
        }
      }, order.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles$1.td,
          fontWeight: '600'
        }
      }, formatCurrency(order.amount))))))));
    };

    // Brand Colors
    const BRAND = {
      primary: '#FF4700',
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
        count: data?.summary?.total,
        icon: '📊'
      }, {
        key: 'unassigned',
        label: 'Unassigned',
        count: data?.summary?.unassigned,
        icon: '⏳'
      }, {
        key: 'cod',
        label: 'COD',
        count: data?.summary?.cod,
        icon: '💵'
      }, {
        key: 'online',
        label: 'Online',
        count: data?.summary?.online,
        icon: '💳'
      }, {
        key: 'paid',
        label: 'Paid',
        count: data?.summary?.paid,
        icon: '✅'
      }, {
        key: 'pending',
        label: 'Pending',
        count: data?.summary?.pending,
        icon: '🔄'
      }, {
        key: 'delivered',
        label: 'Delivered',
        count: data?.summary?.delivered,
        icon: '📦'
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
      }, '📅 Orders by Date'), /*#__PURE__*/React__default.default.createElement('div', {
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
        className: 'orders-btn',
        placeholder: 'Select date'
      }), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(0),
        style: {
          ...styles.btn,
          ...(isToday ? styles.btnActive : {})
        },
        className: 'orders-btn'
      }, '📆 Today'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(-1),
        style: styles.btn,
        className: 'orders-btn'
      }, 'Yesterday'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: () => setDateRelative(-7),
        style: styles.btn,
        className: 'orders-btn'
      }, 'Last Week'), /*#__PURE__*/React__default.default.createElement('button', {
        onClick: clearFilters,
        style: styles.clearBtn,
        className: 'orders-btn'
      }, '✕ Clear All'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/api/v1/admin/export/orders',
        style: styles.downloadLink,
        className: 'orders-btn'
      }, '📥 Download CSV')),
      // Filter Stats
      data && /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statsRow
      }, filters.map(f => /*#__PURE__*/React__default.default.createElement('div', {
        key: f.key,
        style: styles.statCard,
        className: `stat-card-filter ${selectedFilter === f.key ? 'stat-card-active' : ''}`,
        onClick: () => setSelectedFilter(f.key)
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statValue
      }, f.count || 0), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.statLabel
      }, `${f.icon} ${f.label}`)))),
      // Table or Loading
      loading ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.loader
      }, '⏳ Loading orders...') : !data || data.orders.length === 0 ? /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.noData
      }, '📭 No orders found for this filter') : /*#__PURE__*/React__default.default.createElement('div', {
        style: styles.tableCard,
        className: 'orders-card'
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
        key: i,
        className: 'orders-row'
      }, /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles.td,
          fontWeight: '600',
          color: BRAND.primary
        }
      }, order.orderId), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.customerName), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.phone), /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles.td,
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, order.address), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, order.deliveryPartner || '—'), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: `${STATUS_COLORS[order.status] || '#666'}20`,
          color: STATUS_COLORS[order.status] || '#fff',
          border: `1px solid ${STATUS_COLORS[order.status] || '#666'}50`
        },
        className: 'orders-badge'
      }, order.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: `${PAYMENT_COLORS[order.paymentMethod] || '#666'}20`,
          color: PAYMENT_COLORS[order.paymentMethod] || '#fff',
          border: `1px solid ${PAYMENT_COLORS[order.paymentMethod] || '#666'}50`
        },
        className: 'orders-badge'
      }, order.paymentMethod), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.statusBadge,
          background: `${STATUS_COLORS[order.paymentStatus] || '#666'}20`,
          color: STATUS_COLORS[order.paymentStatus] || '#fff',
          border: `1px solid ${STATUS_COLORS[order.paymentStatus] || '#666'}50`
        },
        className: 'orders-badge'
      }, order.paymentStatus))), /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles.td,
          fontWeight: '600'
        }
      }, formatCurrency(order.amount)), /*#__PURE__*/React__default.default.createElement('td', {
        style: styles.td
      }, /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND.primary,
          marginRight: '8px',
          fontWeight: '600'
        }
      }, `(${order.itemCount})`), order.items.slice(0, 3).map((item, j) => /*#__PURE__*/React__default.default.createElement('span', {
        key: j,
        style: styles.itemTag
      }, item.display)), order.items.length > 3 && /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          ...styles.itemTag,
          background: BRAND.primary + '30',
          color: BRAND.primary
        }
      }, `+${order.items.length - 3}`))))))));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.InvoiceRedirect = InvoiceRedirect;
    AdminJS.UserComponents.CSVRedirect = CSVRedirect;
    AdminJS.UserComponents.Dashboard = Dashboard;
    AdminJS.UserComponents.OrdersPage = OrdersPage;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvSW52b2ljZVJlZGlyZWN0LmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdC5qc3giLCIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbi8vIFRoaXMgY29tcG9uZW50IHBlcmZvcm1zIGEgc2ltcGxlIGNsaWVudC1zaWRlIHJlZGlyZWN0IHRvIHRoZSBwcmVtaXVtIEhUTUwgaW52b2ljZS5cbi8vIEl0IGJ5cGFzc2VzIHRoZSBBZG1pbkpTIEFKQVggaGFuZGxpbmcgdG8gZW5zdXJlIGEgZnVsbCBwYWdlIGxvYWQgb2Ygb3VyIGN1c3RvbSB2aWV3LlxuY29uc3QgSW52b2ljZVJlZGlyZWN0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wcztcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLmlkKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHJlY29yZC5pZDtcbiAgICAgICAgICAgIC8vIERldGVybWluZSBpZiBpdCdzIGEgc3Vic2NyaXB0aW9uIG9yIG9yZGVyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gcmVzb3VyY2UuaWQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc3Vic2NyaXB0aW9uJykgPyAnc3Vic2NyaXB0aW9uJyA6ICdvcmRlcic7XG4gICAgICAgICAgICBjb25zdCByZWRpcmVjdFVybCA9IGAvYXBpL3YxL2FkbWluL3ByZXZpZXcvJHt0eXBlfS8ke2lkfWA7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDwn5qAIFJlZGlyZWN0aW5nIHRvIHByZW1pdW0gaW52b2ljZTogJHtyZWRpcmVjdFVybH1gKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3RVcmw7XG4gICAgICAgIH1cbiAgICB9LCBbcmVjb3JkLCByZXNvdXJjZV0pO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHBhZGRpbmc6ICc0MHB4JyxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnXG4gICAgICAgIH1cbiAgICB9LCAnUHJlcGFyaW5nIHlvdXIgcHJlbWl1bSBpbnZvaWNlLi4uJyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBJbnZvaWNlUmVkaXJlY3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBUaGlzIGNvbXBvbmVudCByZWRpcmVjdHMgdG8gQ1NWIGV4cG9ydCBlbmRwb2ludFxuY29uc3QgQ1NWUmVkaXJlY3QgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHJlc291cmNlIH0gPSBwcm9wcztcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIC8vIERldGVybWluZSBleHBvcnQgdHlwZSBiYXNlZCBvbiByZXNvdXJjZVxuICAgICAgICBjb25zdCByZXNvdXJjZUlkID0gcmVzb3VyY2UuaWQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IGV4cG9ydFVybCA9ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9vcmRlcnMnO1xuXG4gICAgICAgIGlmIChyZXNvdXJjZUlkLmluY2x1ZGVzKCdzdWJzY3JpcHRpb24nKSkge1xuICAgICAgICAgICAgZXhwb3J0VXJsID0gJy9hcGkvdjEvYWRtaW4vZXhwb3J0L3N1YnNjcmlwdGlvbnMnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYPCfk4ogUmVkaXJlY3RpbmcgdG8gQ1NWIGV4cG9ydDogJHtleHBvcnRVcmx9YCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZXhwb3J0VXJsO1xuICAgIH0sIFtyZXNvdXJjZV0pO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHBhZGRpbmc6ICc0MHB4JyxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICBjb2xvcjogJyM3NTc1NzUnXG4gICAgICAgIH1cbiAgICB9LCAnR2VuZXJhdGluZyBDU1YgcmVwb3J0Li4uJyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDU1ZSZWRpcmVjdDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBCcmFuZCBDb2xvcnNcbmNvbnN0IEJSQU5EID0ge1xuICAgIHByaW1hcnk6ICcjRkY0NzAwJyxcbiAgICBwcmltYXJ5TGlnaHQ6ICcjRkY2QjMzJyxcbiAgICBwcmltYXJ5RGFyazogJyNDQzM5MDAnLFxuICAgIGFjY2VudDogJyM0Q0FGNTAnLFxuICAgIGFjY2VudEJsdWU6ICcjMjE5NkYzJyxcbiAgICBkYXJrOiAnIzFlMjIyNicsXG4gICAgY2FyZDogJyMzMDM2NDEnLFxuICAgIGNhcmRIb3ZlcjogJyMzYTQxNDknLFxuICAgIGJvcmRlcjogJyM0NTRkNWQnLFxuICAgIHRleHRQcmltYXJ5OiAnI2ZmZicsXG4gICAgdGV4dFNlY29uZGFyeTogJyM5YWE1YjEnLFxuICAgIHN1Y2Nlc3M6ICcjNENBRjUwJyxcbiAgICB3YXJuaW5nOiAnI0ZGQzEwNycsXG4gICAgZGFuZ2VyOiAnI2Y0NDMzNidcbn07XG5cbi8vIENTUyBLZXlmcmFtZSBhbmltYXRpb25zIGluamVjdGVkIHZpYSBzdHlsZSB0YWdcbmNvbnN0IGluamVjdFN0eWxlcyA9ICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rhc2hib2FyZC1hbmltYXRpb25zJykpIHJldHVybjtcbiAgICBjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsLmlkID0gJ2Rhc2hib2FyZC1hbmltYXRpb25zJztcbiAgICBzdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGVJblVwIHtcbiAgICAgICAgICAgIGZyb20geyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7IH1cbiAgICAgICAgICAgIHRvIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApOyB9XG4gICAgICAgIH1cbiAgICAgICAgQGtleWZyYW1lcyBwdWxzZSB7XG4gICAgICAgICAgICAwJSwgMTAwJSB7IHRyYW5zZm9ybTogc2NhbGUoMSk7IH1cbiAgICAgICAgICAgIDUwJSB7IHRyYW5zZm9ybTogc2NhbGUoMS4wMik7IH1cbiAgICAgICAgfVxuICAgICAgICBAa2V5ZnJhbWVzIHNoaW1tZXIge1xuICAgICAgICAgICAgMCUgeyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMjAwJSAwOyB9XG4gICAgICAgICAgICAxMDAlIHsgYmFja2dyb3VuZC1wb3NpdGlvbjogMjAwJSAwOyB9XG4gICAgICAgIH1cbiAgICAgICAgQGtleWZyYW1lcyBiYXJHcm93IHtcbiAgICAgICAgICAgIGZyb20geyBoZWlnaHQ6IDA7IH1cbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWNhcmQge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtY2FyZDpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTJweCAyNHB4IHJnYmEoMCwwLDAsMC4zKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAke0JSQU5ELnByaW1hcnl9NDAgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJ0biB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4yNXMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJ0bjpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggJHtCUkFORC5wcmltYXJ5fTQwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG46YWN0aXZlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYnRuOjphZnRlciB7XG4gICAgICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogNTAlO1xuICAgICAgICAgICAgbGVmdDogNTAlO1xuICAgICAgICAgICAgd2lkdGg6IDA7XG4gICAgICAgICAgICBoZWlnaHQ6IDA7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMik7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuNnMsIGhlaWdodCAwLjZzO1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYnRuOmhvdmVyOjphZnRlciB7XG4gICAgICAgICAgICB3aWR0aDogMzAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDMwMHB4O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYmFyIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYmFyR3JvdyAwLjhzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgZm9yd2FyZHM7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1iYXI6aG92ZXIge1xuICAgICAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMikgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGVZKDEuMDUpO1xuICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogYm90dG9tO1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtcm93IHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLXJvdzpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAke0JSQU5ELmNhcmRIb3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuc3RhdC12YWx1ZSB7XG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGVJblVwIDAuNXMgZWFzZS1vdXQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1iYWRnZSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1iYWRnZTpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAubGVnZW5kLWl0ZW0ge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgbWFyZ2luOiAtOHB4O1xuICAgICAgICB9XG4gICAgICAgIC5sZWdlbmQtaXRlbTpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDUpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmdyb3d0aC1wb3NpdGl2ZSB7XG4gICAgICAgICAgICBjb2xvcjogJHtCUkFORC5zdWNjZXNzfSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5ncm93dGgtbmVnYXRpdmUge1xuICAgICAgICAgICAgY29sb3I6ICR7QlJBTkQuZGFuZ2VyfSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgYDtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xufTtcblxuY29uc3Qgc3R5bGVzID0ge1xuICAgIGRhc2hib2FyZDoge1xuICAgICAgICBwYWRkaW5nOiAnMjhweCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIG1pbkhlaWdodDogJzEwMHZoJyxcbiAgICAgICAgZm9udEZhbWlseTogXCInSW50ZXInLCAnUm9ib3RvJywgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmXCJcbiAgICB9LFxuICAgIGhlYWRlcjoge1xuICAgICAgICBtYXJnaW5Cb3R0b206ICcyOHB4JyxcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZUluVXAgMC42cyBlYXNlLW91dCdcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjhweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC50ZXh0UHJpbWFyeX0gMCUsICR7QlJBTkQucHJpbWFyeX0gMTAwJSlgLFxuICAgICAgICBXZWJraXRCYWNrZ3JvdW5kQ2xpcDogJ3RleHQnLFxuICAgICAgICBXZWJraXRUZXh0RmlsbENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBiYWNrZ3JvdW5kQ2xpcDogJ3RleHQnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICcxMnB4J1xuICAgIH0sXG4gICAgc3VidGl0bGU6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjNweCdcbiAgICB9LFxuICAgIHN0YXRzR3JpZDoge1xuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgxODBweCwgMWZyKSknLFxuICAgICAgICBnYXA6ICcxNnB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCdcbiAgICB9LFxuICAgIHN0YXRDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4JyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjE1KScsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICB9LFxuICAgIHN0YXRDYXJkSGlnaGxpZ2h0OiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELnByaW1hcnl9MjAgMCUsICR7QlJBTkQucHJpbWFyeX0xMCAxMDAlKWAsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELnByaW1hcnl9NTBgXG4gICAgfSxcbiAgICBzdGF0Q2FyZEdsb3c6IHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIHdpZHRoOiAnODBweCcsXG4gICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSwgJHtCUkFORC5wcmltYXJ5fTIwIDAlLCB0cmFuc3BhcmVudCA3MCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDMwJSwgLTMwJSknXG4gICAgfSxcbiAgICBzdGF0VmFsdWU6IHtcbiAgICAgICAgZm9udFNpemU6ICcyOHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNHB4JyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIHpJbmRleDogMVxuICAgIH0sXG4gICAgc3RhdExhYmVsOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzFweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBzdGF0Q2hhbmdlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBtYXJnaW5Ub3A6ICc4cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICc0cHgnXG4gICAgfSxcbiAgICBzZWN0aW9uVGl0bGU6IHtcbiAgICAgICAgZm9udFNpemU6ICcxNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzEwcHgnXG4gICAgfSxcbiAgICBjaGFydHNHcmlkOiB7XG4gICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDMyMHB4LCAxZnIpKScsXG4gICAgICAgIGdhcDogJzIwcHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4J1xuICAgIH0sXG4gICAgY2hhcnRDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4JyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjE1KSdcbiAgICB9LFxuICAgIGNoYXJ0VGl0bGU6IHtcbiAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzhweCcsXG4gICAgICAgIHBhZGRpbmdCb3R0b206ICcxMnB4JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWBcbiAgICB9LFxuICAgIGNoYXJ0Q29udGFpbmVyOiB7XG4gICAgICAgIGhlaWdodDogJzE0MHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICBnYXA6ICcxMnB4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1hcm91bmQnLFxuICAgICAgICBtYXJnaW5Ub3A6ICcxNnB4JyxcbiAgICAgICAgcGFkZGluZzogJzAgOHB4J1xuICAgIH0sXG4gICAgYmFyOiB7XG4gICAgICAgIHdpZHRoOiAnNTBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzZweCA2cHggMCAwJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCAtNHB4IDEycHggcmdiYSgwLDAsMCwwLjIpJ1xuICAgIH0sXG4gICAgYmFyTGFiZWw6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIG1hcmdpblRvcDogJzhweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBsaXN0SXRlbToge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBwYWRkaW5nOiAnMTJweCAwJyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfTMwYFxuICAgIH0sXG4gICAgbGlzdFJhbms6IHtcbiAgICAgICAgd2lkdGg6ICcyNHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnMjRweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgIGJhY2tncm91bmQ6IEJSQU5ELnByaW1hcnksXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIG1hcmdpblJpZ2h0OiAnMTJweCdcbiAgICB9LFxuICAgIGxpc3RJdGVtTmFtZToge1xuICAgICAgICBmbGV4OiAxLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBsaXN0SXRlbVZhbHVlOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJ1xuICAgIH0sXG4gICAgdGFibGVDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4JyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjE1KScsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzIwcHgnLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICB9LFxuICAgIHRhYmxlOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJvcmRlckNvbGxhcHNlOiAnc2VwYXJhdGUnLFxuICAgICAgICBib3JkZXJTcGFjaW5nOiAnMCdcbiAgICB9LFxuICAgIHRoOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgICAgICBwYWRkaW5nOiAnMTJweCAxNHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMXB4JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMnB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnXG4gICAgfSxcbiAgICB0ZDoge1xuICAgICAgICBwYWRkaW5nOiAnMTRweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfTQwYFxuICAgIH0sXG4gICAgc3RhdHVzQmFkZ2U6IHtcbiAgICAgICAgcGFkZGluZzogJzVweCAxMHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuNXB4JyxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICB9LFxuICAgIGxvYWRlcjoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMThweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBxdWlja0FjdGlvbnM6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBnYXA6ICcxMnB4JyxcbiAgICAgICAgZmxleFdyYXA6ICd3cmFwJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCdcbiAgICB9LFxuICAgIGFjdGlvbkJ0bjoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC5wcmltYXJ5fSAwJSwgJHtCUkFORC5wcmltYXJ5RGFya30gMTAwJSlgLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMjBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICc2cHgnLFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxNHB4ICR7QlJBTkQucHJpbWFyeX01MGBcbiAgICB9LFxuICAgIHJldmVudWVHcmlkOiB7XG4gICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdCg0LCAxZnIpJyxcbiAgICAgICAgZ2FwOiAnMTJweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCdcbiAgICB9LFxuICAgIHJldmVudWVJdGVtOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIHBhZGRpbmc6ICcxMnB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogYCR7QlJBTkQuZGFya304MGAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnXG4gICAgfSxcbiAgICByZXZlbnVlVmFsdWU6IHtcbiAgICAgICAgZm9udFNpemU6ICcxNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeVxuICAgIH0sXG4gICAgcmV2ZW51ZUxhYmVsOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbWFyZ2luVG9wOiAnNHB4J1xuICAgIH1cbn07XG5cbmNvbnN0IFNUQVRVU19DT0xPUlMgPSB7XG4gICAgYWN0aXZlOiAnIzRDQUY1MCcsXG4gICAgcGVuZGluZzogJyNGRkMxMDcnLFxuICAgIGV4cGlyZWQ6ICcjZjQ0MzM2JyxcbiAgICBjYW5jZWxsZWQ6ICcjOWU5ZTllJyxcbiAgICBkZWxpdmVyZWQ6ICcjNENBRjUwJyxcbiAgICBjb25maXJtZWQ6ICcjMjE5NkYzJyxcbiAgICBwcmVwYXJpbmc6ICcjRkY5ODAwJyxcbiAgICByZWFkeTogJyMwMEJDRDQnLFxuICAgIGFjY2VwdGVkOiAnIzIxOTZGMycsXG4gICAgJ2luLXByb2dyZXNzJzogJyNGRjk4MDAnLFxuICAgICdhd2FpdGNvbmZpcm1hdGlvbic6ICcjOUMyN0IwJ1xufTtcblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IFtzdGF0cywgc2V0U3RhdHNdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGluamVjdFN0eWxlcygpO1xuICAgICAgICBmZXRjaFN0YXRzKCk7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hTdGF0cyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvdjEvYWRtaW4vZGFzaGJvYXJkL3N0YXRzJyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHNldFN0YXRzKGRhdGEuZGF0YSB8fCB7fSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZldGNoIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICBzZXRFcnJvcignRmFpbGVkIHRvIGZldGNoIGRhc2hib2FyZCBkYXRhJyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1JTicsIHtcbiAgICAgICAgICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgICAgICAgICAgY3VycmVuY3k6ICdJTlInLFxuICAgICAgICAgICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwXG4gICAgICAgIH0pLmZvcm1hdCh2YWx1ZSB8fCAwKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUlOJykuZm9ybWF0KHZhbHVlIHx8IDApO1xuICAgIH07XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxvYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIG51bGwsICfij7MgTG9hZGluZyBEYXNoYm9hcmQuLi4nKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMubG9hZGVyLCBjb2xvcjogJyNmNDQzMzYnIH0gfSxcbiAgICAgICAgICAgIGDinYwgRXJyb3I6ICR7ZXJyb3J9YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghc3RhdHMpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSwgJ05vIGRhc2hib2FyZCBkYXRhIGF2YWlsYWJsZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFscyA9IHN0YXRzLnRvdGFscyB8fCB7fTtcbiAgICBjb25zdCB0b2RheSA9IHN0YXRzLnRvZGF5IHx8IHt9O1xuICAgIGNvbnN0IHJldmVudWUgPSBzdGF0cy5yZXZlbnVlIHx8IHt9O1xuICAgIGNvbnN0IGNoYXJ0cyA9IHN0YXRzLmNoYXJ0cyB8fCB7fTtcbiAgICBjb25zdCBiZXN0U2VsbGVycyA9IHN0YXRzLmJlc3RTZWxsZXJzIHx8IFtdO1xuICAgIGNvbnN0IGJyYW5jaFBlcmZvcm1hbmNlID0gc3RhdHMuYnJhbmNoUGVyZm9ybWFuY2UgfHwgW107XG4gICAgY29uc3Qgb3JkZXJzQnlTdGF0dXMgPSBzdGF0cy5vcmRlcnNCeVN0YXR1cyB8fCB7fTtcbiAgICBjb25zdCBwYXltZW50cyA9IHN0YXRzLnBheW1lbnRzIHx8IHt9O1xuICAgIGNvbnN0IHJlY2VudE9yZGVycyA9IHN0YXRzLnJlY2VudE9yZGVycyB8fCBbXTtcblxuICAgIGNvbnN0IGRhaWx5UmV2ZW51ZSA9IGNoYXJ0cy5kYWlseVJldmVudWUgfHwgW107XG4gICAgY29uc3QgbWF4RGFpbHlSZXZlbnVlID0gTWF0aC5tYXgoLi4uZGFpbHlSZXZlbnVlLm1hcChkID0+IGQucmV2ZW51ZSB8fCAwKSwgMSk7XG5cbiAgICBjb25zdCBvcmRlckNvdW50cyA9IE9iamVjdC52YWx1ZXMob3JkZXJzQnlTdGF0dXMpO1xuICAgIGNvbnN0IG1heE9yZGVyQ291bnQgPSBNYXRoLm1heCguLi4ob3JkZXJDb3VudHMubGVuZ3RoID4gMCA/IG9yZGVyQ291bnRzIDogWzFdKSwgMSk7XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmRhc2hib2FyZCB9LFxuICAgICAgICAvLyBIZWFkZXJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmhlYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRpdGxlIH0sICfwn5OKIFNhbGVzIEFuYWx5dGljcyBEYXNoYm9hcmQnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdWJ0aXRsZSB9LFxuICAgICAgICAgICAgICAgIGBMYXN0IHVwZGF0ZWQ6ICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUXVpY2sgQWN0aW9uc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMucXVpY2tBY3Rpb25zIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYWRtaW4vcGFnZXMvb3JkZXJzQnlEYXRlJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmFjdGlvbkJ0bixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYnRuJ1xuICAgICAgICAgICAgfSwgJ/Cfk4UgT3JkZXJzIGJ5IERhdGUnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2EnLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogJy9hcGkvdjEvYWRtaW4vZXhwb3J0L29yZGVycycsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5hY3Rpb25CdG4sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWJ0bidcbiAgICAgICAgICAgIH0sICfwn5OlIEV4cG9ydCBDU1YnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2EnLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogJy9hZG1pbi9yZXNvdXJjZXMvMV9BbGxPcmRlcnMnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7IC4uLnN0eWxlcy5hY3Rpb25CdG4sIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELmFjY2VudEJsdWV9IDAlLCAjMTk3NkQyIDEwMCUpYCB9LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1idG4nXG4gICAgICAgICAgICB9LCAn8J+TiyBBbGwgT3JkZXJzJylcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBSZXZlbnVlIE92ZXJ2aWV3IFNlY3Rpb25cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBtYXJnaW5Cb3R0b206ICcyNHB4JyB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc2VjdGlvblRpdGxlIH0sICfwn5KwIFJldmVudWUgT3ZlcnZpZXcnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0c0dyaWQgfSxcbiAgICAgICAgICAgICAgICAvLyBUb2RheSdzIFJldmVudWVcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5zdGF0Q2FyZCwgLi4uc3R5bGVzLnN0YXRDYXJkSGlnaGxpZ2h0IH0sIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmRHbG93IH0pLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRvZGF5KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgXCJUb2RheSdzIFJldmVudWVcIilcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIC8vIFRoaXMgV2Vla1xuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZEdsb3cgfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIGZvcm1hdEN1cnJlbmN5KHJldmVudWUudGhpc1dlZWspKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVGhpcyBXZWVrJylcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIC8vIFRoaXMgTW9udGhcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmRHbG93IH0pLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRoaXNNb250aCkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdUaGlzIE1vbnRoJyksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuc3RhdENoYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogcmV2ZW51ZS5ncm93dGhQZXJjZW50ID49IDAgPyAnZ3Jvd3RoLXBvc2l0aXZlJyA6ICdncm93dGgtbmVnYXRpdmUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlbnVlLmdyb3d0aFBlcmNlbnQgPj0gMCA/ICfihpEnIDogJ+KGkycsXG4gICAgICAgICAgICAgICAgICAgICAgICBgICR7TWF0aC5hYnMocmV2ZW51ZS5ncm93dGhQZXJjZW50KX0lIHZzIGxhc3QgbW9udGhgXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIC8vIFRvZGF5J3MgT3JkZXJzXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkR2xvdyB9KSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgdG9kYXkub3JkZXJzKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCBcIlRvZGF5J3MgT3JkZXJzXCIpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIEtleSBNZXRyaWNzXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgbWFyZ2luQm90dG9tOiAnMjRweCcgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnNlY3Rpb25UaXRsZSB9LCAn8J+TiCBLZXkgTWV0cmljcycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRzR3JpZCB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIGZvcm1hdE51bWJlcih0b3RhbHMub3JkZXJzKSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1RvdGFsIE9yZGVycycpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXROdW1iZXIodG90YWxzLmN1c3RvbWVycykpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdUb3RhbCBDdXN0b21lcnMnKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgZm9ybWF0TnVtYmVyKHRvdGFscy5wcm9kdWN0cykpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdBY3RpdmUgUHJvZHVjdHMnKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgZm9ybWF0TnVtYmVyKHRvdGFscy5icmFuY2hlcykpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdBY3RpdmUgQnJhbmNoZXMnKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgcGF5bWVudHMudmVyaWZpZWQpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdEZWxpdmVyZWQgT3JkZXJzJylcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIHBheW1lbnRzLnBlbmRpbmcpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdQZW5kaW5nL0FjdGl2ZScpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIENoYXJ0cyBSb3dcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0c0dyaWQgfSxcbiAgICAgICAgICAgIC8vIERhaWx5IFJldmVudWUgQ2hhcnRcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn5OKIERhaWx5IFJldmVudWUgKExhc3QgNyBEYXlzKScpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENvbnRhaW5lciB9LFxuICAgICAgICAgICAgICAgICAgICBkYWlseVJldmVudWUuc2xpY2UoLTcpLm1hcCgoZCwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBrZXk6IGQuZGF0ZSwgc3R5bGU6IHsgdGV4dEFsaWduOiAnY2VudGVyJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYmFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5iYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGAkeyhkLnJldmVudWUgLyBtYXhEYWlseVJldmVudWUpICogMTEwfXB4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQodG8gdG9wLCAke0JSQU5ELnByaW1hcnl9LCAke0JSQU5ELnByaW1hcnlMaWdodH0pYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzIwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuYmFyTGFiZWwgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoZC5kYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyB3ZWVrZGF5OiAnc2hvcnQnIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5iYXJMYWJlbCwgY29sb3I6ICcjZmZmJywgZm9udFdlaWdodDogJzYwMCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBg4oK5JHsoZC5yZXZlbnVlIC8gMTAwMCkudG9GaXhlZCgwKX1rYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIE9yZGVyIFN0YXR1cyBDaGFydFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/Cfk4ggT3JkZXIgU3RhdHVzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q29udGFpbmVyIH0sXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG9yZGVyc0J5U3RhdHVzKS5maWx0ZXIoKFtfLCBjb3VudF0pID0+IGNvdW50ID4gMCkuc2xpY2UoMCwgNikubWFwKChbc3RhdHVzLCBjb3VudF0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGtleTogc3RhdHVzLCBzdHlsZTogeyB0ZXh0QWxpZ246ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1iYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLmJhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnNDVweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGAkeyhjb3VudCAvIG1heE9yZGVyQ291bnQpICogMTEwfXB4YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQodG8gdG9wLCAke1NUQVRVU19DT0xPUlNbc3RhdHVzXSB8fCAnIzY2Nid9LCAke1NUQVRVU19DT0xPUlNbc3RhdHVzXSB8fCAnIzY2Nid9OTkpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzIwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuYmFyTGFiZWwgfSwgc3RhdHVzLnNsaWNlKDAsIDgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5iYXJMYWJlbCwgY29sb3I6ICcjZmZmJywgZm9udFdlaWdodDogJzYwMCcgfSB9LCBjb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIEJlc3QgU2VsbGluZyBQcm9kdWN0c1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/Cfj4YgQmVzdCBTZWxsaW5nIFByb2R1Y3RzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYmVzdFNlbGxlcnMuc2xpY2UoMCwgNSkubWFwKChwcm9kdWN0LCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGtleTogaWR4LCBzdHlsZTogc3R5bGVzLmxpc3RJdGVtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMubGlzdFJhbmssIGJhY2tncm91bmQ6IGlkeCA9PT0gMCA/ICcjRkZENzAwJyA6IGlkeCA9PT0gMSA/ICcjQzBDMEMwJyA6IGlkeCA9PT0gMiA/ICcjQ0Q3RjMyJyA6IEJSQU5ELnByaW1hcnkgfSB9LCBpZHggKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubGlzdEl0ZW1OYW1lIH0sIHByb2R1Y3QubmFtZS5zbGljZSgwLCAyNSkgKyAocHJvZHVjdC5uYW1lLmxlbmd0aCA+IDI1ID8gJy4uLicgOiAnJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbVZhbHVlIH0sIGAke3Byb2R1Y3QucXVhbnRpdHl9IHNvbGRgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gQnJhbmNoIFBlcmZvcm1hbmNlXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRUaXRsZSB9LCAn8J+PoiBCcmFuY2ggUGVyZm9ybWFuY2UnKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBicmFuY2hQZXJmb3JtYW5jZS5zbGljZSgwLCA1KS5tYXAoKGJyYW5jaCwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBrZXk6IGlkeCwgc3R5bGU6IHN0eWxlcy5saXN0SXRlbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxpc3RSYW5rLCBiYWNrZ3JvdW5kOiBCUkFORC5hY2NlbnRCbHVlIH0gfSwgaWR4ICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtTmFtZSB9LCBicmFuY2gubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtVmFsdWUgfSwgZm9ybWF0Q3VycmVuY3koYnJhbmNoLnJldmVudWUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gUGF5bWVudCBNZXRob2RzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRUaXRsZSB9LCAn8J+SsyBQYXltZW50IE1ldGhvZHMnKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IHBhZGRpbmc6ICcxMnB4IDAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgd2lkdGg6ICcxMHB4JywgaGVpZ2h0OiAnMTBweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6ICcjNENBRjUwJyB9IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSwgZm9udFNpemU6ICcxM3B4JyB9IH0sICdPbmxpbmUgUGF5bWVudHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBwYXltZW50cy5vbmxpbmUpXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IHdpZHRoOiAnMTBweCcsIGhlaWdodDogJzEwcHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiAnI0ZGQzEwNycgfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksIGZvbnRTaXplOiAnMTNweCcgfSB9LCAnQ2FzaCBvbiBEZWxpdmVyeScpXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LCBmb250V2VpZ2h0OiAnNjAwJyB9IH0sIHBheW1lbnRzLmNvZClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBSZWNlbnQgT3JkZXJzIFRhYmxlXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50YWJsZUNhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/Cfp74gUmVjZW50IE9yZGVycycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGFibGUnLCB7IHN0eWxlOiBzdHlsZXMudGFibGUgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aGVhZCcsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RyJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdPcmRlciBJRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0N1c3RvbWVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQnJhbmNoJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnU3RhdHVzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQW1vdW50JylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGJvZHknLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICByZWNlbnRPcmRlcnMubWFwKG9yZGVyID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIHsga2V5OiBvcmRlci5pZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLXJvdycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLnRkLCBmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6IEJSQU5ELnByaW1hcnkgfSB9LCBvcmRlci5pZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIuY3VzdG9tZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmJyYW5jaCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1iYWRnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyM2NjYnfTIwYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogU1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyM2NjYnfTUwYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvcmRlci5zdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLnRkLCBmb250V2VpZ2h0OiAnNjAwJyB9IH0sIGZvcm1hdEN1cnJlbmN5KG9yZGVyLmFtb3VudCkpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbi8vIEJyYW5kIENvbG9yc1xuY29uc3QgQlJBTkQgPSB7XG4gICAgcHJpbWFyeTogJyNGRjQ3MDAnLFxuICAgIHByaW1hcnlMaWdodDogJyNGRjZCMzMnLFxuICAgIHByaW1hcnlEYXJrOiAnI0NDMzkwMCcsXG4gICAgYWNjZW50OiAnIzRDQUY1MCcsXG4gICAgY2FyZDogJyMzMDM2NDEnLFxuICAgIGNhcmRIb3ZlcjogJyMzYTQxNDknLFxuICAgIGJvcmRlcjogJyM0NTRkNWQnLFxuICAgIHRleHRQcmltYXJ5OiAnI2ZmZicsXG4gICAgdGV4dFNlY29uZGFyeTogJyM5YWE1YjEnXG59O1xuXG4vLyBDU1MgS2V5ZnJhbWUgYW5pbWF0aW9uc1xuY29uc3QgaW5qZWN0U3R5bGVzID0gKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3JkZXJzLXBhZ2UtYW5pbWF0aW9ucycpKSByZXR1cm47XG4gICAgY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbC5pZCA9ICdvcmRlcnMtcGFnZS1hbmltYXRpb25zJztcbiAgICBzdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGVJblVwIHtcbiAgICAgICAgICAgIGZyb20geyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7IH1cbiAgICAgICAgICAgIHRvIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApOyB9XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1jYXJkIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWNhcmQ6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEycHggMjRweCByZ2JhKDAsMCwwLDAuMykgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJHtCUkFORC5wcmltYXJ5fTQwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1idG4ge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1idG46aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDZweCAxNnB4IHJnYmEoMCwwLDAsMC4zKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtYnRuOmFjdGl2ZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLXJvdyB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1yb3c6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJHtCUkFORC5jYXJkSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLnN0YXQtY2FyZC1maWx0ZXIge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5zdGF0LWNhcmQtZmlsdGVyOmhvdmVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wMikgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJHtCUkFORC5wcmltYXJ5fTYwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLnN0YXQtY2FyZC1hY3RpdmUge1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAke0JSQU5ELnByaW1hcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMjBweCAke0JSQU5ELnByaW1hcnl9MzAgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWJhZGdlIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWJhZGdlOmhvdmVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4xKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgYDtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xufTtcblxuY29uc3Qgc3R5bGVzID0ge1xuICAgIGNvbnRhaW5lcjoge1xuICAgICAgICBwYWRkaW5nOiAnMjhweCcsXG4gICAgICAgIGZvbnRGYW1pbHk6IFwiJ0ludGVyJywgJ1JvYm90bycsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZlwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBtaW5IZWlnaHQ6ICcxMDB2aCdcbiAgICB9LFxuICAgIGhlYWRlcjoge1xuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4JyxcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZUluVXAgMC42cyBlYXNlLW91dCdcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjhweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC50ZXh0UHJpbWFyeX0gMCUsICR7QlJBTkQucHJpbWFyeX0gMTAwJSlgLFxuICAgICAgICBXZWJraXRCYWNrZ3JvdW5kQ2xpcDogJ3RleHQnLFxuICAgICAgICBXZWJraXRUZXh0RmlsbENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBiYWNrZ3JvdW5kQ2xpcDogJ3RleHQnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgfSxcbiAgICBzdWJ0aXRsZToge1xuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuM3B4J1xuICAgIH0sXG4gICAgY29udHJvbHM6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBnYXA6ICcxNHB4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnLFxuICAgICAgICBmbGV4V3JhcDogJ3dyYXAnXG4gICAgfSxcbiAgICBkYXRlSW5wdXQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxNDVkZWcsICR7QlJBTkQuY2FyZH0gMCUsICMyODJkMzUgMTAwJSlgLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnXG4gICAgfSxcbiAgICBidG46IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxNDVkZWcsICR7QlJBTkQuY2FyZH0gMCUsICMyODJkMzUgMTAwJSlgLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4J1xuICAgIH0sXG4gICAgYnRuQWN0aXZlOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELnByaW1hcnl9IDAlLCAke0JSQU5ELnByaW1hcnlEYXJrfSAxMDAlKWAsXG4gICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxNHB4ICR7QlJBTkQucHJpbWFyeX01MGBcbiAgICB9LFxuICAgIGJ0blByaW1hcnk6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQucHJpbWFyeX0gMCUsICR7QlJBTkQucHJpbWFyeURhcmt9IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgIGJveFNoYWRvdzogYDAgNHB4IDE0cHggJHtCUkFORC5wcmltYXJ5fTUwYFxuICAgIH0sXG4gICAgc3RhdHNSb3c6IHtcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMTIwcHgsIDFmcikpJyxcbiAgICAgICAgZ2FwOiAnMTRweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgfSxcbiAgICBzdGF0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE0cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMTZweCAyMHB4JyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gICAgfSxcbiAgICBzdGF0VmFsdWU6IHtcbiAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNHB4J1xuICAgIH0sXG4gICAgc3RhdExhYmVsOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuNXB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCdcbiAgICB9LFxuICAgIHRhYmxlQ2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xNSknXG4gICAgfSxcbiAgICB0YWJsZToge1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBib3JkZXJDb2xsYXBzZTogJ3NlcGFyYXRlJyxcbiAgICAgICAgYm9yZGVyU3BhY2luZzogJzAnXG4gICAgfSxcbiAgICB0aDoge1xuICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgcGFkZGluZzogJzE2cHggMThweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzFweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDJweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsMC4yKSdcbiAgICB9LFxuICAgIHRkOiB7XG4gICAgICAgIHBhZGRpbmc6ICcxNnB4IDE4cHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn00MGAsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnXG4gICAgfSxcbiAgICBzdGF0dXNCYWRnZToge1xuICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcyMHB4JyxcbiAgICAgICAgZm9udFNpemU6ICcxMHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC41cHgnLFxuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJ1xuICAgIH0sXG4gICAgaXRlbVRhZzoge1xuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgYmFja2dyb3VuZDogYCR7QlJBTkQuYm9yZGVyfTgwYCxcbiAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgbWFyZ2luUmlnaHQ6ICc2cHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc2cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgbG9hZGVyOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgaGVpZ2h0OiAnMzAwcHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQucHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCdcbiAgICB9LFxuICAgIG5vRGF0YToge1xuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBwYWRkaW5nOiAnNjBweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE2cHgnXG4gICAgfSxcbiAgICBkb3dubG9hZExpbms6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQuYWNjZW50fSAwJSwgIzM4OEUzQyAxMDAlKWAsXG4gICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgIHBhZGRpbmc6ICcxMnB4IDIwcHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGJveFNoYWRvdzogYDAgNHB4IDE0cHggJHtCUkFORC5hY2NlbnR9NTBgLFxuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnOHB4J1xuICAgIH0sXG4gICAgY2xlYXJCdG46IHtcbiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH1cbn07XG5cbmNvbnN0IFNUQVRVU19DT0xPUlMgPSB7XG4gICAgcGVuZGluZzogJyNGRkMxMDcnLFxuICAgIGFjY2VwdGVkOiAnIzIxOTZGMycsXG4gICAgJ2luLXByb2dyZXNzJzogJyM5QzI3QjAnLFxuICAgIGF3YWl0Y29uZmlybWF0aW9uOiAnI0ZGOTgwMCcsXG4gICAgZGVsaXZlcmVkOiAnIzRDQUY1MCcsXG4gICAgY2FuY2VsbGVkOiAnIzllOWU5ZScsXG4gICAgdmVyaWZpZWQ6ICcjNENBRjUwJyxcbiAgICBmYWlsZWQ6ICcjZjQ0MzM2J1xufTtcblxuY29uc3QgUEFZTUVOVF9DT0xPUlMgPSB7XG4gICAgY29kOiAnI0ZGOTgwMCcsXG4gICAgb25saW5lOiAnIzRDQUY1MCdcbn07XG5cbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKGFtb3VudCkgPT4ge1xuICAgIHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUlOJywge1xuICAgICAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICAgICAgY3VycmVuY3k6ICdJTlInLFxuICAgICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDBcbiAgICB9KS5mb3JtYXQoYW1vdW50IHx8IDApO1xufTtcblxuY29uc3QgT3JkZXJzUGFnZSA9ICgpID0+IHtcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbc2VsZWN0ZWREYXRlLCBzZXRTZWxlY3RlZERhdGVdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWxlY3RlZEZpbHRlciwgc2V0U2VsZWN0ZWRGaWx0ZXJdID0gdXNlU3RhdGUoJycpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaW5qZWN0U3R5bGVzKCk7XG4gICAgICAgIGZldGNoT3JkZXJzKCk7XG4gICAgfSwgW3NlbGVjdGVkRGF0ZSwgc2VsZWN0ZWRGaWx0ZXJdKTtcblxuICAgIGNvbnN0IGZldGNoT3JkZXJzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHVybCA9ICcvYXBpL3YxL2FkbWluL2Rhc2hib2FyZC9vcmRlcnM/JztcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZERhdGUpIHVybCArPSBgZGF0ZT0ke3NlbGVjdGVkRGF0ZX0mYDtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpbHRlcikgdXJsICs9IGBmaWx0ZXI9JHtzZWxlY3RlZEZpbHRlcn1gO1xuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBzZXREYXRhKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggb3JkZXJzOicsIGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXREYXRlUmVsYXRpdmUgPSAob2Zmc2V0KSA9PiB7XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgKyBvZmZzZXQpO1xuICAgICAgICBzZXRTZWxlY3RlZERhdGUoZC50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF0pO1xuICAgIH07XG5cbiAgICBjb25zdCBjbGVhckZpbHRlcnMgPSAoKSA9PiB7XG4gICAgICAgIHNldFNlbGVjdGVkRGF0ZSgnJyk7XG4gICAgICAgIHNldFNlbGVjdGVkRmlsdGVyKCcnKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlU3RyKSA9PiB7XG4gICAgICAgIGlmICghZGF0ZVN0ciB8fCBkYXRlU3RyID09PSAnYWxsJykgcmV0dXJuICdBbGwgVGltZSc7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlU3RyKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywge1xuICAgICAgICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgICAgICAgbW9udGg6ICdsb25nJyxcbiAgICAgICAgICAgIGRheTogJ251bWVyaWMnXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBpc1RvZGF5ID0gc2VsZWN0ZWREYXRlID09PSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcblxuICAgIGNvbnN0IGZpbHRlcnMgPSBbXG4gICAgICAgIHsga2V5OiAnJywgbGFiZWw6ICdBbGwnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8udG90YWwsIGljb246ICfwn5OKJyB9LFxuICAgICAgICB7IGtleTogJ3VuYXNzaWduZWQnLCBsYWJlbDogJ1VuYXNzaWduZWQnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8udW5hc3NpZ25lZCwgaWNvbjogJ+KPsycgfSxcbiAgICAgICAgeyBrZXk6ICdjb2QnLCBsYWJlbDogJ0NPRCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5jb2QsIGljb246ICfwn5K1JyB9LFxuICAgICAgICB7IGtleTogJ29ubGluZScsIGxhYmVsOiAnT25saW5lJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/Lm9ubGluZSwgaWNvbjogJ/CfkrMnIH0sXG4gICAgICAgIHsga2V5OiAncGFpZCcsIGxhYmVsOiAnUGFpZCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5wYWlkLCBpY29uOiAn4pyFJyB9LFxuICAgICAgICB7IGtleTogJ3BlbmRpbmcnLCBsYWJlbDogJ1BlbmRpbmcnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8ucGVuZGluZywgaWNvbjogJ/CflIQnIH0sXG4gICAgICAgIHsga2V5OiAnZGVsaXZlcmVkJywgbGFiZWw6ICdEZWxpdmVyZWQnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8uZGVsaXZlcmVkLCBpY29uOiAn8J+TpicgfVxuICAgIF07XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNvbnRhaW5lciB9LFxuICAgICAgICAvLyBIZWFkZXJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmhlYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRpdGxlIH0sICfwn5OFIE9yZGVycyBieSBEYXRlJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3VidGl0bGUgfSwgZm9ybWF0RGF0ZShzZWxlY3RlZERhdGUpKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIENvbnRyb2xzXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jb250cm9scyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RhdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RlZERhdGUsXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChlKSA9PiBzZXRTZWxlY3RlZERhdGUoZS50YXJnZXQudmFsdWUpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuZGF0ZUlucHV0LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IGRhdGUnXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREYXRlUmVsYXRpdmUoMCksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHsgLi4uc3R5bGVzLmJ0biwgLi4uKGlzVG9kYXkgPyBzdHlsZXMuYnRuQWN0aXZlIDoge30pIH0sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bidcbiAgICAgICAgICAgIH0sICfwn5OGIFRvZGF5JyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RGF0ZVJlbGF0aXZlKC0xKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmJ0bixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJ1xuICAgICAgICAgICAgfSwgJ1llc3RlcmRheScpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldERhdGVSZWxhdGl2ZSgtNyksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5idG4sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bidcbiAgICAgICAgICAgIH0sICdMYXN0IFdlZWsnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBjbGVhckZpbHRlcnMsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5jbGVhckJ0bixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJ1xuICAgICAgICAgICAgfSwgJ+KclSBDbGVhciBBbGwnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2EnLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogJy9hcGkvdjEvYWRtaW4vZXhwb3J0L29yZGVycycsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5kb3dubG9hZExpbmssXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bidcbiAgICAgICAgICAgIH0sICfwn5OlIERvd25sb2FkIENTVicpXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gRmlsdGVyIFN0YXRzXG4gICAgICAgIGRhdGEgJiYgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRzUm93IH0sXG4gICAgICAgICAgICBmaWx0ZXJzLm1hcChmID0+XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGYua2V5LFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGBzdGF0LWNhcmQtZmlsdGVyICR7c2VsZWN0ZWRGaWx0ZXIgPT09IGYua2V5ID8gJ3N0YXQtY2FyZC1hY3RpdmUnIDogJyd9YCxcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0U2VsZWN0ZWRGaWx0ZXIoZi5rZXkpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSB9LCBmLmNvdW50IHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sIGAke2YuaWNvbn0gJHtmLmxhYmVsfWApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIFRhYmxlIG9yIExvYWRpbmdcbiAgICAgICAgbG9hZGluZyA/XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubG9hZGVyIH0sICfij7MgTG9hZGluZyBvcmRlcnMuLi4nKSA6XG4gICAgICAgICAgICAoIWRhdGEgfHwgZGF0YS5vcmRlcnMubGVuZ3RoID09PSAwKSA/XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLm5vRGF0YSB9LCAn8J+TrSBObyBvcmRlcnMgZm91bmQgZm9yIHRoaXMgZmlsdGVyJykgOlxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50YWJsZUNhcmQsIGNsYXNzTmFtZTogJ29yZGVycy1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0YWJsZScsIHsgc3R5bGU6IHN0eWxlcy50YWJsZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGhlYWQnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RyJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ09yZGVyIElEJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdDdXN0b21lcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnUGhvbmUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0FkZHJlc3MnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1BhcnRuZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnUGF5bWVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQW1vdW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdJdGVtcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm9yZGVycy5tYXAoKG9yZGVyLCBpKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIHsga2V5OiBpLCBjbGFzc05hbWU6ICdvcmRlcnMtcm93JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiBCUkFORC5wcmltYXJ5IH0gfSwgb3JkZXIub3JkZXJJZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5jdXN0b21lck5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIucGhvbmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgbWF4V2lkdGg6ICcyMDBweCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9IH0sIG9yZGVyLmFkZHJlc3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIuZGVsaXZlcnlQYXJ0bmVyIHx8ICfigJQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGAke1NUQVRVU19DT0xPUlNbb3JkZXIuc3RhdHVzXSB8fCAnIzY2Nid9MjBgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFNUQVRVU19DT0xPUlNbb3JkZXIuc3RhdHVzXSB8fCAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyM2NjYnfTUwYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYmFkZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIuc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzZweCcsIGZsZXhXcmFwOiAnd3JhcCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdHVzQmFkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYCR7UEFZTUVOVF9DT0xPUlNbb3JkZXIucGF5bWVudE1ldGhvZF0gfHwgJyM2NjYnfTIwYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogUEFZTUVOVF9DT0xPUlNbb3JkZXIucGF5bWVudE1ldGhvZF0gfHwgJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1BBWU1FTlRfQ09MT1JTW29yZGVyLnBheW1lbnRNZXRob2RdIHx8ICcjNjY2J301MGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYmFkZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9yZGVyLnBheW1lbnRNZXRob2QpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdHVzQmFkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYCR7U1RBVFVTX0NPTE9SU1tvcmRlci5wYXltZW50U3RhdHVzXSB8fCAnIzY2Nid9MjBgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBTVEFUVVNfQ09MT1JTW29yZGVyLnBheW1lbnRTdGF0dXNdIHx8ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnBheW1lbnRTdGF0dXNdIHx8ICcjNjY2J301MGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYmFkZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9yZGVyLnBheW1lbnRTdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogeyAuLi5zdHlsZXMudGQsIGZvbnRXZWlnaHQ6ICc2MDAnIH0gfSwgZm9ybWF0Q3VycmVuY3kob3JkZXIuYW1vdW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IGNvbG9yOiBCUkFORC5wcmltYXJ5LCBtYXJnaW5SaWdodDogJzhweCcsIGZvbnRXZWlnaHQ6ICc2MDAnIH0gfSwgYCgke29yZGVyLml0ZW1Db3VudH0pYCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuaXRlbXMuc2xpY2UoMCwgMykubWFwKChpdGVtLCBqKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBrZXk6IGosIHN0eWxlOiBzdHlsZXMuaXRlbVRhZyB9LCBpdGVtLmRpc3BsYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlci5pdGVtcy5sZW5ndGggPiAzICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5pdGVtVGFnLCBiYWNrZ3JvdW5kOiBCUkFORC5wcmltYXJ5ICsgJzMwJywgY29sb3I6IEJSQU5ELnByaW1hcnkgfSB9LCBgKyR7b3JkZXIuaXRlbXMubGVuZ3RoIC0gM31gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmRlcnNQYWdlO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgSW52b2ljZVJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9JbnZvaWNlUmVkaXJlY3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkludm9pY2VSZWRpcmVjdCA9IEludm9pY2VSZWRpcmVjdFxuaW1wb3J0IENTVlJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ1NWUmVkaXJlY3QgPSBDU1ZSZWRpcmVjdFxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBPcmRlcnNQYWdlIGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlcnNQYWdlID0gT3JkZXJzUGFnZSJdLCJuYW1lcyI6WyJJbnZvaWNlUmVkaXJlY3QiLCJwcm9wcyIsInJlY29yZCIsInJlc291cmNlIiwidXNlRWZmZWN0IiwiaWQiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInJlZGlyZWN0VXJsIiwiY29uc29sZSIsImxvZyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicGFkZGluZyIsInRleHRBbGlnbiIsImZvbnRGYW1pbHkiLCJjb2xvciIsIkNTVlJlZGlyZWN0IiwicmVzb3VyY2VJZCIsImV4cG9ydFVybCIsIkJSQU5EIiwicHJpbWFyeSIsInByaW1hcnlMaWdodCIsInByaW1hcnlEYXJrIiwiYWNjZW50IiwiYWNjZW50Qmx1ZSIsImRhcmsiLCJjYXJkIiwiY2FyZEhvdmVyIiwiYm9yZGVyIiwidGV4dFByaW1hcnkiLCJ0ZXh0U2Vjb25kYXJ5Iiwic3VjY2VzcyIsIndhcm5pbmciLCJkYW5nZXIiLCJpbmplY3RTdHlsZXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGVFbCIsInRleHRDb250ZW50IiwiaGVhZCIsImFwcGVuZENoaWxkIiwic3R5bGVzIiwiZGFzaGJvYXJkIiwiYmFja2dyb3VuZCIsIm1pbkhlaWdodCIsImhlYWRlciIsIm1hcmdpbkJvdHRvbSIsImFuaW1hdGlvbiIsInRpdGxlIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiV2Via2l0QmFja2dyb3VuZENsaXAiLCJXZWJraXRUZXh0RmlsbENvbG9yIiwiYmFja2dyb3VuZENsaXAiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImdhcCIsInN1YnRpdGxlIiwibGV0dGVyU3BhY2luZyIsInN0YXRzR3JpZCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJzdGF0Q2FyZCIsImJvcmRlclJhZGl1cyIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJzdGF0Q2FyZEhpZ2hsaWdodCIsInN0YXRDYXJkR2xvdyIsInRvcCIsInJpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJ0cmFuc2Zvcm0iLCJzdGF0VmFsdWUiLCJ6SW5kZXgiLCJzdGF0TGFiZWwiLCJ0ZXh0VHJhbnNmb3JtIiwic3RhdENoYW5nZSIsIm1hcmdpblRvcCIsInNlY3Rpb25UaXRsZSIsImNoYXJ0c0dyaWQiLCJjaGFydENhcmQiLCJjaGFydFRpdGxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImNoYXJ0Q29udGFpbmVyIiwianVzdGlmeUNvbnRlbnQiLCJiYXIiLCJiYXJMYWJlbCIsImxpc3RJdGVtIiwibGlzdFJhbmsiLCJtYXJnaW5SaWdodCIsImxpc3RJdGVtTmFtZSIsImZsZXgiLCJsaXN0SXRlbVZhbHVlIiwidGFibGVDYXJkIiwidGFibGUiLCJib3JkZXJDb2xsYXBzZSIsImJvcmRlclNwYWNpbmciLCJ0aCIsInRkIiwic3RhdHVzQmFkZ2UiLCJsb2FkZXIiLCJxdWlja0FjdGlvbnMiLCJmbGV4V3JhcCIsImFjdGlvbkJ0biIsImN1cnNvciIsInRleHREZWNvcmF0aW9uIiwiU1RBVFVTX0NPTE9SUyIsImFjdGl2ZSIsInBlbmRpbmciLCJleHBpcmVkIiwiY2FuY2VsbGVkIiwiZGVsaXZlcmVkIiwiY29uZmlybWVkIiwicHJlcGFyaW5nIiwicmVhZHkiLCJhY2NlcHRlZCIsIkRhc2hib2FyZCIsInN0YXRzIiwic2V0U3RhdHMiLCJ1c2VTdGF0ZSIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsImZldGNoU3RhdHMiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YSIsImpzb24iLCJlcnIiLCJmb3JtYXRDdXJyZW5jeSIsInZhbHVlIiwiSW50bCIsIk51bWJlckZvcm1hdCIsImN1cnJlbmN5IiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0IiwiZm9ybWF0TnVtYmVyIiwidG90YWxzIiwidG9kYXkiLCJyZXZlbnVlIiwiY2hhcnRzIiwiYmVzdFNlbGxlcnMiLCJicmFuY2hQZXJmb3JtYW5jZSIsIm9yZGVyc0J5U3RhdHVzIiwicGF5bWVudHMiLCJyZWNlbnRPcmRlcnMiLCJkYWlseVJldmVudWUiLCJtYXhEYWlseVJldmVudWUiLCJNYXRoIiwibWF4IiwibWFwIiwiZCIsIm9yZGVyQ291bnRzIiwiT2JqZWN0IiwidmFsdWVzIiwibWF4T3JkZXJDb3VudCIsImxlbmd0aCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsImNsYXNzTmFtZSIsInRoaXNXZWVrIiwidGhpc01vbnRoIiwiZ3Jvd3RoUGVyY2VudCIsImFicyIsIm9yZGVycyIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiYnJhbmNoZXMiLCJ2ZXJpZmllZCIsInNsaWNlIiwiaWR4Iiwia2V5IiwiZGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIndlZWtkYXkiLCJ0b0ZpeGVkIiwiZW50cmllcyIsImZpbHRlciIsIl8iLCJjb3VudCIsInN0YXR1cyIsInByb2R1Y3QiLCJuYW1lIiwicXVhbnRpdHkiLCJicmFuY2giLCJvbmxpbmUiLCJjb2QiLCJvcmRlciIsImN1c3RvbWVyIiwiYW1vdW50IiwiY29udGFpbmVyIiwiY29udHJvbHMiLCJkYXRlSW5wdXQiLCJvdXRsaW5lIiwidHJhbnNpdGlvbiIsImJ0biIsImJ0bkFjdGl2ZSIsImJ0blByaW1hcnkiLCJzdGF0c1JvdyIsInZlcnRpY2FsQWxpZ24iLCJpdGVtVGFnIiwibm9EYXRhIiwiZG93bmxvYWRMaW5rIiwiY2xlYXJCdG4iLCJhd2FpdGNvbmZpcm1hdGlvbiIsImZhaWxlZCIsIlBBWU1FTlRfQ09MT1JTIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwiT3JkZXJzUGFnZSIsInNldERhdGEiLCJzZWxlY3RlZERhdGUiLCJzZXRTZWxlY3RlZERhdGUiLCJzZWxlY3RlZEZpbHRlciIsInNldFNlbGVjdGVkRmlsdGVyIiwiZmV0Y2hPcmRlcnMiLCJ1cmwiLCJyZXN1bHQiLCJzZXREYXRlUmVsYXRpdmUiLCJvZmZzZXQiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInRvSVNPU3RyaW5nIiwic3BsaXQiLCJjbGVhckZpbHRlcnMiLCJmb3JtYXREYXRlIiwiZGF0ZVN0ciIsInllYXIiLCJtb250aCIsImRheSIsImlzVG9kYXkiLCJmaWx0ZXJzIiwibGFiZWwiLCJzdW1tYXJ5IiwidG90YWwiLCJpY29uIiwidW5hc3NpZ25lZCIsInBhaWQiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJwbGFjZWhvbGRlciIsIm9uQ2xpY2siLCJmIiwiaSIsIm9yZGVySWQiLCJjdXN0b21lck5hbWUiLCJwaG9uZSIsIm1heFdpZHRoIiwidGV4dE92ZXJmbG93Iiwid2hpdGVTcGFjZSIsImFkZHJlc3MiLCJkZWxpdmVyeVBhcnRuZXIiLCJwYXltZW50TWV0aG9kIiwicGF5bWVudFN0YXR1cyIsIml0ZW1Db3VudCIsIml0ZW1zIiwiaXRlbSIsImoiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUFFQTtJQUNBO0lBQ0EsTUFBTUEsZUFBZSxHQUFJQyxLQUFLLElBQUs7TUFDL0IsTUFBTTtRQUFFQyxNQUFNO0lBQUVDLElBQUFBO0lBQVMsR0FBQyxHQUFHRixLQUFLO0lBRWxDRyxFQUFBQSxlQUFTLENBQUMsTUFBTTtJQUNaLElBQUEsSUFBSUYsTUFBTSxJQUFJQSxNQUFNLENBQUNHLEVBQUUsRUFBRTtJQUNyQixNQUFBLE1BQU1BLEVBQUUsR0FBR0gsTUFBTSxDQUFD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LENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxVQUFVLENBQUMsZUFDM0QxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxVQUFVLENBQUMsZUFDM0QxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxPQUFPLENBQUMsZUFDeEQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxTQUFTLENBQUMsZUFDMUQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxTQUFTLENBQUMsZUFDMUQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxRQUFRLENBQUMsZUFDekQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxTQUFTLENBQUMsZUFDMUQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO09BQUksRUFBRSxRQUFRLENBQUMsZUFDekQxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQUVDLEtBQUssRUFBRThCLE1BQU0sQ0FBQzBEO0lBQUcsR0FBQyxFQUFFLE9BQU8sQ0FDM0QsQ0FDSixDQUFDLGVBQ0QxRixzQkFBSyxDQUFDQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFDN0J1SCxJQUFJLENBQUNzQyxNQUFNLENBQUNkLEdBQUcsQ0FBQyxDQUFDcUMsS0FBSyxF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
