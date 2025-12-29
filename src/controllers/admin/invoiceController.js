import * as Models from "../../models/index.js";

// --- Utils ---
const formatCurrency = (amount) => {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
};

const calculateSessionYear = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 3 = April

  // Fiscal year starts April 1st
  let startYear = year;
  let endYear = year + 1;

  if (month < 3) {
    startYear = year - 1;
    endYear = year;
  }

  // Format: 24-25
  return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
};

const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    const nArr = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/) || [];
    if (!nArr) return '';
    let str = '';
    str += (nArr[1] != 0) ? (a[Number(nArr[1])] || b[nArr[1][0]] + ' ' + a[nArr[1][1]]) + 'Crore ' : '';
    str += (nArr[2] != 0) ? (a[Number(nArr[2])] || b[nArr[2][0]] + ' ' + a[nArr[2][1]]) + 'Lakh ' : '';
    str += (nArr[3] != 0) ? (a[Number(nArr[3])] || b[nArr[3][0]] + ' ' + a[nArr[3][1]]) + 'Thousand ' : '';
    str += (nArr[4] != 0) ? (a[Number(nArr[4])] || b[nArr[4][0]] + ' ' + a[nArr[4][1]]) + 'Hundred ' : '';
    str += (nArr[5] != 0) ? ((str != '') ? 'and ' : '') + ({
      0: '',
      1: 'One',
      2: 'Two',
      3: 'Three',
      4: 'Four',
      5: 'Five',
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine',
      10: 'Ten',
      11: 'Eleven',
      12: 'Twelve',
      13: 'Thirteen',
      14: 'Fourteen',
      15: 'Fifteen',
      16: 'Sixteen',
      17: 'Seventeen',
      18: 'Eighteen',
      19: 'Nineteen'
    }[Number(nArr[5])] || b[nArr[5][0]] + ' ' + a[nArr[5][1]]) + ' ' : '';
    return str;
  };

  const wholePart = Math.floor(num);
  const decimalPart = Math.round((num - wholePart) * 100);

  let result = inWords(wholePart) + 'Rupees ';
  if (decimalPart > 0) {
    result += 'and ' + inWords(decimalPart) + 'Paise ';
  }
  return result + 'Only';
};

// --- HTML Generator ---
const generateFormalInvoiceHTML = (data) => {
  // Fill empty rows to make the table look full
  const emptyRowsCount = Math.max(0, 5 - data.items.length);
  const emptyRows = Array(emptyRowsCount).fill(0).map(() => `
        <tr style="height: 24px;">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Tax Invoice</title>
        <style>
             body { font-family: 'Times New Roman', Times, serif; font-size: 11px; color: #000; padding: 20px; line-height: 1.3; }
             /* Print Button Style */
            .print-btn { position: fixed; bottom: 20px; right: 20px; background: #F5C518; color: #000; border: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-family: sans-serif; }
            @media print { .print-btn { display: none; } body { padding: 0; } }
            
            table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
            th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
            .no-border-table td { border: none; }
            .no-border { border: none; }
            .bold { font-weight: bold; }
            .right { text-align: right; }
            .center { text-align: center; }
            .header-title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin-bottom: 5px; }
            .company-name { font-size: 16px; font-weight: bold; }
            .small-text { font-size: 10px; }
            
            /* Specific Section Styles */
            .header-info-table td { width: 50%; }
            .items-table th { background-color: #f0f0f0; text-align: center; }
            .tax-table th { background-color: #f0f0f0; font-size: 10px; }
            .amount-words-row { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px; font-weight: bold; font-style: italic; background-color: #f9f9f9; }
            .footer-sign { height: 60px; vertical-align: bottom; text-align: right; padding-right: 20px; }
        </style>
    </head>
    <body onload="window.print()">
        <button class="print-btn" onclick="window.print()">Print Invoice</button>
        
        <div class="header-title">Tax Invoice</div>
        
        <!-- Header Info -->
        <table>
            <tr>
                <td style="width: 50%;">
                    <div class="company-name">${data.sellerName}</div>
                    <div>${data.sellerAddress}</div>
                    <div>GSTIN/UIN: <span class="bold">${data.sellerGstin}</span></div>
                    <div>State Name: ${data.sellerState}, Code: ${data.sellerStateCode}</div>
                </td>
                <td style="width: 50%; padding: 0;">
                    <table class="no-border-table" style="width: 100%; height: 100%;">
                        <tr>
                            <td style="border-bottom: 1px solid #000; border-right: 1px solid #000;">Invoice No.<br/><span class="bold">${data.invoiceNo}</span></td>
                            <td style="border-bottom: 1px solid #000;">Dated<br/><span class="bold">${formatDate(data.date)}</span></td>
                        </tr>
                            <td style="border-bottom: 1px solid #000; border-right: 1px solid #000;">Delivery Note<br/>&nbsp;</td>
                            <td style="border-bottom: 1px solid #000;">Mode/Terms of Payment<br/>${data.isSubscription ? `Subscription - ${data.paymentMethod || 'Online'}` : (data.paymentMethod || 'Immediate')}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #000;">Reference No. & Date.<br/>&nbsp;</td>
                            <td>Other References<br/>&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Buyer/Consignee Info -->
        <table>
             <tr>
                <td style="width: 50%; border-top: none;">
                    <div class="small-text">Buyer (Bill to)</div>
                    <div class="bold">${data.buyerName}</div>
                    <div>${data.buyerAddress}</div>
                    <div>GSTIN/UIN: ${data.buyerGstin || 'Unregistered'}</div>
                    <div>State Name: ${data.buyerState || data.sellerState}, Code: ${data.buyerStateCode || data.sellerStateCode}</div>
                </td>
                <td style="width: 50%; border-top: none;">
                     <div class="small-text">Consignee (Ship to)</div>
                    <div class="bold">${data.buyerName}</div>
                    <div>${data.buyerAddress}</div>
                    <div>GSTIN/UIN: ${data.buyerGstin || 'Unregistered'}</div>
                    <div>State Name: ${data.buyerState || data.sellerState}, Code: ${data.buyerStateCode || data.sellerStateCode}</div>
                </td>
            </tr>
        </table>

        <!-- Items Table -->
        <table class="items-table" style="border-top: none;">
            <thead>
                <tr>
                    <th style="width: 30px;">Sl No</th>
                    <th>Description of Goods</th>
                    <th style="width: 60px;">HSN/SAC</th>
                    ${data.isSubscription ? `
                    <th style="width: 70px;">Packet Size</th>
                    <th style="width: 40px;">Qty/Del</th>
                    <th style="width: 40px;">Total Del</th>
                    ` : `
                    <th style="width: 70px;">Count</th>
                    `}
                    <th style="width: 80px;">Rate</th>
                    ${!data.isSubscription ? '<th style="width: 40px;">Disc %</th>' : ''}
                    <th style="width: 80px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map((item, index) => `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td><span class="bold">${item.name}</span><br/>${item.description || ''}</td>
                        <td class="center">${item.hsn || ''}</td>
                        ${data.isSubscription ? `
                        <td class="center">${item.packetSize}</td>
                        <td class="center">${item.qtyPerDelivery}</td>
                        <td class="center">${item.totalDeliveries}</td>
                        ` : `
                        <td class="center bold">${item.quantity}</td>
                        `}
                        <td class="center">${item.rate.toFixed(2)}</td>
                        ${!data.isSubscription ? `<td class="center">${item.discount ? item.discount + '%' : 'N/A'}</td>` : ''}
                        <td class="right bold">${formatCurrency(item.amount)}</td>
                    </tr>
                `).join('')}
                ${emptyRows}
                
                <!-- Summary/Totals Section -->
                 <tr>
                    <td colspan="${data.isSubscription ? 6 : 4}" class="right bold">Total ${data.isSubscription ? 'Deliveries' : 'Count'}: ${data.isSubscription ? data.items.reduce((s, i) => s + i.totalDeliveries, 0) : data.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td colspan="${data.isSubscription ? 1 : 2}" class="right">Taxable Value</td>
                    <td class="right">${formatCurrency(data.taxInfo.taxableValue)}</td>
                </tr>
                <tr>
                    <td colspan="${data.isSubscription ? 7 : 6}" class="right">Add: CGST @ ${data.taxInfo.cgstRate}%</td>
                    <td class="right">${formatCurrency(data.taxInfo.cgstAmount)}</td>
                </tr>
                <tr>
                    <td colspan="${data.isSubscription ? 7 : 6}" class="right">Add: SGST @ ${data.taxInfo.sgstRate}%</td>
                    <td class="right">${formatCurrency(data.taxInfo.sgstAmount)}</td>
                </tr>
                 ${data.deliveryFee && data.deliveryFee > 0 ? `
                <tr>
                    <td colspan="${data.isSubscription ? 7 : 6}" class="right">Add: Delivery Charges</td>
                    <td class="right">${formatCurrency(data.deliveryFee)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td colspan="${data.isSubscription ? 7 : 6}" class="right bold" style="background-color: #f0f0f0;">Total Amount</td>
                    <td class="right bold" style="background-color: #f0f0f0;">${formatCurrency(data.totalAmount)}</td>
                </tr>
            </tbody>
        </table>

        <!-- Amount In Words -->
        <div style="border: 1px solid #000; border-top: none; padding: 5px;">
            <span class="small-text">Amount Chargeable (in words)</span><br/>
            <span class="bold">${data.totalAmountWords}</span>
        </div>

        <!-- Tax Table -->
        <table class="tax-table" style="border-top: none;">
            <thead>
                <tr>
                    <th rowspan="2">HSN/SAC</th>
                    <th rowspan="2">Taxable Value</th>
                    <th colspan="2">Central Tax</th>
                    <th colspan="2">State Tax</th>
                    <th rowspan="2">Total Tax Amount</th>
                </tr>
                <tr>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                 <tr>
                    <td class="center">${data.items[0]?.hsn || ''}</td>
                    <td class="right">${formatCurrency(data.taxInfo.taxableValue)}</td>
                    <td class="center">${data.taxInfo.cgstRate}%</td>
                    <td class="right">${formatCurrency(data.taxInfo.cgstAmount)}</td>
                    <td class="center">${data.taxInfo.sgstRate}%</td>
                    <td class="right">${formatCurrency(data.taxInfo.sgstAmount)}</td>
                    <td class="right bold">${formatCurrency(data.taxInfo.cgstAmount + data.taxInfo.sgstAmount)}</td>
                </tr>
                <tr>
                    <td class="right bold">Total</td>
                    <td class="right bold">${formatCurrency(data.taxInfo.taxableValue)}</td>
                    <td></td>
                    <td class="right bold">${formatCurrency(data.taxInfo.cgstAmount)}</td>
                    <td></td>
                    <td class="right bold">${formatCurrency(data.taxInfo.sgstAmount)}</td>
                    <td class="right bold">${formatCurrency(data.taxInfo.cgstAmount + data.taxInfo.sgstAmount)}</td>
                </tr>
            </tbody>
        </table>

        <!-- Footer / Declaration -->
        <table style="border-top: none;">
            <tr>
                <td style="width: 50%;">
                    <div class="small-text" style="text-decoration: underline;">Declaration</div>
                    <div class="small-text">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
                </td>
                <td style="width: 50%;">
                    <div class="right small-text bold" style="margin-bottom: 30px;">for ${data.sellerName}</div>
                    <div class="footer-sign">Authorised Signatory</div>
                </td>
            </tr>
        </table>
        
        <div class="center small-text" style="margin-top: 20px;">This is a computer generated invoice.</div>
    </body>
    </html>
    `;
};

// --- Controllers ---

export const getAdminOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Models.Order.findById(orderId)
      .populate('customer', 'name phone email')
      .populate('branch', 'name address phone')
      .populate('items.id', 'name price discountPrice unit');

    if (!order) return res.status(404).send('Order not found');

    // Reuse logic from invoice.service.ts createInvoiceFromOrder
    const items = order.items?.map((item) => {
      const product = item.id || {}; // Populated product details
      const unitPrice = product.price || 0;
      const discountPrice = product.discountPrice || 0;
      const quantity = item.count || 1;

      const qtyValue = product.quantity?.value || product.quantityValue || '';
      const qtyUnit = product.quantity?.unit || product.quantityUnit || '';
      const sizeDescription = (qtyValue && qtyUnit) ? `(${qtyValue} ${qtyUnit})` : '';

      let discountPercentage = 0;
      let finalUnitPrice = unitPrice;

      if (discountPrice > 0 && discountPrice < unitPrice) {
        discountPercentage = Math.round(((unitPrice - discountPrice) / unitPrice) * 100);
        finalUnitPrice = discountPrice;
      }

      return {
        name: item.item || product.name || 'Product',
        description: sizeDescription,
        quantity: quantity,
        unit: 'Nos',
        rate: unitPrice,
        amount: finalUnitPrice * quantity,
        discount: discountPercentage,
        hsn: ''
      };
    }) || [];

    const total = order.totalPrice;
    const deliveryFee = order.deliveryFee || 0;
    const sgstAmount = order.sgst || 0;
    const cgstAmount = order.cgst || 0;
    const taxAmount = sgstAmount + cgstAmount;
    const taxableValue = total - taxAmount - deliveryFee;

    // Calculate Rates
    const sgstRate = taxableValue > 0 ? (sgstAmount / taxableValue) * 100 : 0;
    const cgstRate = taxableValue > 0 ? (cgstAmount / taxableValue) * 100 : 0;

    const taxInfo = {
      taxableValue: taxableValue,
      sgstRate: Number(sgstRate.toFixed(2)),
      sgstAmount: sgstAmount,
      cgstRate: Number(cgstRate.toFixed(2)),
      cgstAmount: cgstAmount,
    };

    const sessionYear = calculateSessionYear(order.createdAt || new Date());
    const orderIdSuffix = order.orderId || (order._id ? order._id.slice(-6).toUpperCase() : '000');

    const invoiceData = {
      invoiceNo: `LP/${sessionYear}/${orderIdSuffix}`,
      date: order.createdAt || new Date(),
      sellerName: "Lushpure Ruralfields Private Limited",
      sellerAddress: "Kasera Raya Mant Road, MATHURA, Uttar Pradesh - 281202",
      sellerGstin: "09AAFCL8465L1ZS",
      sellerState: "Uttar Pradesh",
      sellerStateCode: "09",
      buyerName: order.customer?.name || 'Customer',
      buyerAddress: order.deliveryLocation?.address || 'Address not available',
      buyerState: "Uttar Pradesh",
      buyerStateCode: "09",
      items: items,
      totalAmount: total,
      totalAmountWords: numberToWords(total),
      taxInfo: taxInfo,
      isSubscription: false,
      deliveryFee: deliveryFee,
      paymentMethod: order.paymentDetails?.paymentMethod
    };

    const html = generateFormalInvoiceHTML(invoiceData);
    res.send(html);

  } catch (error) {
    console.error("Order Invoice Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const getAdminSubscriptionInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Models.Subscription.findById(id)
      .populate('customer', 'name phone email')
      .populate('deliveryAddress');

    if (!subscription) return res.status(404).send('Subscription not found');

    const products = subscription.products || [];

    // Map Subscription Products
    const items = products.map((p) => {
      const totalDeliveries = p.totalDeliveries || subscription.totalDeliveries || 0;
      const count = p.count || 1;
      const quantityValue = p.quantityValue || 0;
      const quantityUnit = p.quantityUnit || 'Unit';

      const startMonth = new Date(subscription.startDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      const endMonth = new Date(subscription.endDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      const dateRange = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;

      const totalPrice = p.monthlyPrice || (p.unitPrice * totalDeliveries);

      return {
        name: p.productName,
        description: `${dateRange}\n(${p.deliveryFrequency})`,
        packetSize: `${quantityValue} ${quantityUnit}`,
        qtyPerDelivery: count,
        totalDeliveries: totalDeliveries,
        rate: p.unitPrice,
        amount: totalPrice,
        discount: 0,
        hsn: '0401'
      };
    });

    const totalAmount = subscription.bill || items.reduce((s, i) => s + i.amount, 0);

    const sgstAmount = subscription.sgst || 0;
    const cgstAmount = subscription.cgst || 0;
    const taxAmount = sgstAmount + cgstAmount;
    const taxableValue = totalAmount - taxAmount;

    const sgstRate = taxableValue > 0 ? (sgstAmount / taxableValue) * 100 : 0;
    const cgstRate = taxableValue > 0 ? (cgstAmount / taxableValue) * 100 : 0;

    const taxInfo = {
      taxableValue: taxableValue,
      sgstRate: Number(sgstRate.toFixed(2)),
      sgstAmount: sgstAmount,
      cgstRate: Number(cgstRate.toFixed(2)),
      cgstAmount: cgstAmount
    };

    const sessionYear = calculateSessionYear(subscription.startDate);
    const subIdSuffix = subscription.subscriptionId || (subscription._id ? subscription._id.slice(-6).toUpperCase() : '000');

    const invoiceData = {
      invoiceNo: `LP/${sessionYear}/${subIdSuffix}`,
      date: subscription.startDate,
      sellerName: "Lushpure Ruralfields Private Limited",
      sellerAddress: "Kasera Raya Mant Road, MATHURA, Uttar Pradesh - 281202",
      sellerGstin: "09AAFCL8465L1ZS",
      sellerState: "Uttar Pradesh",
      sellerStateCode: "09",
      buyerName: subscription.customer?.name || "Customer",
      buyerAddress: subscription.deliveryAddress?.addressLine1 ?
        `${subscription.deliveryAddress.addressLine1}, ${subscription.deliveryAddress.city}, ${subscription.deliveryAddress.state}` :
        "Address not available",
      buyerState: "Uttar Pradesh",
      buyerStateCode: "09",
      items: items,
      totalAmount: totalAmount,
      totalAmountWords: numberToWords(totalAmount),
      taxInfo: taxInfo,
      isSubscription: true,
      subscriptionPeriod: `${new Date(subscription.startDate).toLocaleDateString()} to ${new Date(subscription.endDate).toLocaleDateString()}`,
      paymentMethod: subscription.paymentDetails?.paymentMethod
    };

    const html = generateFormalInvoiceHTML(invoiceData);
    res.send(html);

  } catch (error) {
    console.error("Subscription Invoice Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
