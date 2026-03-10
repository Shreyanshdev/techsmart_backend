# Variant Architecture Migration Plan

## Problem Statement

Variant-level data (images, packSize, weightValue, weightUnit, handling) is currently stored inside **Inventory** documents instead of on the **Product** model. Since Inventory is per-branch, variant info is **duplicated across every branch** that carries the same product variant.

**Example of the duplication:**
- "Fortune Oil 1L" sold in 3 branches = variant images stored **3 times**
- 250 products × avg 2 variants × avg 2 branches = ~1000 inventory docs with duplicated image/name data
- Updating a variant image requires updating it in **every branch's inventory doc**

## Current Architecture (Wrong)

```
Product
├── name, brand, category
├── images (product-level only)
└── description

Inventory (one doc per variant per branch)
├── branch (ref)
├── product (ref)
├── variant: {                    ← PROBLEM: variant details here
│   ├── sku
│   ├── packSize
│   ├── images []                 ← duplicated across branches
│   ├── weightValue
│   ├── weightUnit
│   ├── maxQtyPerOrder
│   └── handling { fragile, cold, heavy }
│   }
├── pricing: { mrp, sellingPrice, costPrice, discount }
└── stock, isAvailable, etc.
```

**Issues:**
1. Variant images/details duplicated per branch
2. Updating variant info requires updating all inventory docs across branches
3. No single source of truth for "what variants does this product have"
4. Adding a new branch means re-entering all variant details

## Solution Architecture (Correct)

```
Product
├── name, brand, category
├── images (product-level)
├── description
└── variants: [                   ← MOVE variant details here
    {
      sku: "FOR_OIL_1L",
      packSize: "1L",
      images: ["url1", "url2"],
      weightValue: 1,
      weightUnit: "l",
      maxQtyPerOrder: 5,
      handling: { fragile: false, cold: false, heavy: false }
    },
    {
      sku: "FOR_OIL_5L",
      packSize: "5L",
      images: ["url3"],
      weightValue: 5,
      weightUnit: "l",
      maxQtyPerOrder: 2,
      handling: { fragile: false, cold: false, heavy: true }
    }
  ]

Inventory (one doc per variant per branch)
├── branch (ref)
├── product (ref)
├── variantSku: "FOR_OIL_1L"      ← just a reference, no embedded data
├── pricing: { mrp, sellingPrice, costPrice, discount }  ← varies per branch
└── stock, isAvailable, etc.       ← varies per branch
```

**Benefits:**
- Variant images/details stored **once** on Product
- Update image in one place → all branches see it
- Each branch "opts in" to variants by creating inventory records
- Inventory stays lean: only price + stock (things that truly vary per branch)

## Migration Steps

### 1. Backup Database
```bash
mongodump --db takesmart --out ./backup-before-variant-migration
```

### 2. Run Migration Script
Create `migrate-variants.js`:
```js
// For each product:
//   1. Read all inventory docs for that product
//   2. Extract unique variants (by SKU) with their details
//   3. Push variants array into the Product doc
//   4. Replace inventory.variant with just inventory.variantSku
//   5. Save both

const products = await Product.find({});

for (const product of products) {
    const inventories = await Inventory.find({ product: product._id });
    
    // Extract unique variants
    const variantMap = {};
    for (const inv of inventories) {
        const v = inv.variant;
        if (!variantMap[v.sku]) {
            variantMap[v.sku] = {
                sku: v.sku,
                packSize: v.packSize,
                images: v.images || [],
                weightValue: v.weightValue,
                weightUnit: v.weightUnit,
                maxQtyPerOrder: v.maxQtyPerOrder || 0,
                handling: v.handling || {}
            };
        }
    }
    
    // Update Product with variants array
    product.variants = Object.values(variantMap);
    await product.save();
    
    // Slim down each Inventory doc
    for (const inv of inventories) {
        inv.variantSku = inv.variant.sku;
        inv.variant = undefined;
        await inv.save();
    }
}
```

### 3. Update Models

**Product model** — add `variants` array:
```js
variants: [{
    sku: { type: String, required: true },
    packSize: { type: String, required: true },
    images: [{ type: String }],
    weightValue: { type: Number, required: true },
    weightUnit: { type: String, enum: ['ml','l','g','kg','pcs','dozen'] },
    maxQtyPerOrder: { type: Number, default: 0 },
    handling: {
        fragile: { type: Boolean, default: false },
        cold: { type: Boolean, default: false },
        heavy: { type: Boolean, default: false }
    }
}]
```

**Inventory model** — replace `variant` with `variantSku`:
```js
// Remove: variant: { type: variantSchema, required: true }
// Add:
variantSku: {
    type: String,
    required: true,
    description: "References Product.variants[].sku"
}
```

Update compound index:
```js
// Old: { branch: 1, product: 1, 'variant.sku': 1 }
// New:
{ branch: 1, product: 1, variantSku: 1 }
```

### 4. Update Controllers

**Inventory controller** — when returning inventory, populate product with variants and merge:
```js
const inventory = await Inventory.find({ branch: branchId })
    .populate('product', 'name brand category variants');

// For each inventory item, attach the matching variant from product.variants
const enriched = inventory.map(inv => {
    const variant = inv.product.variants.find(v => v.sku === inv.variantSku);
    return { ...inv.toObject(), variant };
});
```

### 5. Update Frontend Services

Update `product.service.ts` and any screen that reads `inventory.variant.images` to read from the populated product variant instead.

### 6. Update Seed Scripts

Update any seeding scripts to put variant data on Product instead of Inventory.

## Files to Modify

| File | Change |
|------|--------|
| `models/product.js` | Add `variants` array schema |
| `models/inventory.js` | Remove `variantSchema`, add `variantSku` field |
| `controllers/inventory.js` | Populate product.variants, merge with inventory |
| `controllers/product/product.js` | Return variants from product |
| `controllers/homeLayout.js` | Update any variant references |
| `routes/index.js` | No change expected |
| Frontend: `product.service.ts` | Read variant from product instead of inventory |
| Frontend: `ProductCard.tsx` | Update variant data path |
| Frontend: `ProductDetailsModal.tsx` | Update variant data path |
| Frontend: `home.store.ts` | Update variant data mapping |
| Seed scripts | Move variant data to Product level |
