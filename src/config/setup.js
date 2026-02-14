import AdminJS, { ValidationError } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import *  as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { COOKIE_SECRET, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import { Admin } from "../models/user.js";
import { componentLoader, Components } from "./component-loader.js";
import bcrypt from "bcrypt";
import uploadFeature from "@adminjs/upload";
import CloudinaryProvider, { uploadCache } from "../utils/cloudinary-provider.js";

AdminJS.registerAdapter(AdminJSMongoose);

const cloudinaryProvider = new CloudinaryProvider();

/**
 * Helper to ensure Cloudinary URLs are saved to the DB instead of relative keys.
 * AdminJS @adminjs/upload feature ignores provider return values, so we sync it here.
 */
const syncCloudinaryUrl = async (response, request, context) => {
  const { record } = response;
  if (!record || !record.params) return response;

  let hasUpdates = false;
  const newParams = { ...record.params };

  Object.keys(newParams).forEach(key => {
    const value = newParams[key];

    // Handle single fields (Category/SubCategory)
    if (typeof value === 'string' && uploadCache.has(value)) {
      newParams[key] = uploadCache.get(value);
      hasUpdates = true;
    }

    // Handle multiple fields (Product/Inventory arrays)
    // AdminJS uses keys like images.0, images.1
    if (key.match(/\.?images\.\d+$/) && typeof value === 'string' && uploadCache.has(value)) {
      newParams[key] = uploadCache.get(value);
      hasUpdates = true;
    }
  });

  if (hasUpdates) {
    const updatedRecord = await context.resource.update(record.id, newParams);
    // Refresh the record in the response so the UI shows the new URL immediately
    response.record.params = updatedRecord.params;
  }
  return response;
};

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

console.log('--- DEBUGGING ADMINJS SETUP ---');
console.log('AdminJS version:', AdminJS.VERSION);
console.log('Theme config:', {
  defaultTheme: light.id,
  availableThemes: [dark.id, light.id, noSidebar.id]
});

// Helper to inspecting resources
const inspectResource = (name, resource, options) => {
  console.log(`[Resource Check] ${name}:`, {
    exists: !!resource,
    hasOptions: !!options,
    navigation: options?.navigation,
    actions: options?.actions ? Object.keys(options.actions) : [],
    properties: options?.properties ? Object.keys(options.properties) : []
  });
  if (!resource) console.error(`!!! CRITICAL: Resource ${name} is UNDEFINED !!!`);
};

inspectResource('Customer', Models.Customer, { listProperties: ['name', 'phone', 'role', 'isActivated', 'createdAt'] });
inspectResource('DeliveryPartner', Models.DeliveryPartner, { listProperties: ['name', 'phone', 'email', 'role', 'isActivated', 'branch'] });
inspectResource('Admin', Models.Admin, { listProperties: ['email', 'role'] });
inspectResource('Product', Models.Product, { listProperties: ['name', 'category', 'brand', 'isActive'] });
inspectResource('Category', Models.Category, { listProperties: ['name', 'isActive', 'parentCategory'] });
inspectResource('Inventory', Models.Inventory, { listProperties: ['product', 'branch', 'stock', 'isAvailable', 'pricing.sellingPrice'] });
inspectResource('Branch', Models.Branch, { listProperties: ['name', 'city', 'status', 'isActive', 'branchId'] });
inspectResource('Order', Models.Order, baseOrderOptions);
inspectResource('Review', Models.Review, {});
inspectResource('Coupon', Models.Coupon, { listProperties: ['code', 'discountType'] });
inspectResource('Feedback', Models.Feedback, { listProperties: ['user', 'type'] });
inspectResource('Tax', Models.Tax, { listProperties: ['sgst', 'cgst'] });
inspectResource('Counter', Models.Counter, { navigation: null });
inspectResource('Address', Models.Address, { navigation: null });

export const admin = new AdminJS({
  resources: [
    // --- USER MANAGEMENT ---
    {
      resource: Models.Customer,
      options: {
        listProperties: ['name', 'phone', 'role', 'isActivated', 'createdAt'],
        filterProperties: ['phone', 'role', 'isActivated'],
        navigation: { name: 'User Management', icon: 'User' },
      }
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ['name', 'phone', 'email', 'role', 'isActivated', 'branch'],
        filterProperties: ['email', 'role', 'branch'],
        navigation: { name: 'User Management', icon: 'Truck' },
        actions: {
          new: { before: [passwordValidationHook] },
          edit: { before: [passwordValidationHook] }
        }
      }
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['email', 'role'],
        navigation: { name: 'User Management', icon: 'Shield' },
        actions: {
          new: { before: [passwordValidationHook] },
          edit: { before: [passwordValidationHook] }
        }
      }
    },

    // --- CATALOG ---
    {
      resource: Models.SubCategory,
      options: {
        listProperties: ['name', 'image'],
        navigation: { name: 'Catalog', icon: 'Tag' },
        properties: {
          image: { isVisible: { list: true, show: true, edit: false, filter: false } },
          uploadImage: { isVisible: { list: false, show: false, edit: true, filter: false } }
        },
        actions: {
          new: { after: [syncCloudinaryUrl] },
          edit: { after: [syncCloudinaryUrl] }
        }
      },
      features: [
        uploadFeature({
          componentLoader,
          provider: cloudinaryProvider,
          properties: {
            key: 'image',
            file: 'uploadImage',
          },
          validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] },
        }),
      ],
    },
    {
      resource: Models.Product,
      options: {
        listProperties: ['name', 'category', 'brand', 'isActive'],
        filterProperties: ['category', 'brand', 'isActive'],
        navigation: { name: 'Catalog', icon: 'Box' },
        properties: {
          images: { isVisible: { list: true, show: true, edit: false, filter: false } },
          uploadImages: { isVisible: { list: false, show: false, edit: true, filter: false } }
        },
        actions: {
          new: { after: [syncCloudinaryUrl] },
          edit: {
            after: [async (response) => {
              console.log('[Product Debug] Final saved images:', response.record.params.images);
              return response;
            }, syncCloudinaryUrl]
          }
        }
      },
      features: [
        uploadFeature({
          componentLoader,
          provider: cloudinaryProvider,
          properties: {
            key: 'images',
            file: 'uploadImages',
          },
          multiple: true,
          validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] },
        }),
      ],
    },
    {
      resource: Models.Category,
      options: {
        listProperties: ['name', 'image'],
        navigation: { name: 'Catalog', icon: 'Tag' },
        properties: {
          image: { isVisible: { list: true, show: true, edit: false, filter: false } },
          uploadImage: { isVisible: { list: false, show: false, edit: true, filter: false } }
        },
        actions: {
          new: { after: [syncCloudinaryUrl] },
          edit: { after: [syncCloudinaryUrl] }
        }
      },
      features: [
        uploadFeature({
          componentLoader,
          provider: cloudinaryProvider,
          properties: {
            key: 'image',
            file: 'uploadImage',
          },
          validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] },
        }),
      ],
    },
    {
      resource: Models.Inventory,
      options: {
        listProperties: ['product', 'branch', 'stock', 'isAvailable', 'pricing.sellingPrice'],
        filterProperties: ['branch', 'product', 'isAvailable'],
        navigation: { name: 'Catalog', icon: 'Database' },
        properties: {
          'variant.images': { isVisible: { list: true, show: true, edit: false, filter: false } },
          uploadVariantImages: { isVisible: { list: false, show: false, edit: true, filter: false } }
        },
        actions: {
          new: { after: [syncCloudinaryUrl] },
          edit: {
            after: [async (response) => {
              console.log('[Inventory Debug] Final saved images:', response.record.params['variant.images']);
              return response;
            }, syncCloudinaryUrl]
          }
        }
      },
      features: [
        uploadFeature({
          componentLoader,
          provider: cloudinaryProvider,
          properties: {
            key: 'variant.images',
            file: 'uploadVariantImages',
          },
          multiple: true,
          validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] },
        }),
      ],
    },

    // --- OPERATIONS ---
    {
      resource: Models.Branch,
      options: {
        listProperties: ['name', 'city', 'status', 'isActive', 'branchId'],
        filterProperties: ['city', 'status', 'isActive'],
        navigation: { name: 'Operations', icon: 'GitBranch' }
      }
    },

    // --- ORDER MANAGEMENT ---
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '1_AllOrders',
        navigation: { name: 'Order Management', icon: 'ShoppingCart' },
      }
    },
    {
      resource: Models.Order,
      options: {
        ...baseOrderOptions,
        id: '2_AssignPending',
        navigation: { name: 'Order Management' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            after: async (response) => {
              // Filter for orders that have status 'accepted' or 'pending' and NO delivery partner
              if (response.records) {
                response.records = response.records.filter(record => {
                  const dp = record.params.deliveryPartner;
                  const status = record.params.status;
                  const hasNoPartner = dp === null || dp === undefined || dp === '';
                  const isPending = status === 'accepted' || status === 'pending';
                  return hasNoPartner && isPending;
                });
              }
              return response;
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
        id: '3_ActiveDeliveries',
        navigation: { name: 'Order Management' },
        actions: {
          ...baseOrderOptions.actions,
          list: {
            after: async (response) => {
              // Filter for orders that are active (accepted, in-progress, picked-up, awaitcustomers) AND have a delivery partner
              if (response.records) {
                response.records = response.records.filter(record => {
                  const dp = record.params.deliveryPartner;
                  const status = record.params.status;
                  const hasPartner = dp !== null && dp !== undefined && dp !== '';
                  const isActive = ['accepted', 'in-progress', 'picked-up', 'awaitcustomers'].includes(status);
                  return hasPartner && isActive;
                });
              }
              return response;
            }
          },
          new: { isVisible: false }
        }
      }
    },

    // --- MARKETING & PROMOTIONS ---
    {
      resource: Models.Coupon,
      options: {
        navigation: { name: 'Marketing', icon: 'Gift' },
        listProperties: ['code', 'discountType', 'discountValue', 'validUntil', 'isActive'],
      }
    },

    // --- SUPPORT & FEEDBACK ---
    {
      resource: Models.Feedback,
      options: {
        navigation: { name: 'Support', icon: 'MessageSquare' },
        listProperties: ['user', 'topic', 'message', 'createdAt']
      }
    },
    {
      resource: Models.Review,
      options: {
        navigation: { name: 'Support' },
        properties: {
          order: { reference: '1_AllOrders' }
        }
      }
    },

    // --- SETTINGS ---
    {
      resource: Models.Tax,
      options: {
        navigation: { name: 'Settings', icon: 'Settings' }
      }
    },

    // --- HIDDEN RESOURCES (System) ---
    {
      resource: Models.Counter,
      options: { navigation: null }
    },
    {
      resource: Models.Address,
      options: { navigation: null }
    },
  ],
  branding: {
    companyName: "TakeSmart",
    logo: '/public/logo.png',
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#FF4700',
        primary80: '#FF6b33',
        primary60: '#FF8f66',
        primary40: '#FFb399',
        primary20: '#FFd6cc',
        accent: '#4CAF50',
        hoverBg: '#FF470010',
      }
    }
  },
  defaultTheme: light.id, // Using Light theme as base for app-like feel
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
  componentLoader,
  dashboard: {
    component: Components.Dashboard,
  },
  pages: {
    ordersByDate: {
      component: Components.OrdersPage,
      icon: 'BarChart2',
    },
  },
});

export const buildAdminRouter = () => {
  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin, {
    authenticate: async (email, password) => {
      const user = await Admin.findOne({ email });
      if (!user) return false;
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) return user;
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