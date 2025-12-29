import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import *  as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { COOKIE_SECRET, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import { Admin } from "../models/user.js";
import { componentLoader, Components } from "./component-loader.js";

AdminJS.registerAdapter(AdminJSMongoose);

// Common action configuration for invoices
const downloadInvoiceAction = {
  actionType: 'record',
  icon: 'Download',
  isVisible: true,
  component: Components.InvoiceRedirect,
  handler: (request, response, context) => {
    return { record: context.record.toJSON(context.currentAdmin) };
  }
};

// Resource-level CSV download action
const downloadCSVAction = {
  actionType: 'resource',
  icon: 'DocumentDownload',
  isVisible: true,
  component: Components.CSVRedirect,
  handler: (request, response, context) => {
    return {};
  }
};

// --- BASE OPTIONS ---

const baseOrderOptions = {
  properties: {
    deliveryPartner: {
      type: 'reference',
      reference: 'DeliveryPartner',
    }
  },
  actions: {
    downloadInvoice: downloadInvoiceAction,
    downloadCSV: downloadCSVAction
  }
};

const baseSubscriptionOptions = {
  listProperties: ['subscriptionId', 'customer', 'status', 'startDate', 'endDate', 'bill'],
  properties: {
    'deliveryPartner.partner': {
      type: 'reference',
      reference: 'DeliveryPartner',
    },
    'products.quantityValue': { type: 'number', isTitle: false },
    'products.quantityUnit': { type: 'string', isTitle: false }
  },
  actions: {
    downloadInvoice: downloadInvoiceAction,
    downloadCSV: downloadCSVAction
  }
};


export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ['phone', 'role', 'isActivated'],
        filterProperties: ['phone', 'role']
      }
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role']
      }
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role']
      }
    },
    { resource: Models.Branch },
    { resource: Models.Product },
    { resource: Models.Category },

    // --- ORDERS SECTION ---
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '1_AllOrders',
        navigation: { name: 'Orders Manager', icon: 'ShoppingCart' },
      }
    },
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '2_UnassignedOrders',
        navigation: { name: 'Orders Manager' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            before: async (request) => {
              // This worked before - keep using null
              request.query = { ...request.query, 'filters.deliveryPartner': null };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '3_AssignedOrders',
        navigation: { name: 'Orders Manager' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            // Use 'after' hook to filter out unassigned orders from results
            after: async (response) => {
              if (response.records) {
                response.records = response.records.filter(record => {
                  const dp = record.params.deliveryPartner;
                  return dp !== null && dp !== undefined && dp !== '';
                });
              }
              return response;
            }
          },
          new: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '4_CODOrders',
        navigation: { name: 'Orders Manager' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            before: async (request) => {
              request.query = { ...request.query, 'filters.paymentDetails.paymentMethod': 'cod' };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '5_PaidOrders',
        navigation: { name: 'Orders Manager' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            before: async (request) => {
              request.query = { ...request.query, 'filters.paymentStatus': 'verified' };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },

    // --- SUBSCRIPTIONS SECTION ---
    {
      resource: Models.Subscription,
      options: {
        ...baseSubscriptionOptions,
        id: '1_AllSubscriptions',
        navigation: { name: 'Subscription Manager', icon: 'Calendar' },
      }
    },
    {
      resource: Models.Subscription,
      options: {
        ...baseSubscriptionOptions,
        id: '2_UnassignedSubscriptions',
        navigation: { name: 'Subscription Manager' },
        actions: {
          ...baseSubscriptionOptions.actions,
          list: {
            before: async (request) => {
              // This worked before - keep using null
              request.query = { ...request.query, 'filters.deliveryPartner.partner': null };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Subscription,
      options: {
        ...baseSubscriptionOptions,
        id: '3_AssignedSubscriptions',
        navigation: { name: 'Subscription Manager' },
        actions: {
          ...baseSubscriptionOptions.actions,
          list: {
            // Use 'after' hook to filter out unassigned subscriptions from results
            after: async (response) => {
              if (response.records) {
                response.records = response.records.filter(record => {
                  const dp = record.params['deliveryPartner.partner'];
                  return dp !== null && dp !== undefined && dp !== '';
                });
              }
              return response;
            }
          },
          new: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Subscription,
      options: {
        ...baseSubscriptionOptions,
        id: '4_CODSubscriptions',
        navigation: { name: 'Subscription Manager' },
        actions: {
          ...baseSubscriptionOptions.actions,
          list: {
            before: async (request) => {
              request.query = { ...request.query, 'filters.paymentDetails.paymentMethod': 'cod' };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },
    {
      resource: Models.Subscription,
      options: {
        ...baseSubscriptionOptions,
        id: '5_PaidSubscriptions',
        navigation: { name: 'Subscription Manager' },
        actions: {
          ...baseSubscriptionOptions.actions,
          list: {
            before: async (request) => {
              request.query = { ...request.query, 'filters.paymentStatus': 'verified' };
              return request;
            }
          },
          new: { isVisible: false },
          edit: { isVisible: false }
        }
      }
    },

    { resource: Models.Counter },
    { resource: Models.Address },
    { resource: Models.AnimalHealth },
    { resource: Models.Feedback }
  ],
  branding: {
    companyName: "Lush & Pures",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
  componentLoader,
  dashboard: {
    component: Components.Dashboard,
  },
  pages: {
    deliveriesByDate: {
      component: Components.DeliveriesPage,
      icon: 'Calendar',
    },
    ordersByDate: {
      component: Components.OrdersPage,
      icon: 'ShoppingCart',
    },
  },
});

export const buildAdminRouter = () => {
  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin, {
    authenticate: async (email, password) => {
      const user = await Admin.findOne({ email });
      if (!user) return false;
      if (user.password === password) return user;
      return false;
    },
    cookiePassword: COOKIE_SECRET,
    cookieName: "adminjs",
  },
    null,
    {
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      secret: COOKIE_SECRET,
    }
  );
  return router;
};