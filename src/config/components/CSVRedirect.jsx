import React, { useEffect } from 'react';

// This component redirects to CSV export endpoint
const CSVRedirect = (props) => {
    const { resource } = props;

    useEffect(() => {
        // Determine export type based on resource
        const resourceId = resource.id.toLowerCase();
        let exportUrl = '/api/v1/admin/export/orders';

        if (resourceId.includes('subscription')) {
            exportUrl = '/api/v1/admin/export/subscriptions';
        }

        console.log(`📊 Redirecting to CSV export: ${exportUrl}`);
        window.location.href = exportUrl;
    }, [resource]);

    return React.createElement('div', {
        style: {
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#757575'
        }
    }, 'Generating CSV report...');
};

export default CSVRedirect;
