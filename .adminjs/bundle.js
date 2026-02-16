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

    // Brand Colors - Re-imagined for a Premium, Modern look
    const BRAND$1 = {
      primary: '#FF4700',
      // Intense TakeSmart Orange
      primaryLight: '#FF7D4D',
      primaryDark: '#D93D00',
      secondary: '#0F172A',
      // Deep Slate
      accent: '#10B981',
      // Emerald
      info: '#3B82F6',
      // Blue
      warning: '#F59E0B',
      // Amber
      danger: '#EF4444',
      // Red
      surface: '#FFFFFF',
      // Pure White Card
      background: '#F1F5F9',
      // Slightly darker Slate 100 for better contrast
      textPrimary: '#1E293B',
      // Slate 800
      textSecondary: '#64748B',
      // Slate 500
      border: '#CBD5E1',
      cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    };

    // CSS Keyframe animations injected via style tag
    const injectStyles$1 = () => {
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
            0%, 100% { box-shadow: 0 0 20px ${BRAND$1.primary}40; }
            50% { box-shadow: 0 0 40px ${BRAND$1.primary}80; }
        }
        .highlight-card {
            animation: glow 3s infinite ease-in-out;
            border: 2px solid ${BRAND$1.primary} !important;
        }
        .dashboard-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            border: 1px solid ${BRAND$1.border} !important;
            background: #ffffff !important;
            box-shadow: ${BRAND$1.cardShadow} !important;
        }
        .dashboard-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
            border-color: ${BRAND$1.primary}50 !important;
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
            box-shadow: 0 15px 30px -5px ${BRAND$1.primary}60 !important;
            filter: brightness(1.2);
        }
        .dashboard-btn:active {
            transform: translateY(-1px) scale(0.98) !important;
        }
        .dashboard-btn-secondary:hover {
            box-shadow: 0 15px 30px -5px ${BRAND$1.secondary}60 !important;
        }
        .dashboard-btn-info:hover {
            box-shadow: 0 15px 30px -5px ${BRAND$1.info}60 !important;
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
            background: ${BRAND$1.background} !important;
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
            background: ${BRAND$1.primary};
            transition: width 0.3s ease, left 0.3s ease;
        }
        .dashboard-card:hover.premium-border::after {
            width: 80%;
            left: 10%;
        }
    `;
      document.head.appendChild(styleEl);
    };
    const styles$1 = {
      dashboard: {
        padding: '32px',
        background: BRAND$1.background,
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        color: BRAND$1.textPrimary
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
        color: BRAND$1.secondary,
        letterSpacing: '-0.5px',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      },
      subtitle: {
        color: BRAND$1.textSecondary,
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
        background: BRAND$1.primary,
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
        boxShadow: `0 8px 16px ${BRAND$1.primary}30`
      },
      actionBtnSecondary: {
        background: BRAND$1.secondary,
        boxShadow: `0 4px 12px ${BRAND$1.secondary}30`
      },
      actionBtnInfo: {
        background: BRAND$1.info,
        boxShadow: `0 4px 12px ${BRAND$1.info}30`
      },
      sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: BRAND$1.secondary,
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
        background: BRAND$1.surface,
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: BRAND$1.cardShadow,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },
      statCardHighlight: {
        background: `linear-gradient(135deg, ${BRAND$1.primary} 0%, ${BRAND$1.primaryDark} 100%)`,
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
        background: BRAND$1.surface,
        borderRadius: '24px',
        padding: '28px',
        boxShadow: BRAND$1.cardShadow,
        border: `1px solid ${BRAND$1.border}`
      },
      chartTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: BRAND$1.secondary,
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
        color: BRAND$1.textSecondary,
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
        borderBottom: `1px solid ${BRAND$1.border}`
      },
      listRank: {
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: `${BRAND$1.primary}15`,
        color: BRAND$1.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        marginRight: '14px'
      },
      listItemName: {
        flex: 1,
        color: BRAND$1.textPrimary,
        fontSize: '14px',
        fontWeight: '600'
      },
      listItemValue: {
        color: BRAND$1.primary,
        fontSize: '14px',
        fontWeight: '700'
      },
      tableCard: {
        background: BRAND$1.surface,
        borderRadius: '24px',
        padding: '28px',
        boxShadow: BRAND$1.cardShadow,
        border: `1px solid ${BRAND$1.border}`,
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
        color: BRAND$1.textSecondary,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '700'
      },
      td: {
        padding: '20px 16px',
        color: BRAND$1.textPrimary,
        fontSize: '14px',
        background: '#fff',
        borderTop: `1px solid ${BRAND$1.border}50`,
        borderBottom: `1px solid ${BRAND$1.border}50`,
        transition: 'all 0.2s ease'
      },
      tdFirst: {
        borderLeft: `1px solid ${BRAND$1.border}`,
        borderRadius: '12px 0 0 12px'
      },
      tdLast: {
        borderRight: `1px solid ${BRAND$1.border}`,
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
        background: BRAND$1.background,
        color: BRAND$1.primary,
        gap: '16px'
      }};
    const STATUS_COLORS$1 = {
      active: BRAND$1.accent,
      pending: BRAND$1.warning,
      expired: BRAND$1.danger,
      cancelled: BRAND$1.textSecondary,
      delivered: BRAND$1.accent,
      confirmed: BRAND$1.info,
      preparing: BRAND$1.warning,
      ready: '#0ea5e9',
      accepted: BRAND$1.info,
      'in-progress': BRAND$1.warning,
      'awaitconfirmation': '#8b5cf6'
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
        style: {
          ...styles$1.actionBtn,
          ...styles$1.actionBtnSecondary
        },
        className: 'dashboard-btn dashboard-btn-secondary'
      }, '📥 Export CSV'), /*#__PURE__*/React__default.default.createElement('a', {
        href: '/admin/resources/1_AllOrders',
        style: {
          ...styles$1.actionBtn,
          ...styles$1.actionBtnInfo
        },
        className: 'dashboard-btn dashboard-btn-info'
      }, '📋 All Orders')),
      /*#__PURE__*/
      // Revenue Overview Section
      React__default.default.createElement('div', {
        style: {
          marginBottom: '32px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.sectionTitle
      }, /*#__PURE__*/React__default.default.createElement('span', null, '💰'), 'Revenue Overview'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statsGrid
      },
      /*#__PURE__*/
      // Today's Revenue
      React__default.default.createElement('div', {
        style: {
          ...styles$1.statCard,
          ...styles$1.statCardHighlight
        },
        className: 'dashboard-card highlight-card'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statIcon
      }, '💰'), /*#__PURE__*/React__default.default.createElement('div', null, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, "Today's Revenue"), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.today)))),
      /*#__PURE__*/
      // This Week
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card premium-border'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statIcon
      }, '📅'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'This Week'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.thisWeek))),
      /*#__PURE__*/
      // This Month
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card premium-border'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statIcon
      }, '📈'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, 'This Month'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, formatCurrency(revenue.thisMonth)), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.statChange,
          background: revenue.growthPercent >= 0 ? `${BRAND$1.accent}15` : `${BRAND$1.danger}15`,
          color: revenue.growthPercent >= 0 ? BRAND$1.accent : BRAND$1.danger
        }
      }, revenue.growthPercent >= 0 ? '↗' : '↘', ` ${Math.abs(revenue.growthPercent)}%`)),
      /*#__PURE__*/
      // Today's Orders
      React__default.default.createElement('div', {
        style: styles$1.statCard,
        className: 'dashboard-card premium-border'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statIcon
      }, '📦'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, "Today's Orders"), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, today.orders)))),
      /*#__PURE__*/
      // Key Metrics
      React__default.default.createElement('div', {
        style: {
          marginBottom: '32px'
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.sectionTitle
      }, /*#__PURE__*/React__default.default.createElement('span', null, '📊'), 'Key Metrics'), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statsGrid
      }, [{
        label: 'Total Orders',
        value: formatNumber(totals.orders),
        icon: '📝'
      }, {
        label: 'Total Customers',
        value: formatNumber(totals.customers),
        icon: '👥'
      }, {
        label: 'Active Products',
        value: formatNumber(totals.products),
        icon: '🏷️'
      }, {
        label: 'Active Branches',
        value: formatNumber(totals.branches),
        icon: '🏢'
      }, {
        label: 'Delivered Orders',
        value: payments.verified,
        icon: '✅'
      }, {
        label: 'Pending/Active',
        value: payments.pending,
        icon: '⏳'
      }].map((item, idx) => /*#__PURE__*/React__default.default.createElement('div', {
        key: idx,
        style: styles$1.statCard,
        className: 'dashboard-card premium-border'
      }, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statIcon
      }, item.icon), /*#__PURE__*/React__default.default.createElement('div', null, /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statLabel
      }, item.label), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.statValue,
        className: 'stat-value'
      }, item.value)))))),
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
          textAlign: 'center',
          flex: 1
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        className: 'dashboard-bar',
        style: {
          ...styles$1.bar,
          height: `${d.revenue / maxDailyRevenue * 120}px`,
          background: `linear-gradient(to top, ${BRAND$1.primary}, ${BRAND$1.primaryLight})`,
          margin: '0 auto',
          minHeight: '4px'
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, new Date(d.date).toLocaleDateString('en-IN', {
        weekday: 'short'
      })), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: BRAND$1.textPrimary,
          fontWeight: '700',
          marginTop: '4px'
        }
      }, `₹${(d.revenue / 1000).toFixed(1)}k`))))),
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
          textAlign: 'center',
          flex: 1
        }
      }, /*#__PURE__*/React__default.default.createElement('div', {
        className: 'dashboard-bar',
        style: {
          ...styles$1.bar,
          height: `${count / maxOrderCount * 120}px`,
          background: STATUS_COLORS$1[status] || BRAND$1.secondary,
          margin: '0 auto',
          minHeight: '4px',
          opacity: 0.9
        }
      }), /*#__PURE__*/React__default.default.createElement('div', {
        style: styles$1.barLabel
      }, status.charAt(0).toUpperCase() + status.slice(1, 8)), /*#__PURE__*/React__default.default.createElement('div', {
        style: {
          ...styles$1.barLabel,
          color: BRAND$1.textPrimary,
          fontWeight: '700',
          marginTop: '4px'
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
          background: idx === 0 ? '#FBBF24' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : `${BRAND$1.primary}15`,
          color: idx <= 2 ? '#fff' : BRAND$1.primary
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
          background: `${BRAND$1.info}15`,
          color: BRAND$1.info
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
          background: BRAND$1.accent
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontSize: '13px',
          fontWeight: '500'
        }
      }, 'Online Payments')), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontWeight: '700'
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
          background: BRAND$1.warning
        }
      }), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontSize: '13px',
          fontWeight: '500'
        }
      }, 'Cash on Delivery')), /*#__PURE__*/React__default.default.createElement('span', {
        style: {
          color: BRAND$1.textPrimary,
          fontWeight: '700'
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
          ...styles$1.tdFirst,
          fontWeight: '700',
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
          background: `${STATUS_COLORS$1[order.status] || BRAND$1.secondary}15`,
          color: STATUS_COLORS$1[order.status] || BRAND$1.textPrimary
        }
      }, order.status)), /*#__PURE__*/React__default.default.createElement('td', {
        style: {
          ...styles$1.td,
          ...styles$1.tdLast,
          fontWeight: '700'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvSW52b2ljZVJlZGlyZWN0LmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9DU1ZSZWRpcmVjdC5qc3giLCIuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzeCIsIi4uL3NyYy9jb25maWcvY29tcG9uZW50cy9PcmRlcnNQYWdlLmpzeCIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvZmlsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBUaGlzIGNvbXBvbmVudCBwZXJmb3JtcyBhIHNpbXBsZSBjbGllbnQtc2lkZSByZWRpcmVjdCB0byB0aGUgcHJlbWl1bSBIVE1MIGludm9pY2UuXG4vLyBJdCBieXBhc3NlcyB0aGUgQWRtaW5KUyBBSkFYIGhhbmRsaW5nIHRvIGVuc3VyZSBhIGZ1bGwgcGFnZSBsb2FkIG9mIG91ciBjdXN0b20gdmlldy5cbmNvbnN0IEludm9pY2VSZWRpcmVjdCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZC5pZCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSByZWNvcmQuaWQ7XG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgaXQncyBhIHN1YnNjcmlwdGlvbiBvciBvcmRlclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3N1YnNjcmlwdGlvbicpID8gJ3N1YnNjcmlwdGlvbicgOiAnb3JkZXInO1xuICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSBgL2FwaS92MS9hZG1pbi9wcmV2aWV3LyR7dHlwZX0vJHtpZH1gO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg8J+agCBSZWRpcmVjdGluZyB0byBwcmVtaXVtIGludm9pY2U6ICR7cmVkaXJlY3RVcmx9YCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9XG4gICAgfSwgW3JlY29yZCwgcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ1ByZXBhcmluZyB5b3VyIHByZW1pdW0gaW52b2ljZS4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW52b2ljZVJlZGlyZWN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gVGhpcyBjb21wb25lbnQgcmVkaXJlY3RzIHRvIENTViBleHBvcnQgZW5kcG9pbnRcbmNvbnN0IENTVlJlZGlyZWN0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZXNvdXJjZSB9ID0gcHJvcHM7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb3J0IHR5cGUgYmFzZWQgb24gcmVzb3VyY2VcbiAgICAgICAgY29uc3QgcmVzb3VyY2VJZCA9IHJlc291cmNlLmlkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBleHBvcnRVcmwgPSAnL2FwaS92MS9hZG1pbi9leHBvcnQvb3JkZXJzJztcblxuICAgICAgICBpZiAocmVzb3VyY2VJZC5pbmNsdWRlcygnc3Vic2NyaXB0aW9uJykpIHtcbiAgICAgICAgICAgIGV4cG9ydFVybCA9ICcvYXBpL3YxL2FkbWluL2V4cG9ydC9zdWJzY3JpcHRpb25zJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGDwn5OKIFJlZGlyZWN0aW5nIHRvIENTViBleHBvcnQ6ICR7ZXhwb3J0VXJsfWApO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV4cG9ydFVybDtcbiAgICB9LCBbcmVzb3VyY2VdKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgY29sb3I6ICcjNzU3NTc1J1xuICAgICAgICB9XG4gICAgfSwgJ0dlbmVyYXRpbmcgQ1NWIHJlcG9ydC4uLicpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ1NWUmVkaXJlY3Q7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gQnJhbmQgQ29sb3JzIC0gUmUtaW1hZ2luZWQgZm9yIGEgUHJlbWl1bSwgTW9kZXJuIGxvb2tcbmNvbnN0IEJSQU5EID0ge1xuICAgIHByaW1hcnk6ICcjRkY0NzAwJywgICAgICAvLyBJbnRlbnNlIFRha2VTbWFydCBPcmFuZ2VcbiAgICBwcmltYXJ5TGlnaHQ6ICcjRkY3RDREJyxcbiAgICBwcmltYXJ5RGFyazogJyNEOTNEMDAnLFxuICAgIHNlY29uZGFyeTogJyMwRjE3MkEnLCAgICAvLyBEZWVwIFNsYXRlXG4gICAgYWNjZW50OiAnIzEwQjk4MScsICAgICAgIC8vIEVtZXJhbGRcbiAgICBpbmZvOiAnIzNCODJGNicsICAgICAgICAgLy8gQmx1ZVxuICAgIHdhcm5pbmc6ICcjRjU5RTBCJywgICAgICAvLyBBbWJlclxuICAgIGRhbmdlcjogJyNFRjQ0NDQnLCAgICAgICAvLyBSZWRcbiAgICBzdXJmYWNlOiAnI0ZGRkZGRicsICAgICAgLy8gUHVyZSBXaGl0ZSBDYXJkXG4gICAgYmFja2dyb3VuZDogJyNGMUY1RjknLCAgIC8vIFNsaWdodGx5IGRhcmtlciBTbGF0ZSAxMDAgZm9yIGJldHRlciBjb250cmFzdFxuICAgIHRleHRQcmltYXJ5OiAnIzFFMjkzQicsICAvLyBTbGF0ZSA4MDBcbiAgICB0ZXh0U2Vjb25kYXJ5OiAnIzY0NzQ4QicsLy8gU2xhdGUgNTAwXG4gICAgYm9yZGVyOiAnI0NCRDVFMScsICAgICAgIC8vIFNsYXRlIDMwMCAtIG1vcmUgdmlzaWJsZVxuICAgIHNoYWRvdzogJzAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCAycHggNHB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjA2KScsXG4gICAgY2FyZFNoYWRvdzogJzAgMTBweCAyNXB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwIDhweCAxMHB4IC02cHggcmdiYSgwLCAwLCAwLCAwLjEpJ1xufTtcblxuLy8gQ1NTIEtleWZyYW1lIGFuaW1hdGlvbnMgaW5qZWN0ZWQgdmlhIHN0eWxlIHRhZ1xuY29uc3QgaW5qZWN0U3R5bGVzID0gKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoYm9hcmQtYW5pbWF0aW9ucycpKSByZXR1cm47XG4gICAgY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbC5pZCA9ICdkYXNoYm9hcmQtYW5pbWF0aW9ucyc7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IGBcbiAgICAgICAgQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9UGx1cytKYWthcnRhK1NhbnM6d2dodEA0MDA7NTAwOzYwMDs3MDAmZGlzcGxheT1zd2FwJyk7XG5cbiAgICAgICAgQGtleWZyYW1lcyBmYWRlSW5VcCB7XG4gICAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1cHgpOyB9XG4gICAgICAgICAgICB0byB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfVxuICAgICAgICB9XG4gICAgICAgIEBrZXlmcmFtZXMgc2NhbGVJbiB7XG4gICAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTsgfVxuICAgICAgICAgICAgdG8geyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG4gICAgICAgIH1cbiAgICAgICAgQGtleWZyYW1lcyBwdWxzZS1zdWJ0bGUge1xuICAgICAgICAgICAgMCUsIDEwMCUgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlKDEpOyB9XG4gICAgICAgICAgICA1MCUgeyBvcGFjaXR5OiAwLjg7IHRyYW5zZm9ybTogc2NhbGUoMS4wMik7IH1cbiAgICAgICAgfVxuICAgICAgICBAa2V5ZnJhbWVzIGdsb3cge1xuICAgICAgICAgICAgMCUsIDEwMCUgeyBib3gtc2hhZG93OiAwIDAgMjBweCAke0JSQU5ELnByaW1hcnl9NDA7IH1cbiAgICAgICAgICAgIDUwJSB7IGJveC1zaGFkb3c6IDAgMCA0MHB4ICR7QlJBTkQucHJpbWFyeX04MDsgfVxuICAgICAgICB9XG4gICAgICAgIC5oaWdobGlnaHQtY2FyZCB7XG4gICAgICAgICAgICBhbmltYXRpb246IGdsb3cgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCAke0JSQU5ELnByaW1hcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1jYXJkIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjRzIGN1YmljLWJlemllcigwLjE3NSwgMC44ODUsIDAuMzIsIDEuMjc1KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAke0JSQU5ELmNhcmRTaGFkb3d9ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1jYXJkOmhvdmVyIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KSBzY2FsZSgxLjAyKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAyNXB4IDUwcHggLTEycHggcmdiYSgwLCAwLCAwLCAwLjE1KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAke0JSQU5ELnByaW1hcnl9NTAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHotaW5kZXg6IDEwO1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYnRuIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG46aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpIHNjYWxlKDEuMDUpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDE1cHggMzBweCAtNXB4ICR7QlJBTkQucHJpbWFyeX02MCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMik7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG46YWN0aXZlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KSBzY2FsZSgwLjk4KSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYnRuLXNlY29uZGFyeTpob3ZlciB7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDE1cHggMzBweCAtNXB4ICR7QlJBTkQuc2Vjb25kYXJ5fTYwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLmRhc2hib2FyZC1idG4taW5mbzpob3ZlciB7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDE1cHggMzBweCAtNXB4ICR7QlJBTkQuaW5mb302MCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtYmFyIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHggMTBweCA0cHggNHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC41cyBjdWJpYy1iZXppZXIoMC4xNzUsIDAuODg1LCAwLjMyLCAxLjI3NSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWJhcjpob3ZlciB7XG4gICAgICAgICAgICBmaWx0ZXI6IHNhdHVyYXRlKDEuOCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGVZKDEuMSkgdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDE1cHggcmdiYSgwLDAsMCwwLjEpO1xuICAgICAgICB9XG4gICAgICAgIC5kYXNoYm9hcmQtcm93IHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLXJvdzpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAke0JSQU5ELmJhY2tncm91bmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLnN0YXQtdmFsdWUge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBmYWRlSW5VcCAwLjZzIGN1YmljLWJlemllcigwLjE2LCAxLCAwLjMsIDEpO1xuICAgICAgICB9XG4gICAgICAgIC5wcmVtaXVtLWJvcmRlciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIH1cbiAgICAgICAgLnByZW1pdW0tYm9yZGVyOjphZnRlciB7XG4gICAgICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIGJvdHRvbTogMDtcbiAgICAgICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgICAgIHdpZHRoOiAwO1xuICAgICAgICAgICAgaGVpZ2h0OiAycHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAke0JSQU5ELnByaW1hcnl9O1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC4zcyBlYXNlLCBsZWZ0IDAuM3MgZWFzZTtcbiAgICAgICAgfVxuICAgICAgICAuZGFzaGJvYXJkLWNhcmQ6aG92ZXIucHJlbWl1bS1ib3JkZXI6OmFmdGVyIHtcbiAgICAgICAgICAgIHdpZHRoOiA4MCU7XG4gICAgICAgICAgICBsZWZ0OiAxMCU7XG4gICAgICAgIH1cbiAgICBgO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG59O1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gICAgZGFzaGJvYXJkOiB7XG4gICAgICAgIHBhZGRpbmc6ICczMnB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogQlJBTkQuYmFja2dyb3VuZCxcbiAgICAgICAgbWluSGVpZ2h0OiAnMTAwdmgnLFxuICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsICdJbnRlcicsIHN5c3RlbS11aSwgc2Fucy1zZXJpZlwiLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFByaW1hcnlcbiAgICB9LFxuICAgIGhlYWRlcjoge1xuICAgICAgICBtYXJnaW5Cb3R0b206ICczMnB4JyxcbiAgICAgICAgYW5pbWF0aW9uOiAnZmFkZUluVXAgMC44cyBlYXNlLW91dCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJ1xuICAgIH0sXG4gICAgdGl0bGU6IHtcbiAgICAgICAgZm9udFNpemU6ICczMnB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzgwMCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC5zZWNvbmRhcnksXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICctMC41cHgnLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc0cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICcxMnB4J1xuICAgIH0sXG4gICAgc3VidGl0bGU6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBxdWlja0FjdGlvbnM6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBnYXA6ICcxNHB4JyxcbiAgICAgICAgZmxleFdyYXA6ICd3cmFwJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMzJweCdcbiAgICB9LFxuICAgIGFjdGlvbkJ0bjoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzE0cHggMjhweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTVweCcsXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICcxMHB4JyxcbiAgICAgICAgYm94U2hhZG93OiBgMCA4cHggMTZweCAke0JSQU5ELnByaW1hcnl9MzBgXG4gICAgfSxcbiAgICBhY3Rpb25CdG5TZWNvbmRhcnk6IHtcbiAgICAgICAgYmFja2dyb3VuZDogQlJBTkQuc2Vjb25kYXJ5LFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxMnB4ICR7QlJBTkQuc2Vjb25kYXJ5fTMwYFxuICAgIH0sXG4gICAgYWN0aW9uQnRuSW5mbzoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5pbmZvLFxuICAgICAgICBib3hTaGFkb3c6IGAwIDRweCAxMnB4ICR7QlJBTkQuaW5mb30zMGBcbiAgICB9LFxuICAgIHNlY3Rpb25UaXRsZToge1xuICAgICAgICBmb250U2l6ZTogJzE4cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnNlY29uZGFyeSxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogJzEwcHgnXG4gICAgfSxcbiAgICBzdGF0c0dyaWQ6IHtcbiAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjQwcHgsIDFmcikpJyxcbiAgICAgICAgZ2FwOiAnMjBweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzMycHgnXG4gICAgfSxcbiAgICBzdGF0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5zdXJmYWNlLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcyMHB4JyxcbiAgICAgICAgcGFkZGluZzogJzI0cHgnLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICBib3hTaGFkb3c6IEJSQU5ELmNhcmRTaGFkb3csXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgICB9LFxuICAgIHN0YXRDYXJkSGlnaGxpZ2h0OiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELnByaW1hcnl9IDAlLCAke0JSQU5ELnByaW1hcnlEYXJrfSAxMDAlKWAsXG4gICAgICAgIGNvbG9yOiAnI0ZGRkZGRidcbiAgICB9LFxuICAgIHN0YXRWYWx1ZToge1xuICAgICAgICBmb250U2l6ZTogJzMwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnODAwJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnNnB4JyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJy0xcHgnXG4gICAgfSxcbiAgICBzdGF0TGFiZWw6IHtcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCdcbiAgICB9LFxuICAgIHN0YXRJY29uOiB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6ICcyMHB4JyxcbiAgICAgICAgcmlnaHQ6ICcyMHB4JyxcbiAgICAgICAgZm9udFNpemU6ICcyNHB4JyxcbiAgICAgICAgb3BhY2l0eTogMC4yXG4gICAgfSxcbiAgICBzdGF0Q2hhbmdlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBtYXJnaW5Ub3A6ICcxMnB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnNnB4JyxcbiAgICAgICAgcGFkZGluZzogJzRweCA4cHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICB3aWR0aDogJ2ZpdC1jb250ZW50J1xuICAgIH0sXG4gICAgY2hhcnRzR3JpZDoge1xuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzNTBweCwgMWZyKSknLFxuICAgICAgICBnYXA6ICcyNHB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMzJweCdcbiAgICB9LFxuICAgIGNoYXJ0Q2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5zdXJmYWNlLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcyNHB4JyxcbiAgICAgICAgcGFkZGluZzogJzI4cHgnLFxuICAgICAgICBib3hTaGFkb3c6IEJSQU5ELmNhcmRTaGFkb3csXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gXG4gICAgfSxcbiAgICBjaGFydFRpdGxlOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBjb2xvcjogQlJBTkQuc2Vjb25kYXJ5LFxuICAgICAgICBtYXJnaW5Cb3R0b206ICcyNHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAnMTBweCdcbiAgICB9LFxuICAgIGNoYXJ0Q29udGFpbmVyOiB7XG4gICAgICAgIGhlaWdodDogJzE4MHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICBnYXA6ICcxNnB4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1hcm91bmQnLFxuICAgICAgICBtYXJnaW5Ub3A6ICcxNnB4J1xuICAgIH0sXG4gICAgYmFyOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIG1heFdpZHRoOiAnNjBweCcsXG4gICAgICAgIG1pbldpZHRoOiAnMzVweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEycHggMTJweCA0cHggNHB4JyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEwcHggcmdiYSgwLDAsMCwwLjEpJ1xuICAgIH0sXG4gICAgYmFyTGFiZWw6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIG1hcmdpblRvcDogJzEycHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJ1xuICAgIH0sXG4gICAgbGlzdEl0ZW06IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgcGFkZGluZzogJzE2cHggMCcsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gXG4gICAgfSxcbiAgICBsaXN0UmFuazoge1xuICAgICAgICB3aWR0aDogJzI4cHgnLFxuICAgICAgICBoZWlnaHQ6ICcyOHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogYCR7QlJBTkQucHJpbWFyeX0xNWAsXG4gICAgICAgIGNvbG9yOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnLFxuICAgICAgICBtYXJnaW5SaWdodDogJzE0cHgnXG4gICAgfSxcbiAgICBsaXN0SXRlbU5hbWU6IHtcbiAgICAgICAgZmxleDogMSxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJ1xuICAgIH0sXG4gICAgbGlzdEl0ZW1WYWx1ZToge1xuICAgICAgICBjb2xvcjogQlJBTkQucHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCdcbiAgICB9LFxuICAgIHRhYmxlQ2FyZDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5zdXJmYWNlLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcyNHB4JyxcbiAgICAgICAgcGFkZGluZzogJzI4cHgnLFxuICAgICAgICBib3hTaGFkb3c6IEJSQU5ELmNhcmRTaGFkb3csXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICB9LFxuICAgIHRhYmxlOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJvcmRlckNvbGxhcHNlOiAnc2VwYXJhdGUnLFxuICAgICAgICBib3JkZXJTcGFjaW5nOiAnMCA4cHgnXG4gICAgfSxcbiAgICB0aDoge1xuICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMTZweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJzFweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnXG4gICAgfSxcbiAgICB0ZDoge1xuICAgICAgICBwYWRkaW5nOiAnMjBweCAxNnB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRvcDogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn01MGAsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn01MGAsXG4gICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycyBlYXNlJ1xuICAgIH0sXG4gICAgdGRGaXJzdDoge1xuICAgICAgICBib3JkZXJMZWZ0OiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEycHggMCAwIDEycHgnXG4gICAgfSxcbiAgICB0ZExhc3Q6IHtcbiAgICAgICAgYm9yZGVyUmlnaHQ6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMCAxMnB4IDEycHggMCdcbiAgICB9LFxuICAgIHN0YXR1c0JhZGdlOiB7XG4gICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICc0cHgnXG4gICAgfSxcbiAgICBsb2FkZXI6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwdmgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBCUkFORC5iYWNrZ3JvdW5kLFxuICAgICAgICBjb2xvcjogQlJBTkQucHJpbWFyeSxcbiAgICAgICAgZ2FwOiAnMTZweCdcbiAgICB9LFxuICAgIGxvYWRlclNwaW5uZXI6IHtcbiAgICAgICAgd2lkdGg6ICc0MHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnNDBweCcsXG4gICAgICAgIGJvcmRlcjogYDRweCBzb2xpZCAke0JSQU5ELnByaW1hcnl9MjBgLFxuICAgICAgICBib3JkZXJUb3A6IGA0cHggc29saWQgJHtCUkFORC5wcmltYXJ5fWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgIGFuaW1hdGlvbjogJ3B1bHNlLXN1YnRsZSAxLjVzIGluZmluaXRlIGVhc2UtaW4tb3V0J1xuICAgIH1cbn07XG5cbmNvbnN0IFNUQVRVU19DT0xPUlMgPSB7XG4gICAgYWN0aXZlOiBCUkFORC5hY2NlbnQsXG4gICAgcGVuZGluZzogQlJBTkQud2FybmluZyxcbiAgICBleHBpcmVkOiBCUkFORC5kYW5nZXIsXG4gICAgY2FuY2VsbGVkOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgIGRlbGl2ZXJlZDogQlJBTkQuYWNjZW50LFxuICAgIGNvbmZpcm1lZDogQlJBTkQuaW5mbyxcbiAgICBwcmVwYXJpbmc6IEJSQU5ELndhcm5pbmcsXG4gICAgcmVhZHk6ICcjMGVhNWU5JyxcbiAgICBhY2NlcHRlZDogQlJBTkQuaW5mbyxcbiAgICAnaW4tcHJvZ3Jlc3MnOiBCUkFORC53YXJuaW5nLFxuICAgICdhd2FpdGNvbmZpcm1hdGlvbic6ICcjOGI1Y2Y2J1xufTtcblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IFtzdGF0cywgc2V0U3RhdHNdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGluamVjdFN0eWxlcygpO1xuICAgICAgICBmZXRjaFN0YXRzKCk7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hTdGF0cyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvdjEvYWRtaW4vZGFzaGJvYXJkL3N0YXRzJyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHNldFN0YXRzKGRhdGEuZGF0YSB8fCB7fSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZldGNoIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICBzZXRFcnJvcignRmFpbGVkIHRvIGZldGNoIGRhc2hib2FyZCBkYXRhJyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1JTicsIHtcbiAgICAgICAgICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgICAgICAgICAgY3VycmVuY3k6ICdJTlInLFxuICAgICAgICAgICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwXG4gICAgICAgIH0pLmZvcm1hdCh2YWx1ZSB8fCAwKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUlOJykuZm9ybWF0KHZhbHVlIHx8IDApO1xuICAgIH07XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxvYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIG51bGwsICfij7MgTG9hZGluZyBEYXNoYm9hcmQuLi4nKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMubG9hZGVyLCBjb2xvcjogJyNmNDQzMzYnIH0gfSxcbiAgICAgICAgICAgIGDinYwgRXJyb3I6ICR7ZXJyb3J9YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmICghc3RhdHMpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSwgJ05vIGRhc2hib2FyZCBkYXRhIGF2YWlsYWJsZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFscyA9IHN0YXRzLnRvdGFscyB8fCB7fTtcbiAgICBjb25zdCB0b2RheSA9IHN0YXRzLnRvZGF5IHx8IHt9O1xuICAgIGNvbnN0IHJldmVudWUgPSBzdGF0cy5yZXZlbnVlIHx8IHt9O1xuICAgIGNvbnN0IGNoYXJ0cyA9IHN0YXRzLmNoYXJ0cyB8fCB7fTtcbiAgICBjb25zdCBiZXN0U2VsbGVycyA9IHN0YXRzLmJlc3RTZWxsZXJzIHx8IFtdO1xuICAgIGNvbnN0IGJyYW5jaFBlcmZvcm1hbmNlID0gc3RhdHMuYnJhbmNoUGVyZm9ybWFuY2UgfHwgW107XG4gICAgY29uc3Qgb3JkZXJzQnlTdGF0dXMgPSBzdGF0cy5vcmRlcnNCeVN0YXR1cyB8fCB7fTtcbiAgICBjb25zdCBwYXltZW50cyA9IHN0YXRzLnBheW1lbnRzIHx8IHt9O1xuICAgIGNvbnN0IHJlY2VudE9yZGVycyA9IHN0YXRzLnJlY2VudE9yZGVycyB8fCBbXTtcblxuICAgIGNvbnN0IGRhaWx5UmV2ZW51ZSA9IGNoYXJ0cy5kYWlseVJldmVudWUgfHwgW107XG4gICAgY29uc3QgbWF4RGFpbHlSZXZlbnVlID0gTWF0aC5tYXgoLi4uZGFpbHlSZXZlbnVlLm1hcChkID0+IGQucmV2ZW51ZSB8fCAwKSwgMSk7XG5cbiAgICBjb25zdCBvcmRlckNvdW50cyA9IE9iamVjdC52YWx1ZXMob3JkZXJzQnlTdGF0dXMpO1xuICAgIGNvbnN0IG1heE9yZGVyQ291bnQgPSBNYXRoLm1heCguLi4ob3JkZXJDb3VudHMubGVuZ3RoID4gMCA/IG9yZGVyQ291bnRzIDogWzFdKSwgMSk7XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmRhc2hib2FyZCB9LFxuICAgICAgICAvLyBIZWFkZXJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmhlYWRlciB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRpdGxlIH0sICfwn5OKIFNhbGVzIEFuYWx5dGljcyBEYXNoYm9hcmQnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdWJ0aXRsZSB9LFxuICAgICAgICAgICAgICAgIGBMYXN0IHVwZGF0ZWQ6ICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUXVpY2sgQWN0aW9uc1xuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMucXVpY2tBY3Rpb25zIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYWRtaW4vcGFnZXMvb3JkZXJzQnlEYXRlJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmFjdGlvbkJ0bixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkYXNoYm9hcmQtYnRuJ1xuICAgICAgICAgICAgfSwgJ/Cfk4UgT3JkZXJzIGJ5IERhdGUnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2EnLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogJy9hcGkvdjEvYWRtaW4vZXhwb3J0L29yZGVycycsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHsgLi4uc3R5bGVzLmFjdGlvbkJ0biwgLi4uc3R5bGVzLmFjdGlvbkJ0blNlY29uZGFyeSB9LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1idG4gZGFzaGJvYXJkLWJ0bi1zZWNvbmRhcnknXG4gICAgICAgICAgICB9LCAn8J+TpSBFeHBvcnQgQ1NWJyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdhJywge1xuICAgICAgICAgICAgICAgIGhyZWY6ICcvYWRtaW4vcmVzb3VyY2VzLzFfQWxsT3JkZXJzJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogeyAuLi5zdHlsZXMuYWN0aW9uQnRuLCAuLi5zdHlsZXMuYWN0aW9uQnRuSW5mbyB9LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1idG4gZGFzaGJvYXJkLWJ0bi1pbmZvJ1xuICAgICAgICAgICAgfSwgJ/Cfk4sgQWxsIE9yZGVycycpXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUmV2ZW51ZSBPdmVydmlldyBTZWN0aW9uXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgbWFyZ2luQm90dG9tOiAnMzJweCcgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnNlY3Rpb25UaXRsZSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCBudWxsLCAn8J+SsCcpLFxuICAgICAgICAgICAgICAgICdSZXZlbnVlIE92ZXJ2aWV3J1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0c0dyaWQgfSxcbiAgICAgICAgICAgICAgICAvLyBUb2RheSdzIFJldmVudWVcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5zdGF0Q2FyZCwgLi4uc3R5bGVzLnN0YXRDYXJkSGlnaGxpZ2h0IH0sIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkIGhpZ2hsaWdodC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdEljb24gfSwgJ/CfkrAnKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgXCJUb2RheSdzIFJldmVudWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRvZGF5KSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBXZWVrXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCBwcmVtaXVtLWJvcmRlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRJY29uIH0sICfwn5OFJyksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgJ1RoaXMgV2VlaycpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRoaXNXZWVrKSlcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIC8vIFRoaXMgTW9udGhcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkIHByZW1pdW0tYm9yZGVyJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdEljb24gfSwgJ/Cfk4gnKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRMYWJlbCB9LCAnVGhpcyBNb250aCcpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlLCBjbGFzc05hbWU6ICdzdGF0LXZhbHVlJyB9LCBmb3JtYXRDdXJyZW5jeShyZXZlbnVlLnRoaXNNb250aCkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0Q2hhbmdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHJldmVudWUuZ3Jvd3RoUGVyY2VudCA+PSAwID8gYCR7QlJBTkQuYWNjZW50fTE1YCA6IGAke0JSQU5ELmRhbmdlcn0xNWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHJldmVudWUuZ3Jvd3RoUGVyY2VudCA+PSAwID8gQlJBTkQuYWNjZW50IDogQlJBTkQuZGFuZ2VyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlbnVlLmdyb3d0aFBlcmNlbnQgPj0gMCA/ICfihpcnIDogJ+KGmCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBgICR7TWF0aC5hYnMocmV2ZW51ZS5ncm93dGhQZXJjZW50KX0lYFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAvLyBUb2RheSdzIE9yZGVyc1xuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQgcHJlbWl1bS1ib3JkZXInIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0SWNvbiB9LCAn8J+TpicpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdExhYmVsIH0sIFwiVG9kYXkncyBPcmRlcnNcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0VmFsdWUsIGNsYXNzTmFtZTogJ3N0YXQtdmFsdWUnIH0sIHRvZGF5Lm9yZGVycylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gS2V5IE1ldHJpY3NcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBtYXJnaW5Cb3R0b206ICczMnB4JyB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc2VjdGlvblRpdGxlIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIG51bGwsICfwn5OKJyksXG4gICAgICAgICAgICAgICAgJ0tleSBNZXRyaWNzJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0c0dyaWQgfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdUb3RhbCBPcmRlcnMnLCB2YWx1ZTogZm9ybWF0TnVtYmVyKHRvdGFscy5vcmRlcnMpLCBpY29uOiAn8J+TnScgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBsYWJlbDogJ1RvdGFsIEN1c3RvbWVycycsIHZhbHVlOiBmb3JtYXROdW1iZXIodG90YWxzLmN1c3RvbWVycyksIGljb246ICfwn5GlJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQWN0aXZlIFByb2R1Y3RzJywgdmFsdWU6IGZvcm1hdE51bWJlcih0b3RhbHMucHJvZHVjdHMpLCBpY29uOiAn8J+Pt++4jycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBsYWJlbDogJ0FjdGl2ZSBCcmFuY2hlcycsIHZhbHVlOiBmb3JtYXROdW1iZXIodG90YWxzLmJyYW5jaGVzKSwgaWNvbjogJ/Cfj6InIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdEZWxpdmVyZWQgT3JkZXJzJywgdmFsdWU6IHBheW1lbnRzLnZlcmlmaWVkLCBpY29uOiAn4pyFJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnUGVuZGluZy9BY3RpdmUnLCB2YWx1ZTogcGF5bWVudHMucGVuZGluZywgaWNvbjogJ+KPsycgfVxuICAgICAgICAgICAgICAgIF0ubWFwKChpdGVtLCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiBpZHgsIHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkIHByZW1pdW0tYm9yZGVyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRJY29uIH0sIGl0ZW0uaWNvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgaXRlbS5sYWJlbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnN0YXRWYWx1ZSwgY2xhc3NOYW1lOiAnc3RhdC12YWx1ZScgfSwgaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBDaGFydHMgUm93XG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydHNHcmlkIH0sXG4gICAgICAgICAgICAvLyBEYWlseSBSZXZlbnVlIENoYXJ0XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRUaXRsZSB9LCAn8J+TiiBEYWlseSBSZXZlbnVlIChMYXN0IDcgRGF5cyknKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDb250YWluZXIgfSxcbiAgICAgICAgICAgICAgICAgICAgZGFpbHlSZXZlbnVlLnNsaWNlKC03KS5tYXAoKGQsIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiBkLmRhdGUsIHN0eWxlOiB7IHRleHRBbGlnbjogJ2NlbnRlcicsIGZsZXg6IDEgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWJhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuYmFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHsoZC5yZXZlbnVlIC8gbWF4RGFpbHlSZXZlbnVlKSAqIDEyMH1weGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgJHtCUkFORC5wcmltYXJ5fSwgJHtCUkFORC5wcmltYXJ5TGlnaHR9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICcwIGF1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnNHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmJhckxhYmVsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGQuZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgd2Vla2RheTogJ3Nob3J0JyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMuYmFyTGFiZWwsIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSwgZm9udFdlaWdodDogJzcwMCcsIG1hcmdpblRvcDogJzRweCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBg4oK5JHsoZC5yZXZlbnVlIC8gMTAwMCkudG9GaXhlZCgxKX1rYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIE9yZGVyIFN0YXR1cyBDaGFydFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/Cfk4ggT3JkZXIgU3RhdHVzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q29udGFpbmVyIH0sXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG9yZGVyc0J5U3RhdHVzKS5maWx0ZXIoKFtfLCBjb3VudF0pID0+IGNvdW50ID4gMCkuc2xpY2UoMCwgNikubWFwKChbc3RhdHVzLCBjb3VudF0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGtleTogc3RhdHVzLCBzdHlsZTogeyB0ZXh0QWxpZ246ICdjZW50ZXInLCBmbGV4OiAxIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1iYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLmJhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogYCR7KGNvdW50IC8gbWF4T3JkZXJDb3VudCkgKiAxMjB9cHhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogU1RBVFVTX0NPTE9SU1tzdGF0dXNdIHx8IEJSQU5ELnNlY29uZGFyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0bycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICc0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC45XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuYmFyTGFiZWwgfSwgc3RhdHVzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RhdHVzLnNsaWNlKDEsIDgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy5iYXJMYWJlbCwgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LCBmb250V2VpZ2h0OiAnNzAwJywgbWFyZ2luVG9wOiAnNHB4JyB9IH0sIGNvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gQmVzdCBTZWxsaW5nIFByb2R1Y3RzXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY2hhcnRUaXRsZSB9LCAn8J+PhiBCZXN0IFNlbGxpbmcgUHJvZHVjdHMnKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBiZXN0U2VsbGVycy5zbGljZSgwLCA1KS5tYXAoKHByb2R1Y3QsIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsga2V5OiBpZHgsIHN0eWxlOiBzdHlsZXMubGlzdEl0ZW0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMubGlzdFJhbmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpZHggPT09IDAgPyAnI0ZCQkYyNCcgOiBpZHggPT09IDEgPyAnIzk0QTNCOCcgOiBpZHggPT09IDIgPyAnI0I0NTMwOScgOiBgJHtCUkFORC5wcmltYXJ5fTE1YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpZHggPD0gMiA/ICcjZmZmJyA6IEJSQU5ELnByaW1hcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGlkeCArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbU5hbWUgfSwgcHJvZHVjdC5uYW1lLnNsaWNlKDAsIDI1KSArIChwcm9kdWN0Lm5hbWUubGVuZ3RoID4gMjUgPyAnLi4uJyA6ICcnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtVmFsdWUgfSwgYCR7cHJvZHVjdC5xdWFudGl0eX0gc29sZGApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAvLyBCcmFuY2ggUGVyZm9ybWFuY2VcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydENhcmQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn4+iIEJyYW5jaCBQZXJmb3JtYW5jZScpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaFBlcmZvcm1hbmNlLnNsaWNlKDAsIDUpLm1hcCgoYnJhbmNoLCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGtleTogaWR4LCBzdHlsZTogc3R5bGVzLmxpc3RJdGVtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyAuLi5zdHlsZXMubGlzdFJhbmssIGJhY2tncm91bmQ6IGAke0JSQU5ELmluZm99MTVgLCBjb2xvcjogQlJBTkQuaW5mbyB9IH0sIGlkeCArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbU5hbWUgfSwgYnJhbmNoLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbVZhbHVlIH0sIGZvcm1hdEN1cnJlbmN5KGJyYW5jaC5yZXZlbnVlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgIC8vIFBheW1lbnQgTWV0aG9kc1xuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0Q2FyZCwgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNoYXJ0VGl0bGUgfSwgJ/CfkrMgUGF5bWVudCBNZXRob2RzJyksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBwYWRkaW5nOiAnMTJweCAwJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5saXN0SXRlbSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IHdpZHRoOiAnMTBweCcsIGhlaWdodDogJzEwcHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiBCUkFORC5hY2NlbnQgfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc1MDAnIH0gfSwgJ09ubGluZSBQYXltZW50cycpXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LCBmb250V2VpZ2h0OiAnNzAwJyB9IH0sIHBheW1lbnRzLm9ubGluZSlcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmxpc3RJdGVtIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHsgd2lkdGg6ICcxMHB4JywgaGVpZ2h0OiAnMTBweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6IEJSQU5ELndhcm5pbmcgfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBjb2xvcjogQlJBTkQudGV4dFByaW1hcnksIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc1MDAnIH0gfSwgJ0Nhc2ggb24gRGVsaXZlcnknKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IHN0eWxlOiB7IGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSwgZm9udFdlaWdodDogJzcwMCcgfSB9LCBwYXltZW50cy5jb2QpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gUmVjZW50IE9yZGVycyBUYWJsZVxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGFibGVDYXJkLCBjbGFzc05hbWU6ICdkYXNoYm9hcmQtY2FyZCcgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5jaGFydFRpdGxlIH0sICfwn6e+IFJlY2VudCBPcmRlcnMnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBzdHlsZTogc3R5bGVzLnRhYmxlIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGhlYWQnLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0cicsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnT3JkZXIgSUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdDdXN0b21lcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0JyYW5jaCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ1N0YXR1cycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0Ftb3VudCcpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5JywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmVjZW50T3JkZXJzLm1hcChvcmRlciA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCB7IGtleTogb3JkZXIuaWQsIGNsYXNzTmFtZTogJ2Rhc2hib2FyZC1yb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgLi4uc3R5bGVzLnRkRmlyc3QsIGZvbnRXZWlnaHQ6ICc3MDAnLCBjb2xvcjogQlJBTkQucHJpbWFyeSB9IH0sIG9yZGVyLmlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5jdXN0b21lciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSwgb3JkZXIuYnJhbmNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGFzaGJvYXJkLWJhZGdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGAke1NUQVRVU19DT0xPUlNbb3JkZXIuc3RhdHVzXSB8fCBCUkFORC5zZWNvbmRhcnl9MTVgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBTVEFUVVNfQ09MT1JTW29yZGVyLnN0YXR1c10gfHwgQlJBTkQudGV4dFByaW1hcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9yZGVyLnN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogeyAuLi5zdHlsZXMudGQsIC4uLnN0eWxlcy50ZExhc3QsIGZvbnRXZWlnaHQ6ICc3MDAnIH0gfSwgZm9ybWF0Q3VycmVuY3kob3JkZXIuYW1vdW50KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuLy8gQnJhbmQgQ29sb3JzXG5jb25zdCBCUkFORCA9IHtcbiAgICBwcmltYXJ5OiAnI0ZGNDcwMCcsXG4gICAgcHJpbWFyeUxpZ2h0OiAnI0ZGNkIzMycsXG4gICAgcHJpbWFyeURhcms6ICcjQ0MzOTAwJyxcbiAgICBhY2NlbnQ6ICcjNENBRjUwJyxcbiAgICBjYXJkOiAnIzMwMzY0MScsXG4gICAgY2FyZEhvdmVyOiAnIzNhNDE0OScsXG4gICAgYm9yZGVyOiAnIzQ1NGQ1ZCcsXG4gICAgdGV4dFByaW1hcnk6ICcjZmZmJyxcbiAgICB0ZXh0U2Vjb25kYXJ5OiAnIzlhYTViMSdcbn07XG5cbi8vIENTUyBLZXlmcmFtZSBhbmltYXRpb25zXG5jb25zdCBpbmplY3RTdHlsZXMgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmRlcnMtcGFnZS1hbmltYXRpb25zJykpIHJldHVybjtcbiAgICBjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsLmlkID0gJ29yZGVycy1wYWdlLWFuaW1hdGlvbnMnO1xuICAgIHN0eWxlRWwudGV4dENvbnRlbnQgPSBgXG4gICAgICAgIEBrZXlmcmFtZXMgZmFkZUluVXAge1xuICAgICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMHB4KTsgfVxuICAgICAgICAgICAgdG8geyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWNhcmQge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtY2FyZDpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTJweCAyNHB4IHJnYmEoMCwwLDAsMC4zKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAke0JSQU5ELnByaW1hcnl9NDAgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWJ0biB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4yNXMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLWJ0bjpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNnB4IDE2cHggcmdiYSgwLDAsMCwwLjMpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLm9yZGVycy1idG46YWN0aXZlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtcm93IHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAub3JkZXJzLXJvdzpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAke0JSQU5ELmNhcmRIb3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuc3RhdC1jYXJkLWZpbHRlciB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLnN0YXQtY2FyZC1maWx0ZXI6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAke0JSQU5ELnByaW1hcnl9NjAgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAuc3RhdC1jYXJkLWFjdGl2ZSB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6ICR7QlJBTkQucHJpbWFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAyMHB4ICR7QlJBTkQucHJpbWFyeX0zMCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtYmFkZ2Uge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC5vcmRlcnMtYmFkZ2U6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICBgO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG59O1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gICAgY29udGFpbmVyOiB7XG4gICAgICAgIHBhZGRpbmc6ICcyOHB4JyxcbiAgICAgICAgZm9udEZhbWlseTogXCInSW50ZXInLCAnUm9ib3RvJywgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIG1pbkhlaWdodDogJzEwMHZoJ1xuICAgIH0sXG4gICAgaGVhZGVyOiB7XG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnLFxuICAgICAgICBhbmltYXRpb246ICdmYWRlSW5VcCAwLjZzIGVhc2Utb3V0J1xuICAgIH0sXG4gICAgdGl0bGU6IHtcbiAgICAgICAgZm9udFNpemU6ICcyOHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke0JSQU5ELnRleHRQcmltYXJ5fSAwJSwgJHtCUkFORC5wcmltYXJ5fSAxMDAlKWAsXG4gICAgICAgIFdlYmtpdEJhY2tncm91bmRDbGlwOiAndGV4dCcsXG4gICAgICAgIFdlYmtpdFRleHRGaWxsQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGJhY2tncm91bmRDbGlwOiAndGV4dCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCdcbiAgICB9LFxuICAgIHN1YnRpdGxlOiB7XG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0U2Vjb25kYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4zcHgnXG4gICAgfSxcbiAgICBjb250cm9sczoge1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGdhcDogJzE0cHgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCcsXG4gICAgICAgIGZsZXhXcmFwOiAnd3JhcCdcbiAgICB9LFxuICAgIGRhdGVJbnB1dDoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMTZweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZSdcbiAgICB9LFxuICAgIGJ0bjoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgJHtCUkFORC5jYXJkfSAwJSwgIzI4MmQzNSAxMDAlKWAsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDE2cHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBmb250U2l6ZTogJzEzcHgnXG4gICAgfSxcbiAgICBidG5BY3RpdmU6IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICR7QlJBTkQucHJpbWFyeX0gMCUsICR7QlJBTkQucHJpbWFyeURhcmt9IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgIGJveFNoYWRvdzogYDAgNHB4IDE0cHggJHtCUkFORC5wcmltYXJ5fTUwYFxuICAgIH0sXG4gICAgYnRuUHJpbWFyeToge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC5wcmltYXJ5fSAwJSwgJHtCUkFORC5wcmltYXJ5RGFya30gMTAwJSlgLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgYm94U2hhZG93OiBgMCA0cHggMTRweCAke0JSQU5ELnByaW1hcnl9NTBgXG4gICAgfSxcbiAgICBzdGF0c1Jvdzoge1xuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgxMjBweCwgMWZyKSknLFxuICAgICAgICBnYXA6ICcxNHB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCdcbiAgICB9LFxuICAgIHN0YXRDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTRweCcsXG4gICAgICAgIHBhZGRpbmc6ICcxNnB4IDIwcHgnLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtCUkFORC5ib3JkZXJ9YCxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgICB9LFxuICAgIHN0YXRWYWx1ZToge1xuICAgICAgICBmb250U2l6ZTogJzI0cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRQcmltYXJ5LFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc0cHgnXG4gICAgfSxcbiAgICBzdGF0TGFiZWw6IHtcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC41cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgdGFibGVDYXJkOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IGBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAke0JSQU5ELmNhcmR9IDAlLCAjMjgyZDM1IDEwMCUpYCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0JSQU5ELmJvcmRlcn1gLFxuICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjE1KSdcbiAgICB9LFxuICAgIHRhYmxlOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJvcmRlckNvbGxhcHNlOiAnc2VwYXJhdGUnLFxuICAgICAgICBib3JkZXJTcGFjaW5nOiAnMCdcbiAgICB9LFxuICAgIHRoOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgICAgICBwYWRkaW5nOiAnMTZweCAxOHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMXB4JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMnB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwwLjIpJ1xuICAgIH0sXG4gICAgdGQ6IHtcbiAgICAgICAgcGFkZGluZzogJzE2cHggMThweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC50ZXh0UHJpbWFyeSxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfTQwYCxcbiAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZSdcbiAgICB9LFxuICAgIHN0YXR1c0JhZGdlOiB7XG4gICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzIwcHgnLFxuICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXG4gICAgfSxcbiAgICBpdGVtVGFnOiB7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICBiYWNrZ3JvdW5kOiBgJHtCUkFORC5ib3JkZXJ9ODBgLFxuICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBtYXJnaW5SaWdodDogJzZweCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzZweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfSxcbiAgICBsb2FkZXI6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgIGNvbG9yOiBCUkFORC5wcmltYXJ5LFxuICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJ1xuICAgIH0sXG4gICAgbm9EYXRhOiB7XG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIHBhZGRpbmc6ICc2MHB4JyxcbiAgICAgICAgY29sb3I6IEJSQU5ELnRleHRTZWNvbmRhcnksXG4gICAgICAgIGZvbnRTaXplOiAnMTZweCdcbiAgICB9LFxuICAgIGRvd25sb2FkTGluazoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtCUkFORC5hY2NlbnR9IDAlLCAjMzg4RTNDIDEwMCUpYCxcbiAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgcGFkZGluZzogJzEycHggMjBweCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgYm94U2hhZG93OiBgMCA0cHggMTRweCAke0JSQU5ELmFjY2VudH01MGAsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6ICc4cHgnXG4gICAgfSxcbiAgICBjbGVhckJ0bjoge1xuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBjb2xvcjogQlJBTkQudGV4dFNlY29uZGFyeSxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7QlJBTkQuYm9yZGVyfWAsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDE2cHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXG4gICAgfVxufTtcblxuY29uc3QgU1RBVFVTX0NPTE9SUyA9IHtcbiAgICBwZW5kaW5nOiAnI0ZGQzEwNycsXG4gICAgYWNjZXB0ZWQ6ICcjMjE5NkYzJyxcbiAgICAnaW4tcHJvZ3Jlc3MnOiAnIzlDMjdCMCcsXG4gICAgYXdhaXRjb25maXJtYXRpb246ICcjRkY5ODAwJyxcbiAgICBkZWxpdmVyZWQ6ICcjNENBRjUwJyxcbiAgICBjYW5jZWxsZWQ6ICcjOWU5ZTllJyxcbiAgICB2ZXJpZmllZDogJyM0Q0FGNTAnLFxuICAgIGZhaWxlZDogJyNmNDQzMzYnXG59O1xuXG5jb25zdCBQQVlNRU5UX0NPTE9SUyA9IHtcbiAgICBjb2Q6ICcjRkY5ODAwJyxcbiAgICBvbmxpbmU6ICcjNENBRjUwJ1xufTtcblxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAoYW1vdW50KSA9PiB7XG4gICAgcmV0dXJuIG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tSU4nLCB7XG4gICAgICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgICAgICBjdXJyZW5jeTogJ0lOUicsXG4gICAgICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMFxuICAgIH0pLmZvcm1hdChhbW91bnQgfHwgMCk7XG59O1xuXG5jb25zdCBPcmRlcnNQYWdlID0gKCkgPT4ge1xuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICAgIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFtzZWxlY3RlZERhdGUsIHNldFNlbGVjdGVkRGF0ZV0gPSB1c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlbGVjdGVkRmlsdGVyLCBzZXRTZWxlY3RlZEZpbHRlcl0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpbmplY3RTdHlsZXMoKTtcbiAgICAgICAgZmV0Y2hPcmRlcnMoKTtcbiAgICB9LCBbc2VsZWN0ZWREYXRlLCBzZWxlY3RlZEZpbHRlcl0pO1xuXG4gICAgY29uc3QgZmV0Y2hPcmRlcnMgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gJy9hcGkvdjEvYWRtaW4vZGFzaGJvYXJkL29yZGVycz8nO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF0ZSkgdXJsICs9IGBkYXRlPSR7c2VsZWN0ZWREYXRlfSZgO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRmlsdGVyKSB1cmwgKz0gYGZpbHRlcj0ke3NlbGVjdGVkRmlsdGVyfWA7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHNldERhdGEocmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBvcmRlcnM6JywgZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNldERhdGVSZWxhdGl2ZSA9IChvZmZzZXQpID0+IHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIG9mZnNldCk7XG4gICAgICAgIHNldFNlbGVjdGVkRGF0ZShkLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNsZWFyRmlsdGVycyA9ICgpID0+IHtcbiAgICAgICAgc2V0U2VsZWN0ZWREYXRlKCcnKTtcbiAgICAgICAgc2V0U2VsZWN0ZWRGaWx0ZXIoJycpO1xuICAgIH07XG5cbiAgICBjb25zdCBmb3JtYXREYXRlID0gKGRhdGVTdHIpID0+IHtcbiAgICAgICAgaWYgKCFkYXRlU3RyIHx8IGRhdGVTdHIgPT09ICdhbGwnKSByZXR1cm4gJ0FsbCBUaW1lJztcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVTdHIpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tSU4nLCB7XG4gICAgICAgICAgICB3ZWVrZGF5OiAnbG9uZycsXG4gICAgICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgICAgICAgICBtb250aDogJ2xvbmcnLFxuICAgICAgICAgICAgZGF5OiAnbnVtZXJpYydcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGlzVG9kYXkgPSBzZWxlY3RlZERhdGUgPT09IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuXG4gICAgY29uc3QgZmlsdGVycyA9IFtcbiAgICAgICAgeyBrZXk6ICcnLCBsYWJlbDogJ0FsbCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py50b3RhbCwgaWNvbjogJ/Cfk4onIH0sXG4gICAgICAgIHsga2V5OiAndW5hc3NpZ25lZCcsIGxhYmVsOiAnVW5hc3NpZ25lZCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py51bmFzc2lnbmVkLCBpY29uOiAn4o+zJyB9LFxuICAgICAgICB7IGtleTogJ2NvZCcsIGxhYmVsOiAnQ09EJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LmNvZCwgaWNvbjogJ/CfkrUnIH0sXG4gICAgICAgIHsga2V5OiAnb25saW5lJywgbGFiZWw6ICdPbmxpbmUnLCBjb3VudDogZGF0YT8uc3VtbWFyeT8ub25saW5lLCBpY29uOiAn8J+SsycgfSxcbiAgICAgICAgeyBrZXk6ICdwYWlkJywgbGFiZWw6ICdQYWlkJywgY291bnQ6IGRhdGE/LnN1bW1hcnk/LnBhaWQsIGljb246ICfinIUnIH0sXG4gICAgICAgIHsga2V5OiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5wZW5kaW5nLCBpY29uOiAn8J+UhCcgfSxcbiAgICAgICAgeyBrZXk6ICdkZWxpdmVyZWQnLCBsYWJlbDogJ0RlbGl2ZXJlZCcsIGNvdW50OiBkYXRhPy5zdW1tYXJ5Py5kZWxpdmVyZWQsIGljb246ICfwn5OmJyB9XG4gICAgXTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuY29udGFpbmVyIH0sXG4gICAgICAgIC8vIEhlYWRlclxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuaGVhZGVyIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMudGl0bGUgfSwgJ/Cfk4UgT3JkZXJzIGJ5IERhdGUnKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdWJ0aXRsZSB9LCBmb3JtYXREYXRlKHNlbGVjdGVkRGF0ZSkpXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gQ29udHJvbHNcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLmNvbnRyb2xzIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHNlbGVjdGVkRGF0ZSxcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogKGUpID0+IHNldFNlbGVjdGVkRGF0ZShlLnRhcmdldC52YWx1ZSksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlcy5kYXRlSW5wdXQsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnb3JkZXJzLWJ0bicsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgZGF0ZSdcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldERhdGVSZWxhdGl2ZSgwKSxcbiAgICAgICAgICAgICAgICBzdHlsZTogeyAuLi5zdHlsZXMuYnRuLCAuLi4oaXNUb2RheSA/IHN0eWxlcy5idG5BY3RpdmUgOiB7fSkgfSxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJ1xuICAgICAgICAgICAgfSwgJ/Cfk4YgVG9kYXknKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXREYXRlUmVsYXRpdmUoLTEpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuYnRuLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nXG4gICAgICAgICAgICB9LCAnWWVzdGVyZGF5JyksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gc2V0RGF0ZVJlbGF0aXZlKC03KSxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmJ0bixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJ1xuICAgICAgICAgICAgfSwgJ0xhc3QgV2VlaycpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGNsZWFyRmlsdGVycyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmNsZWFyQnRuLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1idG4nXG4gICAgICAgICAgICB9LCAn4pyVIENsZWFyIEFsbCcpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYScsIHtcbiAgICAgICAgICAgICAgICBocmVmOiAnL2FwaS92MS9hZG1pbi9leHBvcnQvb3JkZXJzJyxcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGVzLmRvd25sb2FkTGluayxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdvcmRlcnMtYnRuJ1xuICAgICAgICAgICAgfSwgJ/Cfk6UgRG93bmxvYWQgQ1NWJylcbiAgICAgICAgKSxcblxuICAgICAgICAvLyBGaWx0ZXIgU3RhdHNcbiAgICAgICAgZGF0YSAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdHNSb3cgfSxcbiAgICAgICAgICAgIGZpbHRlcnMubWFwKGYgPT5cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogZi5rZXksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMuc3RhdENhcmQsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogYHN0YXQtY2FyZC1maWx0ZXIgJHtzZWxlY3RlZEZpbHRlciA9PT0gZi5rZXkgPyAnc3RhdC1jYXJkLWFjdGl2ZScgOiAnJ31gLFxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBzZXRTZWxlY3RlZEZpbHRlcihmLmtleSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMuc3RhdFZhbHVlIH0sIGYuY291bnQgfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5zdGF0TGFiZWwgfSwgYCR7Zi5pY29ufSAke2YubGFiZWx9YClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLy8gVGFibGUgb3IgTG9hZGluZ1xuICAgICAgICBsb2FkaW5nID9cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgc3R5bGU6IHN0eWxlcy5sb2FkZXIgfSwgJ+KPsyBMb2FkaW5nIG9yZGVycy4uLicpIDpcbiAgICAgICAgICAgICghZGF0YSB8fCBkYXRhLm9yZGVycy5sZW5ndGggPT09IDApID9cbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiBzdHlsZXMubm9EYXRhIH0sICfwn5OtIE5vIG9yZGVycyBmb3VuZCBmb3IgdGhpcyBmaWx0ZXInKSA6XG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogc3R5bGVzLnRhYmxlQ2FyZCwgY2xhc3NOYW1lOiAnb3JkZXJzLWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBzdHlsZTogc3R5bGVzLnRhYmxlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aGVhZCcsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndHInLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnT3JkZXIgSUQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0N1c3RvbWVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdQaG9uZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnQWRkcmVzcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnUGFydG5lcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aCcsIHsgc3R5bGU6IHN0eWxlcy50aCB9LCAnU3RhdHVzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdQYXltZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RoJywgeyBzdHlsZTogc3R5bGVzLnRoIH0sICdBbW91bnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGgnLCB7IHN0eWxlOiBzdHlsZXMudGggfSwgJ0l0ZW1zJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGJvZHknLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3JkZXJzLm1hcCgob3JkZXIsIGkpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RyJywgeyBrZXk6IGksIGNsYXNzTmFtZTogJ29yZGVycy1yb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLnRkLCBmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6IEJSQU5ELnByaW1hcnkgfSB9LCBvcmRlci5vcmRlcklkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sIG9yZGVyLmN1c3RvbWVyTmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5waG9uZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLnRkLCBtYXhXaWR0aDogJzIwMHB4Jywgb3ZlcmZsb3c6ICdoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsIHdoaXRlU3BhY2U6ICdub3dyYXAnIH0gfSwgb3JkZXIuYWRkcmVzcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZCcsIHsgc3R5bGU6IHN0eWxlcy50ZCB9LCBvcmRlci5kZWxpdmVyeVBhcnRuZXIgfHwgJ+KAlCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLnN0YXR1c0JhZGdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYCR7U1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjNjY2J30yMGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogU1RBVFVTX0NPTE9SU1tvcmRlci5zdGF0dXNdIHx8ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1NUQVRVU19DT0xPUlNbb3JkZXIuc3RhdHVzXSB8fCAnIzY2Nid9NTBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1iYWRnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvcmRlci5zdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiBzdHlsZXMudGQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnNnB4JywgZmxleFdyYXA6ICd3cmFwJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgJHtQQVlNRU5UX0NPTE9SU1tvcmRlci5wYXltZW50TWV0aG9kXSB8fCAnIzY2Nid9MjBgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBQQVlNRU5UX0NPTE9SU1tvcmRlci5wYXltZW50TWV0aG9kXSB8fCAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7UEFZTUVOVF9DT0xPUlNbb3JkZXIucGF5bWVudE1ldGhvZF0gfHwgJyM2NjYnfTUwYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1iYWRnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIucGF5bWVudE1ldGhvZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcy5zdGF0dXNCYWRnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgJHtTVEFUVVNfQ09MT1JTW29yZGVyLnBheW1lbnRTdGF0dXNdIHx8ICcjNjY2J30yMGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFNUQVRVU19DT0xPUlNbb3JkZXIucGF5bWVudFN0YXR1c10gfHwgJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1NUQVRVU19DT0xPUlNbb3JkZXIucGF5bWVudFN0YXR1c10gfHwgJyM2NjYnfTUwYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ29yZGVycy1iYWRnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgb3JkZXIucGF5bWVudFN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgndGQnLCB7IHN0eWxlOiB7IC4uLnN0eWxlcy50ZCwgZm9udFdlaWdodDogJzYwMCcgfSB9LCBmb3JtYXRDdXJyZW5jeShvcmRlci5hbW91bnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RkJywgeyBzdHlsZTogc3R5bGVzLnRkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgY29sb3I6IEJSQU5ELnByaW1hcnksIG1hcmdpblJpZ2h0OiAnOHB4JywgZm9udFdlaWdodDogJzYwMCcgfSB9LCBgKCR7b3JkZXIuaXRlbUNvdW50fSlgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlci5pdGVtcy5zbGljZSgwLCAzKS5tYXAoKGl0ZW0sIGopID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGtleTogaiwgc3R5bGU6IHN0eWxlcy5pdGVtVGFnIH0sIGl0ZW0uZGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyLml0ZW1zLmxlbmd0aCA+IDMgJiYgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgc3R5bGU6IHsgLi4uc3R5bGVzLml0ZW1UYWcsIGJhY2tncm91bmQ6IEJSQU5ELnByaW1hcnkgKyAnMzAnLCBjb2xvcjogQlJBTkQucHJpbWFyeSB9IH0sIGArJHtvcmRlci5pdGVtcy5sZW5ndGggLSAzfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZGVyc1BhZ2U7XG4iLCJpbXBvcnQgeyBEcm9wWm9uZSwgRHJvcFpvbmVJdGVtLCBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0LCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBFZGl0ID0gKHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSkgPT4ge1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgeyBwYXJhbXMgfSA9IHJlY29yZDtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgY29uc3QgcGF0aCA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGNvbnN0IGtleSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBmaWxlID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVByb3BlcnR5KTtcbiAgICBjb25zdCBbb3JpZ2luYWxLZXksIHNldE9yaWdpbmFsS2V5XSA9IHVzZVN0YXRlKGtleSk7XG4gICAgY29uc3QgW2ZpbGVzVG9VcGxvYWQsIHNldEZpbGVzVG9VcGxvYWRdID0gdXNlU3RhdGUoW10pO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIC8vIGl0IG1lYW5zIG1lYW5zIHRoYXQgc29tZW9uZSBoaXQgc2F2ZSBhbmQgbmV3IGZpbGUgaGFzIGJlZW4gdXBsb2FkZWRcbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIGZsaWVzVG9VcGxvYWQgc2hvdWxkIGJlIGNsZWFyZWQuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHVzZXIgdHVybnMgb2ZmIHJlZGlyZWN0IGFmdGVyIG5ldy9lZGl0XG4gICAgICAgIGlmICgodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYga2V5ICE9PSBvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiAhb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgQXJyYXkuaXNBcnJheShrZXkpICYmIGtleS5sZW5ndGggIT09IG9yaWdpbmFsS2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHNldE9yaWdpbmFsS2V5KGtleSk7XG4gICAgICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKFtdKTtcbiAgICAgICAgfVxuICAgIH0sIFtrZXksIG9yaWdpbmFsS2V5XSk7XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoZmlsZXMpID0+IHtcbiAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChmaWxlcyk7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIGZpbGVzKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgbnVsbCk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVNdWx0aVJlbW92ZSA9IChzaW5nbGVLZXkpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSAoZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KSB8fCBbXSkuaW5kZXhPZihzaW5nbGVLZXkpO1xuICAgICAgICBjb25zdCBmaWxlc1RvRGVsZXRlID0gZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSkgfHwgW107XG4gICAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGgubWFwKChjdXJyZW50UGF0aCwgaSkgPT4gKGkgIT09IGluZGV4ID8gY3VycmVudFBhdGggOiBudWxsKSk7XG4gICAgICAgICAgICBsZXQgbmV3UGFyYW1zID0gZmxhdC5zZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSwgWy4uLmZpbGVzVG9EZWxldGUsIGluZGV4XSk7XG4gICAgICAgICAgICBuZXdQYXJhbXMgPSBmbGF0LnNldChuZXdQYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5LCBuZXdQYXRoKTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAuLi5yZWNvcmQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBuZXdQYXJhbXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGNhbm5vdCByZW1vdmUgZmlsZSB3aGVuIHRoZXJlIGFyZSBubyB1cGxvYWRlZCBmaWxlcyB5ZXQnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZSwgeyBvbkNoYW5nZTogb25VcGxvYWQsIG11bHRpcGxlOiBjdXN0b20ubXVsdGlwbGUsIHZhbGlkYXRlOiB7XG4gICAgICAgICAgICAgICAgbWltZVR5cGVzOiBjdXN0b20ubWltZVR5cGVzLFxuICAgICAgICAgICAgICAgIG1heFNpemU6IGN1c3RvbS5tYXhTaXplLFxuICAgICAgICAgICAgfSwgZmlsZXM6IGZpbGVzVG9VcGxvYWQgfSksXG4gICAgICAgICFjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIHBhdGggJiYgIWZpbGVzVG9VcGxvYWQubGVuZ3RoICYmIGZpbGUgIT09IG51bGwgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGZpbGVuYW1lOiBrZXksIHNyYzogcGF0aCwgb25SZW1vdmU6IGhhbmRsZVJlbW92ZSB9KSksXG4gICAgICAgIGN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYga2V5Lmxlbmd0aCAmJiBwYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIGtleS5tYXAoKHNpbmdsZUtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIC8vIHdoZW4gd2UgcmVtb3ZlIGl0ZW1zIHdlIHNldCBvbmx5IHBhdGggaW5kZXggdG8gbnVsbHMuXG4gICAgICAgICAgICAvLyBrZXkgaXMgc3RpbGwgdGhlcmUuIFRoaXMgaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBtYWludGFpbiBhbGwgdGhlIGluZGV4ZXMuIFNvIGhlcmUgd2Ugc2ltcGx5IGZpbHRlciBvdXQgZWxlbWVudHMgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlcmUgcmVtb3ZlZCBhbmQgZGlzcGxheSBvbmx5IHdoYXQgd2FzIGxlZnRcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsga2V5OiBzaW5nbGVLZXksIGZpbGVuYW1lOiBzaW5nbGVLZXksIHNyYzogcGF0aFtpbmRleF0sIG9uUmVtb3ZlOiAoKSA9PiBoYW5kbGVNdWx0aVJlbW92ZShzaW5nbGVLZXkpIH0pKSA6ICcnO1xuICAgICAgICB9KSkpIDogJycpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBFZGl0O1xuIiwiZXhwb3J0IGNvbnN0IEF1ZGlvTWltZVR5cGVzID0gW1xuICAgICdhdWRpby9hYWMnLFxuICAgICdhdWRpby9taWRpJyxcbiAgICAnYXVkaW8veC1taWRpJyxcbiAgICAnYXVkaW8vbXBlZycsXG4gICAgJ2F1ZGlvL29nZycsXG4gICAgJ2FwcGxpY2F0aW9uL29nZycsXG4gICAgJ2F1ZGlvL29wdXMnLFxuICAgICdhdWRpby93YXYnLFxuICAgICdhdWRpby93ZWJtJyxcbiAgICAnYXVkaW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBWaWRlb01pbWVUeXBlcyA9IFtcbiAgICAndmlkZW8veC1tc3ZpZGVvJyxcbiAgICAndmlkZW8vbXBlZycsXG4gICAgJ3ZpZGVvL29nZycsXG4gICAgJ3ZpZGVvL21wMnQnLFxuICAgICd2aWRlby93ZWJtJyxcbiAgICAndmlkZW8vM2dwcCcsXG4gICAgJ3ZpZGVvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgSW1hZ2VNaW1lVHlwZXMgPSBbXG4gICAgJ2ltYWdlL2JtcCcsXG4gICAgJ2ltYWdlL2dpZicsXG4gICAgJ2ltYWdlL2pwZWcnLFxuICAgICdpbWFnZS9wbmcnLFxuICAgICdpbWFnZS9zdmcreG1sJyxcbiAgICAnaW1hZ2Uvdm5kLm1pY3Jvc29mdC5pY29uJyxcbiAgICAnaW1hZ2UvdGlmZicsXG4gICAgJ2ltYWdlL3dlYnAnLFxuXTtcbmV4cG9ydCBjb25zdCBDb21wcmVzc2VkTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAyJyxcbiAgICAnYXBwbGljYXRpb24vZ3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtdGFyJyxcbiAgICAnYXBwbGljYXRpb24vemlwJyxcbiAgICAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcbl07XG5leHBvcnQgY29uc3QgRG9jdW1lbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYWJpd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtZnJlZWFyYycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2snLFxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLnJhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3J0ZicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0Jyxcbl07XG5leHBvcnQgY29uc3QgVGV4dE1pbWVUeXBlcyA9IFtcbiAgICAndGV4dC9jc3MnLFxuICAgICd0ZXh0L2NzdicsXG4gICAgJ3RleHQvaHRtbCcsXG4gICAgJ3RleHQvY2FsZW5kYXInLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnYXBwbGljYXRpb24vbGQranNvbicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ3RleHQvcGxhaW4nLFxuICAgICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94bWwnLFxuICAgICd0ZXh0L3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IEJpbmFyeURvY3NNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL2VwdWIremlwJyxcbiAgICAnYXBwbGljYXRpb24vcGRmJyxcbl07XG5leHBvcnQgY29uc3QgRm9udE1pbWVUeXBlcyA9IFtcbiAgICAnZm9udC9vdGYnLFxuICAgICdmb250L3R0ZicsXG4gICAgJ2ZvbnQvd29mZicsXG4gICAgJ2ZvbnQvd29mZjInLFxuXTtcbmV4cG9ydCBjb25zdCBPdGhlck1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAnYXBwbGljYXRpb24veC1jc2gnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJyxcbiAgICAnYXBwbGljYXRpb24veC1zaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJyxcbiAgICAndm5kLnZpc2lvJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IE1pbWVUeXBlcyA9IFtcbiAgICAuLi5BdWRpb01pbWVUeXBlcyxcbiAgICAuLi5WaWRlb01pbWVUeXBlcyxcbiAgICAuLi5JbWFnZU1pbWVUeXBlcyxcbiAgICAuLi5Db21wcmVzc2VkTWltZVR5cGVzLFxuICAgIC4uLkRvY3VtZW50TWltZVR5cGVzLFxuICAgIC4uLlRleHRNaW1lVHlwZXMsXG4gICAgLi4uQmluYXJ5RG9jc01pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbiAgICAuLi5Gb250TWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuXTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0IH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXVkaW9NaW1lVHlwZXMsIEltYWdlTWltZVR5cGVzIH0gZnJvbSAnLi4vdHlwZXMvbWltZS10eXBlcy50eXBlLmpzJztcbmNvbnN0IFNpbmdsZUZpbGUgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG5hbWUsIHBhdGgsIG1pbWVUeXBlLCB3aWR0aCB9ID0gcHJvcHM7XG4gICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEltYWdlTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBwYXRoLCBzdHlsZTogeyBtYXhIZWlnaHQ6IHdpZHRoLCBtYXhXaWR0aDogd2lkdGggfSwgYWx0OiBuYW1lIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWltZVR5cGUgJiYgQXVkaW9NaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiLCB7IGNvbnRyb2xzOiB0cnVlLCBzcmM6IHBhdGggfSxcbiAgICAgICAgICAgICAgICBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZVwiLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiYXVkaW9cIiksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyYWNrXCIsIHsga2luZDogXCJjYXB0aW9uc1wiIH0pKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYXM6IFwiYVwiLCBocmVmOiBwYXRoLCBtbDogXCJkZWZhdWx0XCIsIHNpemU6IFwic21cIiwgcm91bmRlZDogdHJ1ZSwgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJEb2N1bWVudERvd25sb2FkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1yOiBcImRlZmF1bHRcIiB9KSxcbiAgICAgICAgICAgIG5hbWUpKSk7XG59O1xuY29uc3QgRmlsZSA9ICh7IHdpZHRoLCByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgbGV0IHBhdGggPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbmFtZSA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA/IGN1c3RvbS5maWxlTmFtZVByb3BlcnR5IDogY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBtaW1lVHlwZSA9IGN1c3RvbS5taW1lVHlwZVByb3BlcnR5XG4gICAgICAgICYmIGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eSk7XG4gICAgaWYgKCFwcm9wZXJ0eS5jdXN0b20ubXVsdGlwbGUpIHtcbiAgICAgICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgICAgIHBhdGggPSBgJHtjdXN0b20ub3B0cy5iYXNlVXJsfS8ke25hbWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBwYXRoOiBwYXRoLCBuYW1lOiBuYW1lLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZSB9KSk7XG4gICAgfVxuICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBjdXN0b20ub3B0cy5iYXNlVXJsIHx8ICcnO1xuICAgICAgICBwYXRoID0gcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiBgJHtiYXNlVXJsfS8ke25hbWVbaW5kZXhdfWApO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBrZXk6IHNpbmdsZVBhdGgsIHBhdGg6IHNpbmdsZVBhdGgsIG5hbWU6IG5hbWVbaW5kZXhdLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZVtpbmRleF0gfSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEZpbGU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IExpc3QgPSAocHJvcHMpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IDEwMCwgLi4ucHJvcHMgfSkpO1xuZXhwb3J0IGRlZmF1bHQgTGlzdDtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IFNob3cgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHByb3BlcnR5IH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogXCIxMDAlXCIsIC4uLnByb3BzIH0pKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hvdztcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IEludm9pY2VSZWRpcmVjdCBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvSW52b2ljZVJlZGlyZWN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5JbnZvaWNlUmVkaXJlY3QgPSBJbnZvaWNlUmVkaXJlY3RcbmltcG9ydCBDU1ZSZWRpcmVjdCBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvQ1NWUmVkaXJlY3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNTVlJlZGlyZWN0ID0gQ1NWUmVkaXJlY3RcbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL2NvbmZpZy9jb21wb25lbnRzL0Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgT3JkZXJzUGFnZSBmcm9tICcuLi9zcmMvY29uZmlnL2NvbXBvbmVudHMvT3JkZXJzUGFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJzUGFnZSA9IE9yZGVyc1BhZ2VcbmltcG9ydCBVcGxvYWRFZGl0Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRFZGl0Q29tcG9uZW50ID0gVXBsb2FkRWRpdENvbXBvbmVudFxuaW1wb3J0IFVwbG9hZExpc3RDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZExpc3RDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZExpc3RDb21wb25lbnQgPSBVcGxvYWRMaXN0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkU2hvd0NvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkU2hvd0NvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkU2hvd0NvbXBvbmVudCA9IFVwbG9hZFNob3dDb21wb25lbnQiXSwibmFtZXMiOlsiSW52b2ljZVJlZGlyZWN0IiwicHJvcHMiLCJyZWNvcmQiLCJyZXNvdXJjZSIsInVzZUVmZmVjdCIsImlkIiwidHlwZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJyZWRpcmVjdFVybCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsInBhZGRpbmciLCJ0ZXh0QWxpZ24iLCJmb250RmFtaWx5IiwiY29sb3IiLCJDU1ZSZWRpcmVjdCIsInJlc291cmNlSWQiLCJleHBvcnRVcmwiLCJCUkFORCIsInByaW1hcnkiLCJwcmltYXJ5TGlnaHQiLCJwcmltYXJ5RGFyayIsInNlY29uZGFyeSIsImFjY2VudCIsImluZm8iLCJ3YXJuaW5nIiwiZGFuZ2VyIiwic3VyZmFjZSIsImJhY2tncm91bmQiLCJ0ZXh0UHJpbWFyeSIsInRleHRTZWNvbmRhcnkiLCJib3JkZXIiLCJjYXJkU2hhZG93IiwiaW5qZWN0U3R5bGVzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlRWwiLCJ0ZXh0Q29udGVudCIsImhlYWQiLCJhcHBlbmRDaGlsZCIsInN0eWxlcyIsImRhc2hib2FyZCIsIm1pbkhlaWdodCIsImhlYWRlciIsIm1hcmdpbkJvdHRvbSIsImFuaW1hdGlvbiIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJ0aXRsZSIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxldHRlclNwYWNpbmciLCJnYXAiLCJzdWJ0aXRsZSIsInF1aWNrQWN0aW9ucyIsImZsZXhXcmFwIiwiYWN0aW9uQnRuIiwiYm9yZGVyUmFkaXVzIiwiY3Vyc29yIiwidGV4dERlY29yYXRpb24iLCJib3hTaGFkb3ciLCJhY3Rpb25CdG5TZWNvbmRhcnkiLCJhY3Rpb25CdG5JbmZvIiwic2VjdGlvblRpdGxlIiwic3RhdHNHcmlkIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsInN0YXRDYXJkIiwicG9zaXRpb24iLCJvdmVyZmxvdyIsImZsZXhEaXJlY3Rpb24iLCJzdGF0Q2FyZEhpZ2hsaWdodCIsInN0YXRWYWx1ZSIsInN0YXRMYWJlbCIsIm9wYWNpdHkiLCJ0ZXh0VHJhbnNmb3JtIiwic3RhdEljb24iLCJ0b3AiLCJyaWdodCIsInN0YXRDaGFuZ2UiLCJtYXJnaW5Ub3AiLCJ3aWR0aCIsImNoYXJ0c0dyaWQiLCJjaGFydENhcmQiLCJjaGFydFRpdGxlIiwiY2hhcnRDb250YWluZXIiLCJoZWlnaHQiLCJiYXIiLCJtYXhXaWR0aCIsIm1pbldpZHRoIiwiYmFyTGFiZWwiLCJsaXN0SXRlbSIsImJvcmRlckJvdHRvbSIsImxpc3RSYW5rIiwibWFyZ2luUmlnaHQiLCJsaXN0SXRlbU5hbWUiLCJmbGV4IiwibGlzdEl0ZW1WYWx1ZSIsInRhYmxlQ2FyZCIsInRhYmxlIiwiYm9yZGVyQ29sbGFwc2UiLCJib3JkZXJTcGFjaW5nIiwidGgiLCJ0ZCIsImJvcmRlclRvcCIsInRyYW5zaXRpb24iLCJ0ZEZpcnN0IiwiYm9yZGVyTGVmdCIsInRkTGFzdCIsImJvcmRlclJpZ2h0Iiwic3RhdHVzQmFkZ2UiLCJsb2FkZXIiLCJTVEFUVVNfQ09MT1JTIiwiYWN0aXZlIiwicGVuZGluZyIsImV4cGlyZWQiLCJjYW5jZWxsZWQiLCJkZWxpdmVyZWQiLCJjb25maXJtZWQiLCJwcmVwYXJpbmciLCJyZWFkeSIsImFjY2VwdGVkIiwiRGFzaGJvYXJkIiwic3RhdHMiLCJzZXRTdGF0cyIsInVzZVN0YXRlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJlcnJvciIsInNldEVycm9yIiwiZmV0Y2hTdGF0cyIsInJlc3BvbnNlIiwiZmV0Y2giLCJkYXRhIiwianNvbiIsInN1Y2Nlc3MiLCJlcnIiLCJmb3JtYXRDdXJyZW5jeSIsInZhbHVlIiwiSW50bCIsIk51bWJlckZvcm1hdCIsImN1cnJlbmN5IiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0IiwiZm9ybWF0TnVtYmVyIiwidG90YWxzIiwidG9kYXkiLCJyZXZlbnVlIiwiY2hhcnRzIiwiYmVzdFNlbGxlcnMiLCJicmFuY2hQZXJmb3JtYW5jZSIsIm9yZGVyc0J5U3RhdHVzIiwicGF5bWVudHMiLCJyZWNlbnRPcmRlcnMiLCJkYWlseVJldmVudWUiLCJtYXhEYWlseVJldmVudWUiLCJNYXRoIiwibWF4IiwibWFwIiwiZCIsIm9yZGVyQ291bnRzIiwiT2JqZWN0IiwidmFsdWVzIiwibWF4T3JkZXJDb3VudCIsImxlbmd0aCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsImNsYXNzTmFtZSIsInRoaXNXZWVrIiwidGhpc01vbnRoIiwiZ3Jvd3RoUGVyY2VudCIsImFicyIsIm9yZGVycyIsImxhYmVsIiwiaWNvbiIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiYnJhbmNoZXMiLCJ2ZXJpZmllZCIsIml0ZW0iLCJpZHgiLCJrZXkiLCJzbGljZSIsImRhdGUiLCJtYXJnaW4iLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ3ZWVrZGF5IiwidG9GaXhlZCIsImVudHJpZXMiLCJmaWx0ZXIiLCJfIiwiY291bnQiLCJzdGF0dXMiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInByb2R1Y3QiLCJuYW1lIiwicXVhbnRpdHkiLCJicmFuY2giLCJvbmxpbmUiLCJjb2QiLCJvcmRlciIsImN1c3RvbWVyIiwiYW1vdW50IiwiY2FyZCIsImNhcmRIb3ZlciIsImNvbnRhaW5lciIsIldlYmtpdEJhY2tncm91bmRDbGlwIiwiV2Via2l0VGV4dEZpbGxDb2xvciIsImJhY2tncm91bmRDbGlwIiwiY29udHJvbHMiLCJkYXRlSW5wdXQiLCJvdXRsaW5lIiwiYnRuIiwiYnRuQWN0aXZlIiwiYnRuUHJpbWFyeSIsInN0YXRzUm93IiwidmVydGljYWxBbGlnbiIsIml0ZW1UYWciLCJub0RhdGEiLCJkb3dubG9hZExpbmsiLCJjbGVhckJ0biIsImF3YWl0Y29uZmlybWF0aW9uIiwiZmFpbGVkIiwiUEFZTUVOVF9DT0xPUlMiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJPcmRlcnNQYWdlIiwic2V0RGF0YSIsInNlbGVjdGVkRGF0ZSIsInNldFNlbGVjdGVkRGF0ZSIsInNlbGVjdGVkRmlsdGVyIiwic2V0U2VsZWN0ZWRGaWx0ZXIiLCJmZXRjaE9yZGVycyIsInVybCIsInJlc3VsdCIsInNldERhdGVSZWxhdGl2ZSIsIm9mZnNldCIsInNldERhdGUiLCJnZXREYXRlIiwidG9JU09TdHJpbmciLCJzcGxpdCIsImNsZWFyRmlsdGVycyIsImZvcm1hdERhdGUiLCJkYXRlU3RyIiwieWVhciIsIm1vbnRoIiwiZGF5IiwiaXNUb2RheSIsImZpbHRlcnMiLCJzdW1tYXJ5IiwidG90YWwiLCJ1bmFzc2lnbmVkIiwicGFpZCIsIm9uQ2hhbmdlIiwiZSIsInRhcmdldCIsInBsYWNlaG9sZGVyIiwib25DbGljayIsImYiLCJpIiwib3JkZXJJZCIsImN1c3RvbWVyTmFtZSIsInBob25lIiwidGV4dE92ZXJmbG93Iiwid2hpdGVTcGFjZSIsImFkZHJlc3MiLCJkZWxpdmVyeVBhcnRuZXIiLCJwYXltZW50TWV0aG9kIiwicGF5bWVudFN0YXR1cyIsIml0ZW1Db3VudCIsIml0ZW1zIiwiaiIsInVzZVRyYW5zbGF0aW9uIiwiZmxhdCIsIkZvcm1Hcm91cCIsIkxhYmVsIiwiRHJvcFpvbmUiLCJEcm9wWm9uZUl0ZW0iLCJCb3giLCJCdXR0b24iLCJJY29uIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiVXBsb2FkRWRpdENvbXBvbmVudCIsIlVwbG9hZExpc3RDb21wb25lbnQiLCJVcGxvYWRTaG93Q29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBRUE7SUFDQTtJQUNBLE1BQU1BLGVBQWUsR0FBSUMsS0FBSyxJQUFLO01BQy9CLE1BQU07UUFBRUMsTUFBTTtJQUFFQyxJQUFBQTtJQUFTLEdBQUMsR0FBR0YsS0FBSztJQUVsQ0csRUFBQUEsZUFBUyxDQUFDLE1BQU07SUFDWixJQUFBLElBQUlGLE1BQU0sSUFBSUEsTUFBTSxDQUFDRyxFQUFFLEVBQUU7SUFDckIsTUFBQSxNQUFNQSxFQUFFLEdBQUdILE1BQU0s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LENBQUMsYUFBYSxDQUFDQSxzQkFBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxLQUFLLE1BQU1BLHNCQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVOLENBQUM7O0lDekNELE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxNQUFNQSxzQkFBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQzs7SUNFN0UsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUs7SUFDeEIsSUFBSSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSztJQUM5QixJQUFJLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHd1Esc0JBQWMsRUFBRTtJQUNsRCxJQUFJLFFBQVF4USxzQkFBSyxDQUFDLGFBQWEsQ0FBQzBRLHNCQUFTLEVBQUUsSUFBSTtJQUMvQyxRQUFRMVEsc0JBQUssQ0FBQyxhQUFhLENBQUMyUSxrQkFBSyxFQUFFLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRyxRQUFRM1Esc0JBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7SUNWRGlSLE9BQU8sQ0FBQ0MsY0FBYyxHQUFHLEVBQUU7SUFFM0JELE9BQU8sQ0FBQ0MsY0FBYyxDQUFDalMsZUFBZSxHQUFHQSxlQUFlO0lBRXhEZ1MsT0FBTyxDQUFDQyxjQUFjLENBQUMzUSxXQUFXLEdBQUdBLFdBQVc7SUFFaEQwUSxPQUFPLENBQUNDLGNBQWMsQ0FBQ2hLLFNBQVMsR0FBR0EsU0FBUztJQUU1QytKLE9BQU8sQ0FBQ0MsY0FBYyxDQUFDeEQsVUFBVSxHQUFHQSxVQUFVO0lBRTlDdUQsT0FBTyxDQUFDQyxjQUFjLENBQUNDLG1CQUFtQixHQUFHQSxJQUFtQjtJQUVoRUYsT0FBTyxDQUFDQyxjQUFjLENBQUNFLG1CQUFtQixHQUFHQSxJQUFtQjtJQUVoRUgsT0FBTyxDQUFDQyxjQUFjLENBQUNHLG1CQUFtQixHQUFHQSxJQUFtQjs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOls0LDUsNiw3LDhdfQ==
