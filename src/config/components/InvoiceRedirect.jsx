import React, { useEffect } from 'react';

// This component performs a simple client-side redirect to the premium HTML invoice.
// It bypasses the AdminJS AJAX handling to ensure a full page load of our custom view.
const InvoiceRedirect = (props) => {
    const { record, resource } = props;

    useEffect(() => {
        if (record && record.id) {
            const id = record.id;
            // Determine if it's a subscription or order
            const type = resource.id.toLowerCase().includes('subscription') ? 'subscription' : 'order';
            const redirectUrl = `/api/v1/admin/preview/${type}/${id}`;

            console.log(`🚀 Redirecting to premium invoice: ${redirectUrl}`);
            window.location.href = redirectUrl;
        }
    }, [record, resource]);

    return React.createElement('div', {
        style: {
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#757575'
        }
    }, 'Preparing your premium invoice...');
};

export default InvoiceRedirect;
