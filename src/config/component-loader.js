import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
    InvoiceRedirect: componentLoader.add('InvoiceRedirect', './components/InvoiceRedirect.jsx'),
    CSVRedirect: componentLoader.add('CSVRedirect', './components/CSVRedirect.jsx'),
    DeliveriesPage: componentLoader.add('DeliveriesPage', './components/DeliveriesPage.jsx'),
    Dashboard: componentLoader.add('Dashboard', './components/Dashboard.jsx'),
    OrdersPage: componentLoader.add('OrdersPage', './components/OrdersPage.jsx'),
};

export { componentLoader, Components };

