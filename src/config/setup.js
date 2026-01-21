import AdminJS, { ValidationError } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import *  as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { COOKIE_SECRET, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import { Admin } from "../models/user.js";
import { componentLoader, Components } from "./component-loader.js";
import bcrypt from "bcrypt";

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



// Password validation for AdminJS
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

const passwordValidationHook = async (request, context) => {
  const { payload } = request;
  if (payload && payload.password) {
    // Skip validation if password is already hashed
    if (payload.password.startsWith('$2b$') || payload.password.startsWith('$2a$')) {
      return request;
    }
    if (!passwordValidationRegex.test(payload.password)) {
      throw new ValidationError({
        password: {
          message: 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number',
        },
      });
    }
  }
  return request;
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
        listProperties: ['email', 'name', 'phone', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
        actions: {
          new: {
            before: [passwordValidationHook]
          },
          edit: {
            before: [passwordValidationHook]
          }
        }
      }
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
        actions: {
          new: {
            before: [passwordValidationHook]
          },
          edit: {
            before: [passwordValidationHook]
          }
        }
      }
    },
    {
      resource: Models.Branch,
      options: {
        listProperties: ['branchId', 'name', 'city', 'status', 'isActive'],
        filterProperties: ['city', 'status', 'isActive'],
        navigation: { name: 'Branch Management', icon: 'Home' }
      }
    },
    {
      resource: Models.Inventory,
      options: {
        listProperties: ['inventoryId', 'branch', 'product', 'variant.sku', 'pricing.sellingPrice', 'stock', 'isAvailable'],
        filterProperties: ['branch', 'product', 'isAvailable'],
        navigation: { name: 'Branch Management' }
      }
    },
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
      resource: Models.Review,
      options: {
        properties: {
          order: {
            type: 'reference',
            reference: '1_AllOrders',
          },
          customer: {
            type: 'reference',
            reference: 'Customer',
          },
          product: {
            type: 'reference',
            reference: 'Product',
          }
        },
        navigation: { name: 'Customer Feedback', icon: 'Star' }
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
          edit: {
            isVisible: true,
            layout: ['paymentStatus']
          }
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
    { resource: Models.Counter },
    { resource: Models.Address },
    { resource: Models.Feedback },
    {
      resource: Models.Tax,
      options: {
        listProperties: ['sgst', 'cgst', 'isActive', 'updatedAt'],
        filterProperties: ['isActive'],
        navigation: { name: 'Settings', icon: 'Settings' }
      }
    },
    {
      resource: Models.Coupon,
      options: {
        listProperties: ['code', 'discountType', 'discountValue', 'minOrderValue', 'validUntil', 'isActive', 'usageCount'],
        filterProperties: ['isActive', 'discountType'],
        properties: {
          description: {
            type: 'textarea'
          },
          applicableCategories: {
            type: 'reference',
            reference: 'Category',
            isArray: true
          },
          applicableBranches: {
            type: 'reference',
            reference: 'Branch',
            isArray: true
          }
        },
        navigation: { name: 'Promotions', icon: 'Tag' }
      }
    }
  ],
  branding: {
    companyName: "TakeSmart",
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
      // Use bcrypt.compare for hashed passwords
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) return user;

      // Fallback for plaintext passwords (legacy)
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