(function (React, designSystem, adminjs) {
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

    const Edit = ({ property, record, onChange }) => {
        const { translateProperty } = adminjs.useTranslation();
        const { params } = record;
        const { custom } = property;
        const path = adminjs.flat.get(params, custom.filePathProperty);
        const key = adminjs.flat.get(params, custom.keyProperty);
        const file = adminjs.flat.get(params, custom.fileProperty);
        const [originalKey, setOriginalKey] = React.useState(key);
        const [filesToUpload, setFilesToUpload] = React.useState([]);
        React.useEffect(() => {
            // it means means that someone hit save and new file has been uploaded
            // in this case fliesToUpload should be cleared.
            // This happens when user turns off redirect after new/edit
            if ((typeof key === 'string' && key !== originalKey)
                || (typeof key !== 'string' && !originalKey)
                || (typeof key !== 'string' && Array.isArray(key) && key.length !== originalKey.length)) {
                setOriginalKey(key);
                setFilesToUpload([]);
            }
        }, [key, originalKey]);
        const onUpload = (files) => {
            setFilesToUpload(files);
            onChange(custom.fileProperty, files);
        };
        const handleRemove = () => {
            onChange(custom.fileProperty, null);
        };
        const handleMultiRemove = (singleKey) => {
            const index = (adminjs.flat.get(record.params, custom.keyProperty) || []).indexOf(singleKey);
            const filesToDelete = adminjs.flat.get(record.params, custom.filesToDeleteProperty) || [];
            if (path && path.length > 0) {
                const newPath = path.map((currentPath, i) => (i !== index ? currentPath : null));
                let newParams = adminjs.flat.set(record.params, custom.filesToDeleteProperty, [...filesToDelete, index]);
                newParams = adminjs.flat.set(newParams, custom.filePathProperty, newPath);
                onChange({
                    ...record,
                    params: newParams,
                });
            }
            else {
                // eslint-disable-next-line no-console
                console.log('You cannot remove file when there are no uploaded files yet');
            }
        };
        return (React__default.default.createElement(designSystem.FormGroup, null,
            React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
            React__default.default.createElement(designSystem.DropZone, { onChange: onUpload, multiple: custom.multiple, validate: {
                    mimeTypes: custom.mimeTypes,
                    maxSize: custom.maxSize,
                }, files: filesToUpload }),
            !custom.multiple && key && path && !filesToUpload.length && file !== null && (React__default.default.createElement(designSystem.DropZoneItem, { filename: key, src: path, onRemove: handleRemove })),
            custom.multiple && key && key.length && path ? (React__default.default.createElement(React__default.default.Fragment, null, key.map((singleKey, index) => {
                // when we remove items we set only path index to nulls.
                // key is still there. This is because
                // we have to maintain all the indexes. So here we simply filter out elements which
                // were removed and display only what was left
                const currentPath = path[index];
                return currentPath ? (React__default.default.createElement(designSystem.DropZoneItem, { key: singleKey, filename: singleKey, src: path[index], onRemove: () => handleMultiRemove(singleKey) })) : '';
            }))) : ''));
    };

    const AudioMimeTypes = [
        'audio/aac',
        'audio/midi',
        'audio/x-midi',
        'audio/mpeg',
        'audio/ogg',
        'application/ogg',
        'audio/opus',
        'audio/wav',
        'audio/webm',
        'audio/3gpp2',
    ];
    const ImageMimeTypes = [
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/vnd.microsoft.icon',
        'image/tiff',
        'image/webp',
    ];

    // eslint-disable-next-line import/no-extraneous-dependencies
    const SingleFile = (props) => {
        const { name, path, mimeType, width } = props;
        if (path && path.length) {
            if (mimeType && ImageMimeTypes.includes(mimeType)) {
                return (React__default.default.createElement("img", { src: path, style: { maxHeight: width, maxWidth: width }, alt: name }));
            }
            if (mimeType && AudioMimeTypes.includes(mimeType)) {
                return (React__default.default.createElement("audio", { controls: true, src: path },
                    "Your browser does not support the",
                    React__default.default.createElement("code", null, "audio"),
                    React__default.default.createElement("track", { kind: "captions" })));
            }
        }
        return (React__default.default.createElement(designSystem.Box, null,
            React__default.default.createElement(designSystem.Button, { as: "a", href: path, ml: "default", size: "sm", rounded: true, target: "_blank" },
                React__default.default.createElement(designSystem.Icon, { icon: "DocumentDownload", color: "white", mr: "default" }),
                name)));
    };
    const File = ({ width, record, property }) => {
        const { custom } = property;
        let path = adminjs.flat.get(record?.params, custom.filePathProperty);
        if (!path) {
            return null;
        }
        const name = adminjs.flat.get(record?.params, custom.fileNameProperty ? custom.fileNameProperty : custom.keyProperty);
        const mimeType = custom.mimeTypeProperty
            && adminjs.flat.get(record?.params, custom.mimeTypeProperty);
        if (!property.custom.multiple) {
            if (custom.opts && custom.opts.baseUrl) {
                path = `${custom.opts.baseUrl}/${name}`;
            }
            return (React__default.default.createElement(SingleFile, { path: path, name: name, width: width, mimeType: mimeType }));
        }
        if (custom.opts && custom.opts.baseUrl) {
            const baseUrl = custom.opts.baseUrl || '';
            path = path.map((singlePath, index) => `${baseUrl}/${name[index]}`);
        }
        return (React__default.default.createElement(React__default.default.Fragment, null, path.map((singlePath, index) => (React__default.default.createElement(SingleFile, { key: singlePath, path: singlePath, name: name[index], width: width, mimeType: mimeType[index] })))));
    };

    const List = (props) => (React__default.default.createElement(File, { width: 100, ...props }));

    const Show = (props) => {
        const { property } = props;
        const { translateProperty } = adminjs.useTranslation();
        return (React__default.default.createElement(designSystem.FormGroup, null,
            React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
            React__default.default.createElement(File, { width: "100%", ...props })));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.InvoiceRedirect = InvoiceRedirect;
    AdminJS.UserComponents.CSVRedirect = CSVRedirect;
    AdminJS.UserComponents.Dashboard = Dashboard;
    AdminJS.UserComponents.OrdersPage = OrdersPage;
    AdminJS.UserComponents.UploadEditComponent = Edit;
    AdminJS.UserComponents.UploadListComponent = List;
    AdminJS.UserComponents.UploadShowComponent = Show;

})(React, AdminJSDesignSystem, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvSW52b2ljZVJlZGlyZWN0LmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdC5qc3giLCIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlLmpzeCIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvZmlsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBUaGlzIGNvbXBvbmVudCBwZXJmb3JtcyBhIHNpbXBsZSBjbGllbnQtc2lkZSByZWRpcmVjdCB0byB0aGUgcHJlbWl1bSBIVE1MIGludm9pY2UuXG4vLyBJdCBieXBhc3NlcyB0aGUgQWRtaW5KUyBBSkFYIGhhbmRsaW5nIHRvIGVuc3VyZSBhIGZ1bGwgcGFnZSBsb2FkIG9mIG91ciBjdXN0b20gdmlldy5cbmNvbnN0IEludm9pY2VSZWRpcmVjdCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZC5pZCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSByZWNvcmQuaWQ7XG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgaXQncyBhIHN1YnNjcmlwdGlvbiBvciBvcmRlclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3N1YnNjcmlwdGlvbicpID8gJ3N1YnNjcmlwdGlvbicgOiAnb3JkZXInO1xuICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSBgL2FwaS92MS9hZG1pbi9wcmV2aWV3LyR7dHlwZX0vJHtpZH1gO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg8J+agCBSZWRpcmVjdGluZyB0byBwcmVtaXVtIGludm9pY2U6ICR7cmVkaXJlY3RVcmx9YCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9XG4gICAgfSwgW3JlY29yZCwgcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ1ByZXBhcmluZyB5b3VyIHByZW1pdW0gaW52b2ljZS4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW52b2ljZVJlZGlyZWN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gVGhpcyBjb21wb25lbnQgcmVkaXJlY3RzIHRvIENTViBleHBvcnQgZW5kcG9pbnRcbmNvbnN0IENTVlJlZGlyZWN0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb3J0IHR5cGUgYmFzZWQgb24gcmVzb3VyY2VcbiAgICAgICAgY29uc3QgcmVzb3VyY2VJZCA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBleHBvcnRVcmwgPSAnL2FwaS92MS9hZG1pbi9leHBvcnQvb3JkZXJzJztcblxuICAgICAgICBpZiAocmVzb3VyY2VJZC5pbmNsdWRlcygnc3Vic2NyaXB0aW9uJykpIHtcbiAgICAgICAgICAgIGV4cG9ydFVybCA9ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9zdWJzY3JpcHRpb25zJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGDwn5OKIFJlZGlyZWN0aW5nIHRvIENTViBleHBvcnQ6ICR7ZXhwb3J0VXJsfWApO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV4cG9ydFVybDtcbiAgICB9LCBbcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ0dlbmVyYXRpbmcgQ1NWIHJlcG9ydC4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ1NWUmVkaXJlY3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gQnJhbmQgQ29sb3JzXG5jb25zdCBCUkFORCA9IHtcbiAgICBwcmltYXJ5OiAnI0ZGNDcwMCcsXG4gICAgcHJpbWFyeUxpZ2h0OiAnI0ZGNkIzMycsXG4gICAgcHJpbWFyeURhcms6ICcjQ0MzOTAwJyxcbiAgICBhY2NlbnQ6ICcjNENBRjUwJyxcbiAgICBhY2NlbnRCbHVlOiAnIzIxOTZGMycsXG4gICAgZGFyazogJyMxZTIyMjYnLFxuICAgIGNhcmQ6ICcjMzAzNjQxJyxcbiAgICBjYXJkSG92ZXI6ICcjM2E0MTQ5JyxcbiAgICBib3JkZXI6ICcjNDU0ZDVkJyxcbiAgICB0ZXh0UHJpbWFyeTogJyNmZmYnLFxuICAgIHRleHRTZWNvbmRhcnk6ICcjOWFhNWIxJyxcbiAgICBzdWNjZXNzOiAnIzRDQUY1MCcsXG4gICAgd2FybmluZzogJyNGRkMxMDcnLFxuICAgIGRhbmdlcjogJyNmNDQzMzYnXG59O1xuXG4vLyBDU1MgS2V5ZnJhbWUgYW5pbWF0aW9ucyBpbmplY3RlZCB2aWEgc3R5bGUgdGFnXG5jb25zdCBpbmplY3RTdHlsZXMgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoYm9hcmQtYW5pbWF0aW9ucycpKSByZXR1cm47XG4gICAgY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbC5pZCA9ICdkYXNoYm9hcmQtYW5pbWF0aW9ucyc7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IGBcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlSW5VcCB7XG4gICAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDIwcHgpOyB9XG4gICAgICAgICAgICB0byB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfVxuICAgICAgICB9XG4gICAgICAgIEBrZXlmcmFtZXMgcHVsc2Uge1xuICAgICAgICAgICAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG4gICAgICAgICAgICA1MCUgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpOyB9XG4gICAgICAgIH1cbiAgICAgICAgQGtleWZyYW1lcyBzaGltbWVyIHtcbiAgICAgICAgICAgIDAlIHsgYmFja2dyb3VuZC1wb3NpdGlvbjogLTIwMCUgMDsgfVxuICAgICAgICAgICAgMTAwJSB7IGJhY2tncm91bmQtcG9zaXRpb246IDIwMCUgMDsgfVxuICAgICAgICB9XG4gICAgICAgIEBrZXlmcmFtZXMgYmFyR3JvdyB7XG4gICAgICAgICAgICBmcm9tIHsgaGVpZ2h0OiAwOyB9XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1jYXJkIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWNhcmQ6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEycHggMjRweCByZ2JhKDAsMCwwLDAuMykgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJHtCUkFORC5wcmltYXJ5fTQwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG4ge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG46aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyMHB4ICR7QlJBTkQucHJpbWFyeX00MCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYnRuOmFjdGl2ZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJ0bjo6YWZ0ZXIge1xuICAgICAgICAgICAgY29udGVudDogJyc7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgICAgIHdpZHRoOiAwO1xuICAgICAgICAgICAgaGVpZ2h0OiAwO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjIpO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjZzLCBoZWlnaHQgMC42cztcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJ0bjpob3Zlcjo6YWZ0ZXIge1xuICAgICAgICAgICAgd2lkdGg6IDMwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAzMDBweDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJhciB7XG4gICAgICAgICAgICBhbmltYXRpb246IGJhckdyb3cgMC44cyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpIGZvcndhcmRzO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYmFyOmhvdmVyIHtcbiAgICAgICAgICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlWSgxLjA1KTtcbiAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IGJvdHRvbTtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLXJvdyB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1yb3c6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJHtCUkFORC5jYXJkSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLnN0YXQtdmFsdWUge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBmYWRlSW5VcCAwLjVzIGVhc2Utb3V0O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYmFkZ2Uge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYmFkZ2U6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmxlZ2VuZC1pdGVtIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIG1hcmdpbjogLThweDtcbiAgICAgICAgfVxuICAgICAgICAubGVnZW5kLWl0ZW06aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjA1KSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5ncm93dGgtcG9zaXRpdmUge1xuICAgICAgICAgICAgY29sb3I6ICR7QlJBTkQuc3VjY2Vzc30gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZ3Jvd3RoLW5lZ2F0aXZlIHtcbiAgICAgICAgICAgIGNvbG9yOiAke0JSQU5ELmRhbmdlcn0gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIGA7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbn07XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgICBkYXNoYm9hcmQ6IHtcbiAgICAgICAgcGFkZGluZzogJzI4cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBtaW5IZWlnaHQ6ICcxMDB2aCcsXG4gICAgICAgIGZvbnRGYW1pbHk6IFwiJ0ludGVyJywgJ1JvYm90bycsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZlwiXG4gICAgfSxcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjhweCcsXG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGVJblVwIDAuNnMgZWFzZS1vdXQnXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgICBmb250U2l6ZTogJzI4cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQudGV4dFByaW1hcnl9IDAlLCAke0JSQU5ELnByaW1hcnl9IDEwMCUpYCxcbiAgICAgICAgV2Via2l0QmFja2dyb3VuZENsaXA6ICd0ZXh0JyxcbiAgICAgICAgV2Via2l0VGV4dEZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgYmFja2dyb3VuZENsaXA6ICd0ZXh0JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnMTJweCdcbiAgICB9LFxuICAgIHN1YnRpdGxlOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4zcHgnXG4gICAgfSxcbiAgICBzdGF0c0dyaWQ6IHtcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMTgwcHgsIDFmcikpJyxcbiAgICAgICAgZ2FwOiAnMTZweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgfSxcbiAgICBzdGF0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMjBweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xNSknLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgfSxcbiAgICBzdGF0Q2FyZEhpZ2hsaWdodDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5wcmltYXJ5fTIwIDAlLCAke0JSQU5ELnByaW1hcnl9MTAgMTAwJSlgLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5wcmltYXJ5fTUwYFxuICAgIH0sXG4gICAgc3RhdENhcmRHbG93OiB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICB3aWR0aDogJzgwcHgnLFxuICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogYHJhZGlhbC1ncmFkaWVudChjaXJjbGUsICR7QlJBTkQucHJpbWFyeX0yMCAwJSwgdHJhbnNwYXJlbnQgNzAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgzMCUsIC0zMCUpJ1xuICAgIH0sXG4gICAgc3RhdFZhbHVlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjhweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzRweCcsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICB6SW5kZXg6IDFcbiAgICB9LFxuICAgIHN0YXRMYWJlbDoge1xuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcxcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgc3RhdENoYW5nZToge1xuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgbWFyZ2luVG9wOiAnOHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnNHB4J1xuICAgIH0sXG4gICAgc2VjdGlvblRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICcxMHB4J1xuICAgIH0sXG4gICAgY2hhcnRzR3JpZDoge1xuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzMjBweCwgMWZyKSknLFxuICAgICAgICBnYXA6ICcyMHB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCdcbiAgICB9LFxuICAgIGNoYXJ0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMjBweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xNSknXG4gICAgfSxcbiAgICBjaGFydFRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICc4cHgnLFxuICAgICAgICBwYWRkaW5nQm90dG9tOiAnMTJweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gXG4gICAgfSxcbiAgICBjaGFydENvbnRhaW5lcjoge1xuICAgICAgICBoZWlnaHQ6ICcxNDBweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgZ2FwOiAnMTJweCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYXJvdW5kJyxcbiAgICAgICAgbWFyZ2luVG9wOiAnMTZweCcsXG4gICAgICAgIHBhZGRpbmc6ICcwIDhweCdcbiAgICB9LFxuICAgIGJhcjoge1xuICAgICAgICB3aWR0aDogJzUwcHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHggNnB4IDAgMCcsXG4gICAgICAgIGJveFNoYWRvdzogJzAgLTRweCAxMnB4IHJnYmEoMCwwLDAsMC4yKSdcbiAgICB9LFxuICAgIGJhckxhYmVsOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5Ub3A6ICc4cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgbGlzdEl0ZW06IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn0zMGBcbiAgICB9LFxuICAgIGxpc3RSYW5rOiB7XG4gICAgICAgIHdpZHRoOiAnMjRweCcsXG4gICAgICAgIGhlaWdodDogJzI0cHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBtYXJnaW5SaWdodDogJzEycHgnXG4gICAgfSxcbiAgICBsaXN0SXRlbU5hbWU6IHtcbiAgICAgICAgZmxleDogMSxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgbGlzdEl0ZW1WYWx1ZToge1xuICAgICAgICBjb2xvcjogQlJBTkQucHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCdcbiAgICB9LFxuICAgIHRhYmxlQ2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBwYWRkaW5nOiAnMjBweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xNSknLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyMHB4JyxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgfSxcbiAgICB0YWJsZToge1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBib3JkZXJDb2xsYXBzZTogJ3NlcGFyYXRlJyxcbiAgICAgICAgYm9yZGVyU3BhY2luZzogJzAnXG4gICAgfSxcbiAgICB0aDoge1xuICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMTRweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzFweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDJweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJ1xuICAgIH0sXG4gICAgdGQ6IHtcbiAgICAgICAgcGFkZGluZzogJzE0cHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn00MGBcbiAgICB9LFxuICAgIHN0YXR1c0JhZGdlOiB7XG4gICAgICAgIHBhZGRpbmc6ICc1cHggMTBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG4gICAgfSxcbiAgICBsb2FkZXI6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE4cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgcXVpY2tBY3Rpb25zOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgZ2FwOiAnMTJweCcsXG4gICAgICAgIGZsZXhXcmFwOiAnd3JhcCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgfSxcbiAgICBhY3Rpb25CdG46IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQucHJpbWFyeX0gMCUsICR7QlJBTkQucHJpbWFyeURhcmt9IDEwMCUpYCxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDIwcHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnNnB4JyxcbiAgICAgICAgYm94U2hhZG93OiBgMCA0cHggMTRweCAke0JSQU5ELnByaW1hcnl9NTBgXG4gICAgfSxcbiAgICByZXZlbnVlR3JpZDoge1xuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoNCwgMWZyKScsXG4gICAgICAgIGdhcDogJzEycHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgfSxcbiAgICByZXZlbnVlSXRlbToge1xuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBwYWRkaW5nOiAnMTJweCcsXG4gICAgICAgIGJhY2tncm91bmQ6IGAke0JSQU5ELmRhcmt9ODBgLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4J1xuICAgIH0sXG4gICAgcmV2ZW51ZVZhbHVlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnlcbiAgICB9LFxuICAgIHJldmVudWVMYWJlbDoge1xuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIG1hcmdpblRvcDogJzRweCdcbiAgICB9XG59O1xuXG5jb25zdCBTVEFUVVNfQ09MT1JTID0ge1xuICAgIGFjdGl2ZTogJyM0Q0FGNTAnLFxuICAgIHBlbmRpbmc6ICcjRkZDMTA3JyxcbiAgICBleHBpcmVkOiAnI2Y0NDMzNicsXG4gICAgY2FuY2VsbGVkOiAnIzllOWU5ZScsXG4gICAgZGVsaXZlcmVkOiAnIzRDQUY1MCcsXG4gICAgY29uZmlybWVkOiAnIzIxOTZGMycsXG4gICAgcHJlcGFyaW5nOiAnI0ZGOTgwMCcsXG4gICAgcmVhZHk6ICcjMDBCQ0Q0JyxcbiAgICBhY2NlcHRlZDogJyMyMTk2RjMnLFxuICAgICdpbi1wcm9ncmVzcyc6ICcjRkY5ODAwJyxcbiAgICAnYXdhaXRjb25maXJtYXRpb24nOiAnIzlDMjdCMCdcbn07XG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICBjb25zdCBbc3RhdHMsIHNldFN0YXRzXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICAgIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpbmplY3RTdHlsZXMoKTtcbiAgICAgICAgZmV0Y2hTdGF0cygpO1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IGZldGNoU3RhdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL3YxL2FkbWluL2Rhc2hib2FyZC9zdGF0cycpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBzZXRTdGF0cyhkYXRhLmRhdGEgfHwge30pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRFcnJvcihkYXRhLmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGZXRjaCBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgc2V0RXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBkYXNoYm9hcmQgZGF0YScpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tSU4nLCB7XG4gICAgICAgICAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICAgICAgICAgIGN1cnJlbmN5OiAnSU5SJyxcbiAgICAgICAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMFxuICAgICAgICB9KS5mb3JtYXQodmFsdWUgfHwgMCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdE51bWJlciA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1JTicpLmZvcm1hdCh2YWx1ZSB8fCAwKTtcbiAgICB9O1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCBudWxsLCAn4o+zIExvYWRpbmcgRGFzaGJvYXJkLi4uJylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxvYWRlciwgY29sb3I6ICcjZjQ0MzM2JyB9IH0sXG4gICAgICAgICAgICBg4p2MIEVycm9yOiAke2Vycm9yfWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXN0YXRzKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubG9hZGVyIH0sICdObyBkYXNoYm9hcmQgZGF0YSBhdmFpbGFibGUnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbHMgPSBzdGF0cy50b3RhbHMgfHwge307XG4gICAgY29uc3QgdG9kYXkgPSBzdGF0cy50b2RheSB8fCB7fTtcbiAgICBjb25zdCByZXZlbnVlID0gc3RhdHMucmV2ZW51ZSB8fCB7fTtcbiAgICBjb25zdCBjaGFydHMgPSBzdGF0cy5jaGFydHMgfHwge307XG4gICAgY29uc3QgYmVzdFNlbGxlcnMgPSBzdGF0cy5iZXN0U2VsbGVycyB8fCBbXTtcbiAgICBjb25zdCBicmFuY2hQZXJmb3JtYW5jZSA9IHN0YXRzLmJyYW5jaFBlcmZvcm1hbmNlIHx8IFtdO1xuICAgIGNvbnN0IG9yZGVyc0J5U3RhdHVzID0gc3RhdHMub3JkZXJzQnlTdGF0dXMgfHwge307XG4gICAgY29uc3QgcGF5bWVudHMgPSBzdGF0cy5wYXltZW50cyB8fCB7fTtcbiAgICBjb25zdCByZWNlbnRPcmRlcnMgPSBzdGF0cy5yZWNlbnRPcmRlcnMgfHwgW107XG5cbiAgICBjb25zdCBkYWlseVJldmVudWUgPSBjaGFydHMuZGFpbHlSZXZlbnVlIHx8IFtdO1xuICAgIGNvbnN0IG1heERhaWx5UmV2ZW51ZSA9IE1hdGgubWF4KC4uLmRhaWx5UmV2ZW51ZS5tYXAoZCA9PiBkLnJldmVudWUgfHwgMCksIDEpO1xuXG4gICAgY29uc3Qgb3JkZXJDb3VudHMgPSBPYmplY3QudmFsdWVzKG9yZGVyc0J5U3RhdHVzKTtcbiAgICBjb25zdCBtYXhPcmRlckNvdW50ID0gTWF0aC5tYXgoLi4uKG9yZGVyQ291bnRzLmxlbmd0aCA+IDAgPyBvcmRlckNvdW50cyA6IFsxXSksIDEpO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5kYXNoYm9hcmQgfSxcbiAgICAgICAgLy8gSGVhZGVyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5oZWFkZXIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50aXRsZSB9LCAn8J+TiiBTYWxlcyBBbmFseXRpY3MgRGFzaGJvYXJkJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3VidGl0bGUgfSxcbiAgICAgICAgICAgICAgICBgTGFzdCB1cGRhdGVkOiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9YFxuICAgICAgICAgICAgKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIFF1aWNrIEFjdGlvbnNcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnF1aWNrQWN0aW9ucyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYScsIHtcbiAgICAgICAgICAgICAgICBocmVmOiAnL2FkbWluL3BhZ2VzL29yZGVyc0J5RGF0ZScsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5hY3Rpb25CdG4sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWJ0bidcbiAgICAgICAgICAgIH0sICfwn5OFIE9yZGVycyBieSBEYXRlJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9vcmRlcnMnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuYWN0aW9uQnRuLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1idG4nXG4gICAgICAgICAgICB9LCAn8J+TpSBFeHBvcnQgQ1NWJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYWRtaW4vcmVzb3VyY2VzLzFfQWxsT3JkZXJzJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogeyAuLi5zdHlsZXMuYWN0aW9uQnRuLCBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC5hY2NlbnRCbHVlfSAwJSwgIzE5NzZEMiAxMDAlKWAgfSxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYnRuJ1xuICAgICAgICAgICAgfSwgJ/Cfk4sgQWxsIE9yZGVycycpXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUmV2ZW51ZSBPdmVydmlldyBTZWN0aW9uXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgbWFyZ2luQm90dG9tOiAnMjRweCcgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnNlY3Rpb25UaXRsZSB9LCAn8J+SsCBSZXZlbnVlIE92ZXJ2aWV3JyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdHNHcmlkIH0sXG4gICAgICAgICAgICAgICAgLy8gVG9kYXkncyBSZXZlbnVlXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMuc3RhdENhcmQsIC4uLnN0eWxlcy5zdGF0Q2FyZEhpZ2hsaWdodCB9LCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkR2xvdyB9KSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgZm9ybWF0Q3VycmVuY3kocmV2ZW51ZS50b2RheSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sIFwiVG9kYXkncyBSZXZlbnVlXCIpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAvLyBUaGlzIFdlZWtcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmRHbG93IH0pLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRoaXNXZWVrKSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1RoaXMgV2VlaycpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAvLyBUaGlzIE1vbnRoXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkR2xvdyB9KSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgZm9ybWF0Q3VycmVuY3kocmV2ZW51ZS50aGlzTW9udGgpKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVGhpcyBNb250aCcpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLnN0YXRDaGFuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IHJldmVudWUuZ3Jvd3RoUGVyY2VudCA+PSAwID8gJ2dyb3d0aC1wb3NpdGl2ZScgOiAnZ3Jvd3RoLW5lZ2F0aXZlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZW51ZS5ncm93dGhQZXJjZW50ID49IDAgPyAn4oaRJyA6ICfihpMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYCAke01hdGguYWJzKHJldmVudWUuZ3Jvd3RoUGVyY2VudCl9JSB2cyBsYXN0IG1vbnRoYFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAvLyBUb2RheSdzIE9yZGVyc1xuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZEdsb3cgfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIHRvZGF5Lm9yZGVycyksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgXCJUb2RheSdzIE9yZGVyc1wiKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBLZXkgTWV0cmljc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IG1hcmdpbkJvdHRvbTogJzI0cHgnIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zZWN0aW9uVGl0bGUgfSwgJ/Cfk4ggS2V5IE1ldHJpY3MnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0c0dyaWQgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXROdW1iZXIodG90YWxzLm9yZGVycykpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sICdUb3RhbCBPcmRlcnMnKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgZm9ybWF0TnVtYmVyKHRvdGFscy5jdXN0b21lcnMpKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVG90YWwgQ3VzdG9tZXJzJylcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIGZvcm1hdE51bWJlcih0b3RhbHMucHJvZHVjdHMpKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnQWN0aXZlIFByb2R1Y3RzJylcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIGZvcm1hdE51bWJlcih0b3RhbHMuYnJhbmNoZXMpKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnQWN0aXZlIEJyYW5jaGVzJylcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIHBheW1lbnRzLnZlcmlmaWVkKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnRGVsaXZlcmVkIE9yZGVycycpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBwYXltZW50cy5wZW5kaW5nKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnUGVuZGluZy9BY3RpdmUnKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBDaGFydHMgUm93XG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydHNHcmlkIH0sXG4gICAgICAgICAgICAvLyBEYWlseSBSZXZlbnVlIENoYXJ0XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRUaXRsZSB9LCAn8J+TiiBEYWlseSBSZXZlbnVlIChMYXN0IDcgRGF5cyknKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDb250YWluZXIgfSxcbiAgICAgICAgICAgICAgICAgICAgZGFpbHlSZXZlbnVlLnNsaWNlKC03KS5tYXAoKGQsIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiBkLmRhdGUsIHN0eWxlOiB7IHRleHRBbGlnbjogJ2NlbnRlcicgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWJhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuYmFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHsoZC5yZXZlbnVlIC8gbWF4RGFpbHlSZXZlbnVlKSAqIDExMH1weGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgJHtCUkFORC5wcmltYXJ5fSwgJHtCUkFORC5wcmltYXJ5TGlnaHR9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcyMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmJhckxhYmVsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGQuZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgd2Vla2RheTogJ3Nob3J0JyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMuYmFyTGFiZWwsIGNvbG9yOiAnI2ZmZicsIGZvbnRXZWlnaHQ6ICc2MDAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYOKCuSR7KGQucmV2ZW51ZSAvIDEwMDApLnRvRml4ZWQoMCl9a2BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAvLyBPcmRlciBTdGF0dXMgQ2hhcnRcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn5OIIE9yZGVyIFN0YXR1cycpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENvbnRhaW5lciB9LFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhvcmRlcnNCeVN0YXR1cykuZmlsdGVyKChbXywgY291bnRdKSA9PiBjb3VudCA+IDApLnNsaWNlKDAsIDYpLm1hcCgoW3N0YXR1cywgY291bnRdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBrZXk6IHN0YXR1cywgc3R5bGU6IHsgdGV4dEFsaWduOiAnY2VudGVyJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYmFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5iYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzQ1cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHsoY291bnQgLyBtYXhPcmRlckNvdW50KSAqIDExMH1weGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgJHtTVEFUVVNfQ09MT1JTW3N0YXR1c10gfHwgJyM2NjYnfSwgJHtTVEFUVVNfQ09MT1JTW3N0YXR1c10gfHwgJyM2NjYnfTk5KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcyMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmJhckxhYmVsIH0sIHN0YXR1cy5zbGljZSgwLCA4KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMuYmFyTGFiZWwsIGNvbG9yOiAnI2ZmZicsIGZvbnRXZWlnaHQ6ICc2MDAnIH0gfSwgY291bnQpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAvLyBCZXN0IFNlbGxpbmcgUHJvZHVjdHNcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn4+GIEJlc3QgU2VsbGluZyBQcm9kdWN0cycpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGJlc3RTZWxsZXJzLnNsaWNlKDAsIDUpLm1hcCgocHJvZHVjdCwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBrZXk6IGlkeCwgc3R5bGU6IHN0eWxlcy5saXN0SXRlbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLmxpc3RSYW5rLCBiYWNrZ3JvdW5kOiBpZHggPT09IDAgPyAnI0ZGRDcwMCcgOiBpZHggPT09IDEgPyAnI0MwQzBDMCcgOiBpZHggPT09IDIgPyAnI0NEN0YzMicgOiBCUkFORC5wcmltYXJ5IH0gfSwgaWR4ICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtTmFtZSB9LCBwcm9kdWN0Lm5hbWUuc2xpY2UoMCwgMjUpICsgKHByb2R1Y3QubmFtZS5sZW5ndGggPiAyNSA/ICcuLi4nIDogJycpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubGlzdEl0ZW1WYWx1ZSB9LCBgJHtwcm9kdWN0LnF1YW50aXR5fSBzb2xkYClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIEJyYW5jaCBQZXJmb3JtYW5jZVxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/Cfj6IgQnJhbmNoIFBlcmZvcm1hbmNlJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoUGVyZm9ybWFuY2Uuc2xpY2UoMCwgNSkubWFwKChicmFuY2gsIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiBpZHgsIHN0eWxlOiBzdHlsZXMubGlzdEl0ZW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5saXN0UmFuaywgYmFja2dyb3VuZDogQlJBTkQuYWNjZW50Qmx1ZSB9IH0sIGlkeCArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbU5hbWUgfSwgYnJhbmNoLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbVZhbHVlIH0sIGZvcm1hdEN1cnJlbmN5KGJyYW5jaC5yZXZlbnVlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIFBheW1lbnQgTWV0aG9kc1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/CfkrMgUGF5bWVudCBNZXRob2RzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBwYWRkaW5nOiAnMTJweCAwJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IHdpZHRoOiAnMTBweCcsIGhlaWdodDogJzEwcHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiAnIzRDQUY1MCcgfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksIGZvbnRTaXplOiAnMTNweCcgfSB9LCAnT25saW5lIFBheW1lbnRzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksIGZvbnRXZWlnaHQ6ICc2MDAnIH0gfSwgcGF5bWVudHMub25saW5lKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubGlzdEl0ZW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyB3aWR0aDogJzEwcHgnLCBoZWlnaHQ6ICcxMHB4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZDogJyNGRkMxMDcnIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LCBmb250U2l6ZTogJzEzcHgnIH0gfSwgJ0Nhc2ggb24gRGVsaXZlcnknKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBwYXltZW50cy5jb2QpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUmVjZW50IE9yZGVycyBUYWJsZVxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGFibGVDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn6e+IFJlY2VudCBPcmRlcnMnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBzdHlsZTogc3R5bGVzLnRhYmxlIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGhlYWQnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnT3JkZXIgSUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdDdXN0b21lcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0JyYW5jaCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0Ftb3VudCcpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmVjZW50T3JkZXJzLm1hcChvcmRlciA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogb3JkZXIuaWQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1yb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiBCUkFORC5wcmltYXJ5IH0gfSwgb3JkZXIuaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmN1c3RvbWVyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5icmFuY2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYmFkZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdHVzQmFkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYCR7U1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjNjY2J30yMGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFNUQVRVU19DT0xPUlNbb3JkZXIuc3RhdHVzXSB8fCAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7U1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjNjY2J301MGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIuc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBmb3JtYXRDdXJyZW5jeShvcmRlci5hbW91bnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBCcmFuZCBDb2xvcnNcbmNvbnN0IEJSQU5EID0ge1xuICAgIHByaW1hcnk6ICcjRkY0NzAwJyxcbiAgICBwcmltYXJ5TGlnaHQ6ICcjRkY2QjMzJyxcbiAgICBwcmltYXJ5RGFyazogJyNDQzM5MDAnLFxuICAgIGFjY2VudDogJyM0Q0FGNTAnLFxuICAgIGNhcmQ6ICcjMzAzNjQxJyxcbiAgICBjYXJkSG92ZXI6ICcjM2E0MTQ5JyxcbiAgICBib3JkZXI6ICcjNDU0ZDVkJyxcbiAgICB0ZXh0UHJpbWFyeTogJyNmZmYnLFxuICAgIHRleHRTZWNvbmRhcnk6ICcjOWFhNWIxJ1xufTtcblxuLy8gQ1NTIEtleWZyYW1lIGFuaW1hdGlvbnNcbmNvbnN0IGluamVjdFN0eWxlcyA9ICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29yZGVycy1wYWdlLWFuaW1hdGlvbnMnKSkgcmV0dXJuO1xuICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWwuaWQgPSAnb3JkZXJzLXBhZ2UtYW5pbWF0aW9ucyc7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IGBcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlSW5VcCB7XG4gICAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDIwcHgpOyB9XG4gICAgICAgICAgICB0byB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfVxuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtY2FyZCB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1jYXJkOmhvdmVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMnB4IDI0cHggcmdiYSgwLDAsMCwwLjMpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6ICR7QlJBTkQucHJpbWFyeX00MCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtYnRuIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjI1cyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtYnRuOmhvdmVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA2cHggMTZweCByZ2JhKDAsMCwwLDAuMykgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWJ0bjphY3RpdmUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1yb3cge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtcm93OmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICR7QlJBTkQuY2FyZEhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5zdGF0LWNhcmQtZmlsdGVyIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuc3RhdC1jYXJkLWZpbHRlcjpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6ICR7QlJBTkQucHJpbWFyeX02MCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5zdGF0LWNhcmQtYWN0aXZlIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJHtCUkFORC5wcmltYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDIwcHggJHtCUkFORC5wcmltYXJ5fTMwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1iYWRnZSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1iYWRnZTpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIGA7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbn07XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgICBjb250YWluZXI6IHtcbiAgICAgICAgcGFkZGluZzogJzI4cHgnLFxuICAgICAgICBmb250RmFtaWx5OiBcIidJbnRlcicsICdSb2JvdG8nLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgbWluSGVpZ2h0OiAnMTAwdmgnXG4gICAgfSxcbiAgICBoZWFkZXI6IHtcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCcsXG4gICAgICAgIGFuaW1hdGlvbjogJ2ZhZGVJblVwIDAuNnMgZWFzZS1vdXQnXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgICBmb250U2l6ZTogJzI4cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQudGV4dFByaW1hcnl9IDAlLCAke0JSQU5ELnByaW1hcnl9IDEwMCUpYCxcbiAgICAgICAgV2Via2l0QmFja2dyb3VuZENsaXA6ICd0ZXh0JyxcbiAgICAgICAgV2Via2l0VGV4dEZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgYmFja2dyb3VuZENsaXA6ICd0ZXh0JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4J1xuICAgIH0sXG4gICAgc3VidGl0bGU6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjNweCdcbiAgICB9LFxuICAgIGNvbnRyb2xzOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgZ2FwOiAnMTRweCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4JyxcbiAgICAgICAgZmxleFdyYXA6ICd3cmFwJ1xuICAgIH0sXG4gICAgZGF0ZUlucHV0OiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBwYWRkaW5nOiAnMTJweCAxNnB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBlYXNlJ1xuICAgIH0sXG4gICAgYnRuOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTZweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCdcbiAgICB9LFxuICAgIGJ0bkFjdGl2ZToge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC5wcmltYXJ5fSAwJSwgJHtCUkFORC5wcmltYXJ5RGFya30gMTAwJSlgLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgYm94U2hhZG93OiBgMCA0cHggMTRweCAke0JSQU5ELnByaW1hcnl9NTBgXG4gICAgfSxcbiAgICBidG5QcmltYXJ5OiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELnByaW1hcnl9IDAlLCAke0JSQU5ELnByaW1hcnlEYXJrfSAxMDAlKWAsXG4gICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxNHB4ICR7QlJBTkQucHJpbWFyeX01MGBcbiAgICB9LFxuICAgIHN0YXRzUm93OiB7XG4gICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDEyMHB4LCAxZnIpKScsXG4gICAgICAgIGdhcDogJzE0cHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4J1xuICAgIH0sXG4gICAgc3RhdENhcmQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxNDVkZWcsICR7QlJBTkQuY2FyZH0gMCUsICMyODJkMzUgMTAwJSlgLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxNHB4JyxcbiAgICAgICAgcGFkZGluZzogJzE2cHggMjBweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICAgIH0sXG4gICAgc3RhdFZhbHVlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMjRweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzRweCdcbiAgICB9LFxuICAgIHN0YXRMYWJlbDoge1xuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICB0YWJsZUNhcmQ6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxNDVkZWcsICR7QlJBTkQuY2FyZH0gMCUsICMyODJkMzUgMTAwJSlgLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxNnB4JyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMTUpJ1xuICAgIH0sXG4gICAgdGFibGU6IHtcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgYm9yZGVyQ29sbGFwc2U6ICdzZXBhcmF0ZScsXG4gICAgICAgIGJvcmRlclNwYWNpbmc6ICcwJ1xuICAgIH0sXG4gICAgdGg6IHtcbiAgICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgICAgIHBhZGRpbmc6ICcxNnB4IDE4cHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcxcHgnLFxuICAgICAgICBib3JkZXJCb3R0b206IGAycHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuMiknXG4gICAgfSxcbiAgICB0ZDoge1xuICAgICAgICBwYWRkaW5nOiAnMTZweCAxOHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBib3JkZXJCb3R0b206IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9NDBgLFxuICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJ1xuICAgIH0sXG4gICAgc3RhdHVzQmFkZ2U6IHtcbiAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMjBweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuNXB4JyxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICB9LFxuICAgIGl0ZW1UYWc6IHtcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgIGJhY2tncm91bmQ6IGAke0JSQU5ELmJvcmRlcn04MGAsXG4gICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIG1hcmdpblJpZ2h0OiAnNnB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCdcbiAgICB9LFxuICAgIGxvYWRlcjoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnByaW1hcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBub0RhdGE6IHtcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgcGFkZGluZzogJzYwcHgnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNnB4J1xuICAgIH0sXG4gICAgZG93bmxvYWRMaW5rOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELmFjY2VudH0gMCUsICMzODhFM0MgMTAwJSlgLFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICBwYWRkaW5nOiAnMTJweCAyMHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxNHB4ICR7QlJBTkQuYWNjZW50fTUwYCxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzhweCdcbiAgICB9LFxuICAgIGNsZWFyQnRuOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgcGFkZGluZzogJzEwcHggMTZweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCdcbiAgICB9XG59O1xuXG5jb25zdCBTVEFUVVNfQ09MT1JTID0ge1xuICAgIHBlbmRpbmc6ICcjRkZDMTA3JyxcbiAgICBhY2NlcHRlZDogJyMyMTk2RjMnLFxuICAgICdpbi1wcm9ncmVzcyc6ICcjOUMyN0IwJyxcbiAgICBhd2FpdGNvbmZpcm1hdGlvbjogJyNGRjk4MDAnLFxuICAgIGRlbGl2ZXJlZDogJyM0Q0FGNTAnLFxuICAgIGNhbmNlbGxlZDogJyM5ZTllOWUnLFxuICAgIHZlcmlmaWVkOiAnIzRDQUY1MCcsXG4gICAgZmFpbGVkOiAnI2Y0NDMzNidcbn07XG5cbmNvbnN0IFBBWU1FTlRfQ09MT1JTID0ge1xuICAgIGNvZDogJyNGRjk4MDAnLFxuICAgIG9ubGluZTogJyM0Q0FGNTAnXG59O1xuXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9IChhbW91bnQpID0+IHtcbiAgICByZXR1cm4gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1JTicsIHtcbiAgICAgICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgICAgIGN1cnJlbmN5OiAnSU5SJyxcbiAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAwXG4gICAgfSkuZm9ybWF0KGFtb3VudCB8fCAwKTtcbn07XG5cbmNvbnN0IE9yZGVyc1BhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3NlbGVjdGVkRGF0ZSwgc2V0U2VsZWN0ZWREYXRlXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VsZWN0ZWRGaWx0ZXIsIHNldFNlbGVjdGVkRmlsdGVyXSA9IHVzZVN0YXRlKCcnKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGluamVjdFN0eWxlcygpO1xuICAgICAgICBmZXRjaE9yZGVycygpO1xuICAgIH0sIFtzZWxlY3RlZERhdGUsIHNlbGVjdGVkRmlsdGVyXSk7XG5cbiAgICBjb25zdCBmZXRjaE9yZGVycyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB1cmwgPSAnL2FwaS92MS9hZG1pbi9kYXNoYm9hcmQvb3JkZXJzPyc7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXRlKSB1cmwgKz0gYGRhdGU9JHtzZWxlY3RlZERhdGV9JmA7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRGaWx0ZXIpIHVybCArPSBgZmlsdGVyPSR7c2VsZWN0ZWRGaWx0ZXJ9YDtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc2V0RGF0YShyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIG9yZGVyczonLCBlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0RGF0ZVJlbGF0aXZlID0gKG9mZnNldCkgPT4ge1xuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgb2Zmc2V0KTtcbiAgICAgICAgc2V0U2VsZWN0ZWREYXRlKGQudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2xlYXJGaWx0ZXJzID0gKCkgPT4ge1xuICAgICAgICBzZXRTZWxlY3RlZERhdGUoJycpO1xuICAgICAgICBzZXRTZWxlY3RlZEZpbHRlcignJyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZVN0cikgPT4ge1xuICAgICAgICBpZiAoIWRhdGVTdHIgfHwgZGF0ZVN0ciA9PT0gJ2FsbCcpIHJldHVybiAnQWxsIFRpbWUnO1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZVN0cikudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHtcbiAgICAgICAgICAgIHdlZWtkYXk6ICdsb25nJyxcbiAgICAgICAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgICAgICAgIG1vbnRoOiAnbG9uZycsXG4gICAgICAgICAgICBkYXk6ICdudW1lcmljJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgaXNUb2RheSA9IHNlbGVjdGVkRGF0ZSA9PT0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XG5cbiAgICBjb25zdCBmaWx0ZXJzID0gW1xuICAgICAgICB7IGtleTogJycsIGxhYmVsOiAnQWxsJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnRvdGFsLCBpY29uOiAn8J+TiicgfSxcbiAgICAgICAgeyBrZXk6ICd1bmFzc2lnbmVkJywgbGFiZWw6ICdVbmFzc2lnbmVkJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnVuYXNzaWduZWQsIGljb246ICfij7MnIH0sXG4gICAgICAgIHsga2V5OiAnY29kJywgbGFiZWw6ICdDT0QnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8uY29kLCBpY29uOiAn8J+StScgfSxcbiAgICAgICAgeyBrZXk6ICdvbmxpbmUnLCBsYWJlbDogJ09ubGluZScsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5vbmxpbmUsIGljb246ICfwn5KzJyB9LFxuICAgICAgICB7IGtleTogJ3BhaWQnLCBsYWJlbDogJ1BhaWQnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8ucGFpZCwgaWNvbjogJ+KchScgfSxcbiAgICAgICAgeyBrZXk6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnBlbmRpbmcsIGljb246ICfwn5SEJyB9LFxuICAgICAgICB7IGtleTogJ2RlbGl2ZXJlZCcsIGxhYmVsOiAnRGVsaXZlcmVkJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LmRlbGl2ZXJlZCwgaWNvbjogJ/Cfk6YnIH1cbiAgICBdO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jb250YWluZXIgfSxcbiAgICAgICAgLy8gSGVhZGVyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5oZWFkZXIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy50aXRsZSB9LCAn8J+ThSBPcmRlcnMgYnkgRGF0ZScpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN1YnRpdGxlIH0sIGZvcm1hdERhdGUoc2VsZWN0ZWREYXRlKSlcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBDb250cm9sc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY29udHJvbHMgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc2VsZWN0ZWREYXRlLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4gc2V0U2VsZWN0ZWREYXRlKGUudGFyZ2V0LnZhbHVlKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmRhdGVJbnB1dCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBkYXRlJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RGF0ZVJlbGF0aXZlKDApLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7IC4uLnN0eWxlcy5idG4sIC4uLihpc1RvZGF5ID8gc3R5bGVzLmJ0bkFjdGl2ZSA6IHt9KSB9LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nXG4gICAgICAgICAgICB9LCAn8J+ThiBUb2RheScpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldERhdGVSZWxhdGl2ZSgtMSksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5idG4sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bidcbiAgICAgICAgICAgIH0sICdZZXN0ZXJkYXknKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREYXRlUmVsYXRpdmUoLTcpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuYnRuLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nXG4gICAgICAgICAgICB9LCAnTGFzdCBXZWVrJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogY2xlYXJGaWx0ZXJzLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuY2xlYXJCdG4sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bidcbiAgICAgICAgICAgIH0sICfinJUgQ2xlYXIgQWxsJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9vcmRlcnMnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuZG93bmxvYWRMaW5rLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nXG4gICAgICAgICAgICB9LCAn8J+TpSBEb3dubG9hZCBDU1YnKVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIEZpbHRlciBTdGF0c1xuICAgICAgICBkYXRhICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0c1JvdyB9LFxuICAgICAgICAgICAgZmlsdGVycy5tYXAoZiA9PlxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBmLmtleSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBgc3RhdC1jYXJkLWZpbHRlciAke3NlbGVjdGVkRmlsdGVyID09PSBmLmtleSA/ICdzdGF0LWNhcmQtYWN0aXZlJyA6ICcnfWAsXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFNlbGVjdGVkRmlsdGVyKGYua2V5KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUgfSwgZi5jb3VudCB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCBgJHtmLmljb259ICR7Zi5sYWJlbH1gKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBUYWJsZSBvciBMb2FkaW5nXG4gICAgICAgIGxvYWRpbmcgP1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxvYWRlciB9LCAn4o+zIExvYWRpbmcgb3JkZXJzLi4uJykgOlxuICAgICAgICAgICAgKCFkYXRhIHx8IGRhdGEub3JkZXJzLmxlbmd0aCA9PT0gMCkgP1xuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5ub0RhdGEgfSwgJ/Cfk60gTm8gb3JkZXJzIGZvdW5kIGZvciB0aGlzIGZpbHRlcicpIDpcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGFibGVDYXJkLCBjbGFzc05hbWU6ICdvcmRlcnMtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGFibGUnLCB7IHN0eWxlOiBzdHlsZXMudGFibGUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdPcmRlciBJRCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQ3VzdG9tZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1Bob25lJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdBZGRyZXNzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdQYXJ0bmVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdTdGF0dXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1BheW1lbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0Ftb3VudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnSXRlbXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0Ym9keScsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcmRlcnMubWFwKChvcmRlciwgaSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogaSwgY2xhc3NOYW1lOiAnb3JkZXJzLXJvdycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogeyAuLi5zdHlsZXMudGQsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogQlJBTkQucHJpbWFyeSB9IH0sIG9yZGVyLm9yZGVySWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIuY3VzdG9tZXJOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLnBob25lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogeyAuLi5zdHlsZXMudGQsIG1heFdpZHRoOiAnMjAwcHgnLCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfSB9LCBvcmRlci5hZGRyZXNzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmRlbGl2ZXJ5UGFydG5lciB8fCAn4oCUJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuc3RhdHVzQmFkZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyM2NjYnfTIwYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7U1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjNjY2J301MGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJhZGdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9yZGVyLnN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc2cHgnLCBmbGV4V3JhcDogJ3dyYXAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGAke1BBWU1FTlRfQ09MT1JTW29yZGVyLnBheW1lbnRNZXRob2RdIHx8ICcjNjY2J30yMGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFBBWU1FTlRfQ09MT1JTW29yZGVyLnBheW1lbnRNZXRob2RdIHx8ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtQQVlNRU5UX0NPTE9SU1tvcmRlci5wYXltZW50TWV0aG9kXSB8fCAnIzY2Nid9NTBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJhZGdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvcmRlci5wYXltZW50TWV0aG9kKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGAke1NUQVRVU19DT0xPUlNbb3JkZXIucGF5bWVudFN0YXR1c10gfHwgJyM2NjYnfTIwYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogU1RBVFVTX0NPTE9SU1tvcmRlci5wYXltZW50U3RhdHVzXSB8fCAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7U1RBVFVTX0NPTE9SU1tvcmRlci5wYXltZW50U3RhdHVzXSB8fCAnIzY2Nid9NTBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJhZGdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvcmRlci5wYXltZW50U3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLnRkLCBmb250V2VpZ2h0OiAnNjAwJyB9IH0sIGZvcm1hdEN1cnJlbmN5KG9yZGVyLmFtb3VudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQucHJpbWFyeSwgbWFyZ2luUmlnaHQ6ICc4cHgnLCBmb250V2VpZ2h0OiAnNjAwJyB9IH0sIGAoJHtvcmRlci5pdGVtQ291bnR9KWApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyLml0ZW1zLnNsaWNlKDAsIDMpLm1hcCgoaXRlbSwgaikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsga2V5OiBqLCBzdHlsZTogc3R5bGVzLml0ZW1UYWcgfSwgaXRlbS5kaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXIuaXRlbXMubGVuZ3RoID4gMyAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyAuLi5zdHlsZXMuaXRlbVRhZywgYmFja2dyb3VuZDogQlJBTkQucHJpbWFyeSArICczMCcsIGNvbG9yOiBCUkFORC5wcmltYXJ5IH0gfSwgYCske29yZGVyLml0ZW1zLmxlbmd0aCAtIDN9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JkZXJzUGFnZTtcbiIsImltcG9ydCB7IERyb3Bab25lLCBEcm9wWm9uZUl0ZW0sIEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IEVkaXQgPSAoeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9KSA9PiB7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCB7IHBhcmFtcyB9ID0gcmVjb3JkO1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBjb25zdCBwYXRoID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgY29uc3Qga2V5ID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IGZpbGUgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUHJvcGVydHkpO1xuICAgIGNvbnN0IFtvcmlnaW5hbEtleSwgc2V0T3JpZ2luYWxLZXldID0gdXNlU3RhdGUoa2V5KTtcbiAgICBjb25zdCBbZmlsZXNUb1VwbG9hZCwgc2V0RmlsZXNUb1VwbG9hZF0gPSB1c2VTdGF0ZShbXSk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgLy8gaXQgbWVhbnMgbWVhbnMgdGhhdCBzb21lb25lIGhpdCBzYXZlIGFuZCBuZXcgZmlsZSBoYXMgYmVlbiB1cGxvYWRlZFxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgZmxpZXNUb1VwbG9hZCBzaG91bGQgYmUgY2xlYXJlZC5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gdXNlciB0dXJucyBvZmYgcmVkaXJlY3QgYWZ0ZXIgbmV3L2VkaXRcbiAgICAgICAgaWYgKCh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiBrZXkgIT09IG9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmICFvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiBBcnJheS5pc0FycmF5KGtleSkgJiYga2V5Lmxlbmd0aCAhPT0gb3JpZ2luYWxLZXkubGVuZ3RoKSkge1xuICAgICAgICAgICAgc2V0T3JpZ2luYWxLZXkoa2V5KTtcbiAgICAgICAgICAgIHNldEZpbGVzVG9VcGxvYWQoW10pO1xuICAgICAgICB9XG4gICAgfSwgW2tleSwgb3JpZ2luYWxLZXldKTtcbiAgICBjb25zdCBvblVwbG9hZCA9IChmaWxlcykgPT4ge1xuICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKGZpbGVzKTtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgZmlsZXMpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBudWxsKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZU11bHRpUmVtb3ZlID0gKHNpbmdsZUtleSkgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IChmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpIHx8IFtdKS5pbmRleE9mKHNpbmdsZUtleSk7XG4gICAgICAgIGNvbnN0IGZpbGVzVG9EZWxldGUgPSBmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5KSB8fCBbXTtcbiAgICAgICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5tYXAoKGN1cnJlbnRQYXRoLCBpKSA9PiAoaSAhPT0gaW5kZXggPyBjdXJyZW50UGF0aCA6IG51bGwpKTtcbiAgICAgICAgICAgIGxldCBuZXdQYXJhbXMgPSBmbGF0LnNldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5LCBbLi4uZmlsZXNUb0RlbGV0ZSwgaW5kZXhdKTtcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZsYXQuc2V0KG5ld1BhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHksIG5ld1BhdGgpO1xuICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgIC4uLnJlY29yZCxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IG5ld1BhcmFtcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgY2Fubm90IHJlbW92ZSBmaWxlIHdoZW4gdGhlcmUgYXJlIG5vIHVwbG9hZGVkIGZpbGVzIHlldCcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lLCB7IG9uQ2hhbmdlOiBvblVwbG9hZCwgbXVsdGlwbGU6IGN1c3RvbS5tdWx0aXBsZSwgdmFsaWRhdGU6IHtcbiAgICAgICAgICAgICAgICBtaW1lVHlwZXM6IGN1c3RvbS5taW1lVHlwZXMsXG4gICAgICAgICAgICAgICAgbWF4U2l6ZTogY3VzdG9tLm1heFNpemUsXG4gICAgICAgICAgICB9LCBmaWxlczogZmlsZXNUb1VwbG9hZCB9KSxcbiAgICAgICAgIWN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYgcGF0aCAmJiAhZmlsZXNUb1VwbG9hZC5sZW5ndGggJiYgZmlsZSAhPT0gbnVsbCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsgZmlsZW5hbWU6IGtleSwgc3JjOiBwYXRoLCBvblJlbW92ZTogaGFuZGxlUmVtb3ZlIH0pKSxcbiAgICAgICAgY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBrZXkubGVuZ3RoICYmIHBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwga2V5Lm1hcCgoc2luZ2xlS2V5LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgLy8gd2hlbiB3ZSByZW1vdmUgaXRlbXMgd2Ugc2V0IG9ubHkgcGF0aCBpbmRleCB0byBudWxscy5cbiAgICAgICAgICAgIC8vIGtleSBpcyBzdGlsbCB0aGVyZS4gVGhpcyBpcyBiZWNhdXNlXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHRvIG1haW50YWluIGFsbCB0aGUgaW5kZXhlcy4gU28gaGVyZSB3ZSBzaW1wbHkgZmlsdGVyIG91dCBlbGVtZW50cyB3aGljaFxuICAgICAgICAgICAgLy8gd2VyZSByZW1vdmVkIGFuZCBkaXNwbGF5IG9ubHkgd2hhdCB3YXMgbGVmdFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBwYXRoW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBrZXk6IHNpbmdsZUtleSwgZmlsZW5hbWU6IHNpbmdsZUtleSwgc3JjOiBwYXRoW2luZGV4XSwgb25SZW1vdmU6ICgpID0+IGhhbmRsZU11bHRpUmVtb3ZlKHNpbmdsZUtleSkgfSkpIDogJyc7XG4gICAgICAgIH0pKSkgOiAnJykpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEVkaXQ7XG4iLCJleHBvcnQgY29uc3QgQXVkaW9NaW1lVHlwZXMgPSBbXG4gICAgJ2F1ZGlvL2FhYycsXG4gICAgJ2F1ZGlvL21pZGknLFxuICAgICdhdWRpby94LW1pZGknLFxuICAgICdhdWRpby9tcGVnJyxcbiAgICAnYXVkaW8vb2dnJyxcbiAgICAnYXBwbGljYXRpb24vb2dnJyxcbiAgICAnYXVkaW8vb3B1cycsXG4gICAgJ2F1ZGlvL3dhdicsXG4gICAgJ2F1ZGlvL3dlYm0nLFxuICAgICdhdWRpby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IFZpZGVvTWltZVR5cGVzID0gW1xuICAgICd2aWRlby94LW1zdmlkZW8nLFxuICAgICd2aWRlby9tcGVnJyxcbiAgICAndmlkZW8vb2dnJyxcbiAgICAndmlkZW8vbXAydCcsXG4gICAgJ3ZpZGVvL3dlYm0nLFxuICAgICd2aWRlby8zZ3BwJyxcbiAgICAndmlkZW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBJbWFnZU1pbWVUeXBlcyA9IFtcbiAgICAnaW1hZ2UvYm1wJyxcbiAgICAnaW1hZ2UvZ2lmJyxcbiAgICAnaW1hZ2UvanBlZycsXG4gICAgJ2ltYWdlL3BuZycsXG4gICAgJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICdpbWFnZS92bmQubWljcm9zb2Z0Lmljb24nLFxuICAgICdpbWFnZS90aWZmJyxcbiAgICAnaW1hZ2Uvd2VicCcsXG5dO1xuZXhwb3J0IGNvbnN0IENvbXByZXNzZWRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcDInLFxuICAgICdhcHBsaWNhdGlvbi9nemlwJyxcbiAgICAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJyxcbiAgICAnYXBwbGljYXRpb24veC10YXInLFxuICAgICdhcHBsaWNhdGlvbi96aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuXTtcbmV4cG9ydCBjb25zdCBEb2N1bWVudE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1hYml3b3JkJyxcbiAgICAnYXBwbGljYXRpb24veC1mcmVlYXJjJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9vaycsXG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQucmFyJyxcbiAgICAnYXBwbGljYXRpb24vcnRmJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuXTtcbmV4cG9ydCBjb25zdCBUZXh0TWltZVR5cGVzID0gW1xuICAgICd0ZXh0L2NzcycsXG4gICAgJ3RleHQvY3N2JyxcbiAgICAndGV4dC9odG1sJyxcbiAgICAndGV4dC9jYWxlbmRhcicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdhcHBsaWNhdGlvbi9sZCtqc29uJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAndGV4dC9wbGFpbicsXG4gICAgJ2FwcGxpY2F0aW9uL3hodG1sK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3htbCcsXG4gICAgJ3RleHQveG1sJyxcbl07XG5leHBvcnQgY29uc3QgQmluYXJ5RG9jc01pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vZXB1Yit6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9wZGYnLFxuXTtcbmV4cG9ydCBjb25zdCBGb250TWltZVR5cGVzID0gW1xuICAgICdmb250L290ZicsXG4gICAgJ2ZvbnQvdHRmJyxcbiAgICAnZm9udC93b2ZmJyxcbiAgICAnZm9udC93b2ZmMicsXG5dO1xuZXhwb3J0IGNvbnN0IE90aGVyTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICdhcHBsaWNhdGlvbi94LWNzaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5pbnN0YWxsZXIreG1sJyxcbiAgICAnYXBwbGljYXRpb24veC1odHRwZC1waHAnLFxuICAgICdhcHBsaWNhdGlvbi94LXNoJyxcbiAgICAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnLFxuICAgICd2bmQudmlzaW8nLFxuICAgICdhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sJyxcbl07XG5leHBvcnQgY29uc3QgTWltZVR5cGVzID0gW1xuICAgIC4uLkF1ZGlvTWltZVR5cGVzLFxuICAgIC4uLlZpZGVvTWltZVR5cGVzLFxuICAgIC4uLkltYWdlTWltZVR5cGVzLFxuICAgIC4uLkNvbXByZXNzZWRNaW1lVHlwZXMsXG4gICAgLi4uRG9jdW1lbnRNaW1lVHlwZXMsXG4gICAgLi4uVGV4dE1pbWVUeXBlcyxcbiAgICAuLi5CaW5hcnlEb2NzTWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuICAgIC4uLkZvbnRNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG5dO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBdWRpb01pbWVUeXBlcywgSW1hZ2VNaW1lVHlwZXMgfSBmcm9tICcuLi90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMnO1xuY29uc3QgU2luZ2xlRmlsZSA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgbmFtZSwgcGF0aCwgbWltZVR5cGUsIHdpZHRoIH0gPSBwcm9wcztcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xuICAgICAgICBpZiAobWltZVR5cGUgJiYgSW1hZ2VNaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IHBhdGgsIHN0eWxlOiB7IG1heEhlaWdodDogd2lkdGgsIG1heFdpZHRoOiB3aWR0aCB9LCBhbHQ6IG5hbWUgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBBdWRpb01pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIsIHsgY29udHJvbHM6IHRydWUsIHNyYzogcGF0aCB9LFxuICAgICAgICAgICAgICAgIFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlXCIsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCJhdWRpb1wiKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJhY2tcIiwgeyBraW5kOiBcImNhcHRpb25zXCIgfSkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBhczogXCJhXCIsIGhyZWY6IHBhdGgsIG1sOiBcImRlZmF1bHRcIiwgc2l6ZTogXCJzbVwiLCByb3VuZGVkOiB0cnVlLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwgeyBpY29uOiBcIkRvY3VtZW50RG93bmxvYWRcIiwgY29sb3I6IFwid2hpdGVcIiwgbXI6IFwiZGVmYXVsdFwiIH0pLFxuICAgICAgICAgICAgbmFtZSkpKTtcbn07XG5jb25zdCBGaWxlID0gKHsgd2lkdGgsIHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBsZXQgcGF0aCA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuYW1lID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlTmFtZVByb3BlcnR5ID8gY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgOiBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IG1pbWVUeXBlID0gY3VzdG9tLm1pbWVUeXBlUHJvcGVydHlcbiAgICAgICAgJiYgZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5taW1lVHlwZVByb3BlcnR5KTtcbiAgICBpZiAoIXByb3BlcnR5LmN1c3RvbS5tdWx0aXBsZSkge1xuICAgICAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICAgICAgcGF0aCA9IGAke2N1c3RvbS5vcHRzLmJhc2VVcmx9LyR7bmFtZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IHBhdGg6IHBhdGgsIG5hbWU6IG5hbWUsIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlIH0pKTtcbiAgICB9XG4gICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgY29uc3QgYmFzZVVybCA9IGN1c3RvbS5vcHRzLmJhc2VVcmwgfHwgJyc7XG4gICAgICAgIHBhdGggPSBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IGAke2Jhc2VVcmx9LyR7bmFtZVtpbmRleF19YCk7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IGtleTogc2luZ2xlUGF0aCwgcGF0aDogc2luZ2xlUGF0aCwgbmFtZTogbmFtZVtpbmRleF0sIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlW2luZGV4XSB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRmlsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgTGlzdCA9IChwcm9wcykgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogMTAwLCAuLi5wcm9wcyB9KSk7XG5leHBvcnQgZGVmYXVsdCBMaXN0O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgU2hvdyA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcHJvcGVydHkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiBcIjEwMCVcIiwgLi4ucHJvcHMgfSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTaG93O1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgSW52b2ljZVJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9JbnZvaWNlUmVkaXJlY3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkludm9pY2VSZWRpcmVjdCA9IEludm9pY2VSZWRpcmVjdFxuaW1wb3J0IENTVlJlZGlyZWN0IGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ1NWUmVkaXJlY3QgPSBDU1ZSZWRpcmVjdFxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBPcmRlcnNQYWdlIGZyb20gJy4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlcnNQYWdlID0gT3JkZXJzUGFnZVxuaW1wb3J0IFVwbG9hZEVkaXRDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZEVkaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZEVkaXRDb21wb25lbnQgPSBVcGxvYWRFZGl0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkTGlzdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkTGlzdENvbXBvbmVudCA9IFVwbG9hZExpc3RDb21wb25lbnRcbmltcG9ydCBVcGxvYWRTaG93Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRTaG93Q29tcG9uZW50ID0gVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJuYW1lcyI6WyJJbnZvaWNlUmVkaXJlY3QiLCJwcm9wcyIsInJlY29yZCIsInJlc291cmNlIiwidXNlRWZmZWN0IiwiaWQiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInJlZGlyZWN0VXJsIiwiY29uc29sZSIsImxvZyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicGFkZGluZyIsInRleHRBbGlnbiIsImZvbnRGYW1pbHkiLCJjb2xvciIsIkNTVlJlZGlyZWN0IiwicmVzb3VyY2VJZCIsImV4cG9ydFVybCIsIkJSQU5EIiwicHJpbWFyeSIsInByaW1hcnlMaWdodCIsInByaW1hcnlEYXJrIiwiYWNjZW50IiwiYWNjZW50Qmx1ZSIsImRhcmsiLCJjYXJkIiwiY2FyZEhvdmVyIiwiYm9yZGVyIiwidGV4dFByaW1hcnkiLCJ0ZXh0U2Vjb25kYXJ5Iiwic3VjY2VzcyIsIndhcm5pbmciLCJkYW5nZXIiLCJpbmplY3RTdHlsZXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGVFbCIsInRleHRDb250ZW50IiwiaGVhZCIsImFwcGVuZENoaWxkIiwic3R5bGVzIiwiZGFzaGJvYXJkIiwiYmFja2dyb3VuZCIsIm1pbkhlaWdodCIsImhlYWRlciIsIm1hcmdpbkJvdHRvbSIsImFuaW1hdGlvbiIsInRpdGxlIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiV2Via2l0QmFja2dyb3VuZENsaXAiLCJXZWJraXRUZXh0RmlsbENvbG9yIiwiYmFja2dyb3VuZENsaXAiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImdhcCIsInN1YnRpdGxlIiwibGV0dGVyU3BhY2luZyIsInN0YXRzR3JpZCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJzdGF0Q2FyZCIsImJvcmRlclJhZGl1cyIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJzdGF0Q2FyZEhpZ2hsaWdodCIsInN0YXRDYXJkR2xvdyIsInRvcCIsInJpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJ0cmFuc2Zvcm0iLCJzdGF0VmFsdWUiLCJ6SW5kZXgiLCJzdGF0TGFiZWwiLCJ0ZXh0VHJhbnNmb3JtIiwic3RhdENoYW5nZSIsIm1hcmdpblRvcCIsInNlY3Rpb25UaXRsZSIsImNoYXJ0c0dyaWQiLCJjaGFydENhcmQiLCJjaGFydFRpdGxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImNoYXJ0Q29udGFpbmVyIiwianVzdGlmeUNvbnRlbnQiLCJiYXIiLCJiYXJMYWJlbCIsImxpc3RJdGVtIiwibGlzdFJhbmsiLCJtYXJnaW5SaWdodCIsImxpc3RJdGVtTmFtZSIsImZsZXgiLCJsaXN0SXRlbVZhbHVlIiwidGFibGVDYXJkIiwidGFibGUiLCJib3JkZXJDb2xsYXBzZSIsImJvcmRlclNwYWNpbmciLCJ0aCIsInRkIiwic3RhdHVzQmFkZ2UiLCJsb2FkZXIiLCJxdWlja0FjdGlvbnMiLCJmbGV4V3JhcCIsImFjdGlvbkJ0biIsImN1cnNvciIsInRleHREZWNvcmF0aW9uIiwiU1RBVFVTX0NPTE9SUyIsImFjdGl2ZSIsInBlbmRpbmciLCJleHBpcmVkIiwiY2FuY2VsbGVkIiwiZGVsaXZlcmVkIiwiY29uZmlybWVkIiwicHJlcGFyaW5nIiwicmVhZHkiLCJhY2NlcHRlZCIsIkRhc2hib2FyZCIsInN0YXRzIiwic2V0U3RhdHMiLCJ1c2VTdGF0ZSIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsImZldGNoU3RhdHMiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YSIsImpzb24iLCJlcnIiLCJmb3JtYXRDdXJyZW5jeSIsInZhbHVlIiwiSW50bCIsIk51bWJlckZvcm1hdCIsImN1cnJlbmN5IiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0IiwiZm9ybWF0TnVtYmVyIiwidG90YWxzIiwidG9kYXkiLCJyZXZlbnVlIiwiY2hhcnRzIiwiYmVzdFNlbGxlcnMiLCJicmFuY2hQZXJmb3JtYW5jZSIsIm9yZGVyc0J5U3RhdHVzIiwicGF5bWVudHMiLCJyZWNlbnRPcmRlcnMiLCJkYWlseVJldmVudWUiLCJtYXhEYWlseVJldmVudWUiLCJNYXRoIiwibWF4IiwibWFwIiwiZCIsIm9yZGVyQ291bnRzIiwiT2JqZWN0IiwidmFsdWVzIiwibWF4T3JkZXJDb3VudCIsImxlbmd0aCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsImNsYXNzTmFtZSIsInRoaXNXZWVrIiwidGhpc01vbnRoIiwiZ3Jvd3RoUGVyY2VudCIsImFicyIsIm9yZGVycyIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiYnJhbmNoZXMiLCJ2ZXJpZmllZCIsInNsaWNlIiwiaWR4Iiwia2V5IiwiZGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIndlZWtkYXkiLCJ0b0ZpeGVkIiwiZW50cmllcyIsImZpbHRlciIsIl8iLCJjb3VudCIsInN0YXR1cyIsInByb2R1Y3QiLCJuYW1lIiwicXVhbnRpdHkiLCJicmFuY2giLCJvbmxpbmUiLCJjb2QiLCJvcmRlciIsImN1c3RvbWVyIiwiYW1vdW50IiwiY29udGFpbmVyIiwiY29udHJvbHMiLCJkYXRlSW5wdXQiLCJvdXRsaW5lIiwidHJhbnNpdGlvbiIsImJ0biIsImJ0bkFjdGl2ZSIsImJ0blByaW1hcnkiLCJzdGF0c1JvdyIsInZlcnRpY2FsQWxpZ24iLCJpdGVtVGFnIiwibm9EYXRhIiwiZG93bmxvYWRMaW5rIiwiY2xlYXJCdG4iLCJhd2FpdGNvbmZpcm1hdGlvbiIsImZhaWxlZCIsIlBBWU1FTlRfQ09MT1JTIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwiT3JkZXJzUGFnZSIsInNldERhdGEiLCJzZWxlY3RlZERhdGUiLCJzZXRTZWxlY3RlZERhdGUiLCJzZWxlY3RlZEZpbHRlciIsInNldFNlbGVjdGVkRmlsdGVyIiwiZmV0Y2hPcmRlcnMiLCJ1cmwiLCJyZXN1bHQiLCJzZXREYXRlUmVsYXRpdmUiLCJvZmZzZXQiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInRvSVNPU3RyaW5nIiwic3BsaXQiLCJjbGVhckZpbHRlcnMiLCJmb3JtYXREYXRlIiwiZGF0ZVN0ciIsInllYXIiLCJtb250aCIsImRheSIsImlzVG9kYXkiLCJmaWx0ZXJzIiwibGFiZWwiLCJzdW1tYXJ5IiwidG90YWwiLCJpY29uIiwidW5hc3NpZ25lZCIsInBhaWQiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJwbGFjZWhvbGRlciIsIm9uQ2xpY2siLCJmIiwiaSIsIm9yZGVySWQiLCJjdXN0b21lck5hbWUiLCJwaG9uZSIsIm1heFdpZHRoIiwidGV4dE92ZXJmbG93Iiwid2hpdGVTcGFjZSIsImFkZHJlc3MiLCJkZWxpdmVyeVBhcnRuZXIiLCJwYXltZW50TWV0aG9kIiwicGF5bWVudFN0YXR1cyIsIml0ZW1Db3VudCIsIml0ZW1zIiwiaXRlbSIsImoiLCJ1c2VUcmFuc2xhdGlvbiIsImZsYXQiLCJGb3JtR3JvdXAiLCJMYWJlbCIsIkRyb3Bab25lIiwiRHJvcFpvbmVJdGVtIiwiQm94IiwiQnV0dG9uIiwiSWNvbiIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIlVwbG9hZEVkaXRDb21wb25lbnQiLCJVcGxvYWRMaXN0Q29tcG9uZW50IiwiVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUVBO0lBQ0E7SUFDQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUssSUFBSztNQUMvQixNQUFNO1FBQUVDLE1BQU07SUFBRUMsSUFBQUE7SUFBUyxHQUFDLEdBQUdGLEtBQUs7SUFFbENHLEVBQUFBLGVBQVMsQ0FBQyxNQUFNO0lBQ1osSUFBQSxJQUFJRixNQUFNLElBQUlBLE1BQU0sQ0FBQ0csRUFBRSxFQUFFO0lBQ3JCLE1BQUEsTUFBTUEsRUFBRSxHQUFHSCxNQUFNLENBQUNHLEVBQUU7SUFDcEI7SUFDQSxNQUFBLE1BQU1DLElBQUksR0FBR0gsUUFBUSxDQUFDRSxFQUFFLENBQUNFLFdBQVcsRUFBRSxDQUFDQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsY0FBYyxHQUFHLE9BQU87SUFDMUYsTUFBQSxNQUFNQyxXQUFXLEdBQUcsQ0FBQSxzQkFBQSxFQUF5QkgsSUFBSSxDQUFBLENBQUEsRUFBSUQsRUFBRSxDQUFBLENBQUU7SUFFekRLLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUEsbUNBQUEsRUFBc0NGLFdBQVcsRUFBRSxDQUFDO0lBQ2hFRyxNQUFBQSxNQUFNLENBQUNDLFFBQVEsQ0FBQ0MsSUFBSSxHQUFHTCxXQUFXO0lBQ3RDLElBQUE7SUFDSixFQUFBLENBQUMsRUFBRSxDQUFDUCxNQUFNLEVBQUVDLFFBQVEsQ0FBQyxDQUFDO0lB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
