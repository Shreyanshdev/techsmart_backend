import * as Models from "../../models/index.js";

const THEME = {
  primary: '#F5C518',
  secondary: '#FFFDD0',
  accent: '#4CAF50',
  text: '#1A1A1A',
  textLight: '#757575',
  success: '#4CAF50',
  error: '#FF5252',
  white: '#FFFFFF',
  background: '#FAFAFA'
};

const getCommonStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background: ${THEME.background}; color: ${THEME.text}; margin: 0; padding: 20px; -webkit-print-color-adjust: exact; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: ${THEME.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: ${THEME.white}; padding: 30px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center; }
    .logo-container { border: 2px solid ${THEME.primary}; padding: 8px 16px; border-radius: 8px; }
    .logo-text { font-size: 20px; font-weight: 800; color: ${THEME.primary}; letter-spacing: 1px; margin: 0; }
    .status-banner { margin: 20px; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
    .status-active { background: #DCFCE7; color: #166534; }
    .status-pending { background: #FEF3C7; color: #92400E; }
    .status-expired { background: #FEE2E2; color: #991B1B; }
    .section { padding: 20px 30px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: ${THEME.textLight}; margin-bottom: 15px; border-bottom: 1px solid #F0F0F0; padding-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .table th { text-align: left; padding: 12px; color: ${THEME.textLight}; font-size: 13px; border-bottom: 2px solid #F0F0F0; }
    .table td { padding: 15px 12px; border-bottom: 1px solid #F9F9F9; }
    .total-box { background: ${THEME.white}; padding: 30px; border-top: 2px solid #F0F0F0; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .grand-total { font-size: 24px; font-weight: 800; color: ${THEME.primary}; margin-top: 15px; padding-top: 15px; border-top: 1px solid #EEE; }
    .no-print { position: fixed; bottom: 20px; right: 20px; background: ${THEME.primary}; color: black; border: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(245,197,24,0.4); display: flex; align-items: center; gap: 8px; }
    @media print { .no-print { display: none; } body { padding: 0; background: white; } .invoice-card { box-shadow: none; border: none; max-width: 100%; width: 100%; } }
  </style>
`;

export const getAdminOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Models.Order.findById(orderId)
      .populate('customer', 'name phone email')
      .populate('branch', 'name address phone')
      .populate('items.id', 'name price discountPrice unit');

    if (!order) return res.status(404).send('Order not found');

    const paymentMethod = order.paymentDetails?.paymentMethod || 'online';
    const isPaid = order.paymentStatus === 'verified' || order.paymentStatus === 'completed';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Invoice #${order.orderId}</title>
          ${getCommonStyles()}
        </head>
        <body>
          <button class="no-print" onclick="window.print()">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print Invoice
          </button>
          
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="logo-container"><p class="logo-text">LUSH & PURES</p></div>
                <p style="margin: 10px 0 0; font-weight: bold; font-size: 14px;">Order #${order.orderId}</p>
                <p style="margin: 0; color: ${THEME.textLight}; font-size: 12px;">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div style="text-align: right">
                <p style="margin: 0; font-weight: bold;">${order.branch?.name || 'Main Branch'}</p>
                <p style="margin: 4px 0; color: ${THEME.textLight}; font-size: 12px; max-width: 200px;">${order.branch?.address || ''}</p>
                <p style="margin: 0; color: ${THEME.textLight}; font-size: 12px;">${order.branch?.phone || ''}</p>
              </div>
            </div>

            <div class="status-banner ${isPaid ? 'status-active' : 'status-pending'}">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 18px;">${isPaid ? 'Payment Completed' : 'Payment Pending'}</p>
                <p style="margin: 4px 0 0; font-size: 12px;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              </div>
              <div style="font-size: 24px;">${isPaid ? '✓' : '⌛'}</div>
            </div>

            <div class="section grid">
              <div>
                <p class="section-title">Customer Details</p>
                <p style="margin: 0; font-weight: bold;">${order.customer?.name || 'Valued Customer'}</p>
                <p style="margin: 4px 0; color: ${THEME.textLight}; font-size: 13px;">${order.customer?.phone || ''}</p>
                <p style="margin: 0; color: ${THEME.textLight}; font-size: 13px;">${order.customer?.email || ''}</p>
              </div>
              <div>
                <p class="section-title">Delivery Address</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;">${order.deliveryLocation?.address || 'N/A'}</p>
              </div>
            </div>

            <div class="section">
              <p class="section-title">Order Items</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style="text-align: center">Qty</th>
                    <th style="text-align: right">Price</th>
                    <th style="text-align: right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => {
      const product = item.id;
      const price = product?.discountPrice || product?.price || 0;
      return `
                      <tr>
                        <td>
                          <div style="font-weight: bold;">${product?.name || item.item}</div>
                          <div style="font-size: 11px; color: ${THEME.textLight}">${product?.unit || ''}</div>
                        </td>
                        <td style="text-align: center">${item.count || 1}</td>
                        <td style="text-align: right">₹${price.toFixed(2)}</td>
                        <td style="text-align: right">₹${(price * (item.count || 1)).toFixed(2)}</td>
                      </tr>
                    `;
    }).join('')}
                </tbody>
              </table>
            </div>

            <div class="total-box">
              <div class="total-row">
                <span style="color: ${THEME.textLight}">Subtotal</span>
                <span>₹${(order.totalPrice - (order.deliveryFee || 0)).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span style="color: ${THEME.textLight}">Delivery Fee</span>
                <span style="color: ${order.deliveryFee > 0 ? THEME.text : THEME.success}">${order.deliveryFee > 0 ? `₹${order.deliveryFee.toFixed(2)}` : 'FREE'}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total Amount</span>
                <span>₹${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style="text-align: center; padding: 30px; color: ${THEME.textLight}; font-size: 11px;">
              <p>Thank you for choosing Lush & Pure! Delivering freshness daily.</p>
              <p>© ${new Date().getFullYear()} Lush & Pures Dairy. This is a computer generated invoice.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error("Order Invoice Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAdminSubscriptionInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await Models.Subscription.findById(id)
      .populate('customer', 'name phone email')
      .populate('deliveryAddress');

    if (!sub) return res.status(404).send('Subscription not found');

    const status = sub.status;
    const isPaid = sub.paymentStatus === 'verified';

    // Calculate progress
    const total = sub.deliveries?.length || 0;
    const delivered = sub.deliveries?.filter(d => d.status === 'delivered').length || 0;
    const remaining = total - delivered;
    const progress = total > 0 ? Math.round((delivered / total) * 100) : 0;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Subscription Invoice #${sub.subscriptionId}</title>
          ${getCommonStyles()}
          <style>
             .progress-container { background: #EEE; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px; }
             .progress-bar { background: ${THEME.primary}; height: 100%; border-radius: 4px; }
             .stat-card { text-align: center; flex: 1; padding: 15px; border-right: 1px solid #F0F0F0; }
             .stat-card:last-child { border-right: none; }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()">Print Invoice</button>
          
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="logo-container"><p class="logo-text">LUSH & PURES</p></div>
                <p style="margin: 10px 0 0; font-weight: bold; font-size: 14px;">Subscription #${sub.subscriptionId}</p>
                <p style="margin: 0; color: ${THEME.textLight}; font-size: 12px;">${new Date(sub.startDate).toLocaleDateString('en-IN')} - ${new Date(sub.endDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div style="text-align: right">
                <p style="margin: 0; font-weight: bold;">Lush & Pures Dairy</p>
                <p style="margin: 4px 0; color: ${THEME.textLight}; font-size: 12px;">Fresh From Farm</p>
              </div>
            </div>

            <div class="status-banner ${status === 'active' ? 'status-active' : (status === 'pending' ? 'status-pending' : 'status-expired')}">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 18px;">${status.toUpperCase()}</p>
                <p style="margin: 4px 0 0; font-size: 12px;">${isPaid ? 'Payment Verified' : 'Payment Verification Pending'}</p>
              </div>
              <div style="font-size: 24px;">${status === 'active' ? '✓' : '!'}</div>
            </div>

            <div class="section">
              <p class="section-title">Delivery Progress</p>
              <div style="display: flex; background: #FDFDFD; border-radius: 12px; border: 1px solid #F0F0F0; margin-bottom: 20px;">
                <div class="stat-card">
                  <div style="font-size: 24px; font-weight: 800; color: ${THEME.success}">${delivered}</div>
                  <div style="font-size: 11px; color: ${THEME.textLight}">Delivered</div>
                </div>
                <div class="stat-card">
                  <div style="font-size: 24px; font-weight: 800; color: ${THEME.primary}">${remaining}</div>
                  <div style="font-size: 11px; color: ${THEME.textLight}">Remaining</div>
                </div>
                <div class="stat-card">
                  <div style="font-size: 24px; font-weight: 800;">${total}</div>
                  <div style="font-size: 11px; color: ${THEME.textLight}">Total</div>
                </div>
              </div>
              <div class="progress-container"><div class="progress-bar" style="width: ${progress}%"></div></div>
              <p style="text-align: right; font-size: 11px; color: ${THEME.textLight}; margin-top: 5px;">${progress}% Complete</p>
            </div>

            <div class="section grid">
              <div>
                <p class="section-title">Customer</p>
                <p style="margin: 0; font-weight: bold;">${sub.customer?.name || 'Customer'}</p>
                <p style="margin: 4px 0; color: ${THEME.textLight}; font-size: 13px;">${sub.customer?.phone || ''}</p>
              </div>
              <div>
                <p class="section-title">Address</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;">${sub.deliveryAddress?.addressLine1 || ''} ${sub.deliveryAddress?.addressLine2 || ''}<br>${sub.deliveryAddress?.city || ''}</p>
              </div>
            </div>

            <div class="section">
              <p class="section-title">Subscription Products</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center">Daily Qty</th>
                    <th style="text-align: right">Monthly Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${sub.products.map(p => `
                    <tr>
                      <td style="font-weight: bold;">${p.productName}</td>
                      <td style="text-align: center">${p.quantityValue} ${p.quantityUnit}</td>
                      <td style="text-align: right">₹${(p.monthlyPrice || 0).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="total-box">
              <div class="total-row grand-total">
                <span>Total Monthly Bill</span>
                <span>₹${(sub.bill || 0).toFixed(2)}</span>
              </div>
              <p style="margin-top: 10px; font-size: 12px; color: ${sub.paymentMethod === 'cod' ? '#92400E' : THEME.success}; font-weight: bold;">
                ${sub.paymentMethod === 'cod' ? '💵 To be collected on delivery' : '✓ Online Payment Method'}
              </p>
            </div>

            <div style="text-align: center; padding: 30px; color: ${THEME.textLight}; font-size: 11px;">
              <p>Subscription started on ${new Date(sub.startDate).toLocaleDateString('en-IN')}</p>
              <p>Invoice generated by Lush & Pures Admin Panel</p>
            </div>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error("Subscription Invoice Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
