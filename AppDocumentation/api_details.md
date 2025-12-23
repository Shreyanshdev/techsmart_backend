# Detailed API Documentation

This document provides a comprehensive breakdown of all API endpoints, including request validation rules, query parameters, and response structures, based on the codebase analysis.

## Base URL
`http://<your-backend-url>/api/v1`

---

## 1. Authentication (`/auth`)

### 1.1 Customer Login
- **Endpoint**: `POST /auth/customer/login`
- **Description**: Authenticates a customer using their phone number. Creates a new account if one doesn't exist.
- **Request Body**:
  ```json
  {
    "phone": "9876543210" // Required. Must be a valid 10-digit Indian mobile number (starts with 6-9).
  }
  ```
- **Validation**:
  - Phone must be a string.
  - Regex: `/^[6-9]\d{9}$/`
- **Logic**:
  - Checks if customer exists.
  - If not, creates a new customer (Rate limited: 1 attempt per 5 mins for new registrations).
  - Updates `lastLogin`.
  - Generates Access (15m) and Refresh (7d) tokens.
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "accessToken": "jwt_token...",
    "refreshToken": "refresh_token...",
    "customer": {
      "_id": "...",
      "phone": "9876543210",
      "role": "Customer",
      "isActivated": true
    }
  }
  ```

### 1.2 Delivery Partner Login
- **Endpoint**: `POST /auth/delivery-partner/login`
- **Description**: Authenticates a delivery partner using email and password.
- **Request Body**:
  ```json
  {
    "email": "partner@example.com", // Required. Valid email format.
    "password": "Password123" // Required. Min 8 chars, 1 uppercase, 1 lowercase, 1 number.
  }
  ```
- **Logic**:
  - Checks email existence.
  - Verifies password (bcrypt).
  - **Account Locking**: Locks account for 15 mins after 5 failed attempts.
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "accessToken": "...",
    "refreshToken": "...",
    "deliveryPartner": { ... }
  }
  ```
- **Error Responses**:
  - `423 Locked`: Account is locked due to failed attempts.

### 1.3 Refresh Token
- **Endpoint**: `POST /auth/refresh-token`
- **Request Body**:
  ```json
  {
    "refreshToken": "..." // Required
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Tokens refreshed successfully",
    "accessToken": "...",
    "refreshToken": "...",
    "user": { ... }
  }
  ```

---

## 2. User Profile (`/profile`)

### 2.1 Get User Profile
- **Endpoint**: `GET /profile`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Fetches the authenticated user's profile and their latest subscription.
- **Response (200 OK)**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "address": "...",
    "isActivated": true,
    "subscription": {
      "id": "...",
      "status": "active",
      "milkType": "...",
      "slot": "morning",
      "quantity": 1,
      "startDate": "...",
      "endDate": "..."
    } // or null
  }
  ```

### 2.2 Update User Profile
- **Endpoint**: `PUT /profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "New Name",     // Optional
    "email": "new@email.com", // Optional
    "address": "New Address"  // Optional
  }
  ```
- **Response (200 OK)**:
  ```json
  { "message": "Profile updated successfully" }
  ```

---

## 3. Address Management (`/addresses`)

### 3.1 Add Address
- **Endpoint**: `POST /addresses`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "addressLine1": "Flat 101", // Required
    "addressLine2": "Building A",
    "city": "Mumbai",           // Required
    "state": "Maharashtra",     // Required
    "zipCode": "400001",        // Required
    "isDefault": true,
    "latitude": 19.0760,        // Optional (will be geocoded if missing)
    "longitude": 72.8777        // Optional
  }
  ```
- **Logic**:
  - Validates required fields.
  - If lat/lng missing, uses `geocodeAddress` utility to fetch coordinates from Google Maps API.
- **Response (201 Created)**:
  ```json
  {
    "message": "Address added successfully",
    "address": { ... },
    "coordinates": { "latitude": ..., "longitude": ... }
  }
  ```

### 3.2 Get Addresses
- **Endpoint**: `GET /addresses`
- **Response (200 OK)**:
  ```json
  {
    "message": "Addresses fetched successfully",
    "addresses": [ ... ]
  }
  ```

### 3.3 Update Address
- **Endpoint**: `PUT /addresses/:id`
- **Request Body**: Same as Add Address.
- **Logic**: Verifies address belongs to user. Re-geocodes if coordinates not provided.

### 3.4 Delete Address
- **Endpoint**: `DELETE /addresses/:id`

---

## 4. Products (`/products`)

### 4.1 Get All Products
- **Endpoint**: `GET /products`
- **Query Params**:
  - `page`: Page number (default 1)
  - `limit`: Items per page (default 20)
  - `sort`: Field to sort by (default 'createdAt')
  - `order`: 'asc' or 'desc' (default 'desc')
  - `search`: Text search query
  - `category`: Filter by category ID
  - `brand`: Filter by brand name
  - `minPrice`, `maxPrice`: Price range
  - `featured`: 'true' to filter featured products
- **Response (200 OK)**:
  ```json
  {
    "products": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

### 4.2 Get Subscription Available Products
- **Endpoint**: `GET /products/subscription-available` (Inferred path, check routes)
- **Query Params**: `page`, `limit`, `category`
- **Description**: Returns products marked with `isSubscriptionAvailable: true`.

---

## 5. Orders (One-time) (`/orders`)

### 5.1 Create Order
- **Endpoint**: `POST /orders`
- **Request Body**:
  ```json
  {
    "userId": "...",          // Required
    "branch": "...",          // Required (Branch ID)
    "totalPrice": 500,        // Required
    "deliveryFee": 50,        // Required
    "addressId": "...",       // Optional (uses default if missing)
    "items": [
      {
        "id": "prod_id",      // Required
        "item": "Milk",       // Required (Name)
        "count": 2            // Required (Integer > 0)
      }
    ]
  }
  ```
- **Logic**:
  - Validates all IDs and amounts.
  - Fetches address to get lat/lng for delivery location.
  - Emits `newOrderAvailable` socket event to branch room.

### 5.2 Get My Orders
- **Endpoint**: `GET /orders/my-history`
- **Response**: List of user's orders sorted by date.

### 5.3 Order Status Updates (Delivery Partner)
- **Endpoint**: `PATCH /orders/:orderId/status`
- **Request Body**:
  ```json
  {
    "status": "in-progress", // accepted, in-progress, awaitconfirmation, delivered, cancelled
    "deliveryPersonLocation": { "latitude": ..., "longitude": ... }
  }
  ```
- **Logic**:
  - Validates status transitions (e.g., accepted -> in-progress).
  - Emits socket events (`orderStatusUpdated`, `orderLocationUpdated`).
  - `delivered` status waits for customer confirmation.

### 5.4 Confirm Delivery (Customer)
- **Endpoint**: `POST /orders/:orderId/confirm-receipt`
- **Description**: Customer confirms they received the order.
- **Logic**:
  - Only allowed if status is `awaitconfirmation`.
  - Sets status to `delivered`.
  - Closes socket rooms.

---

## 6. Subscriptions (`/subscriptions`)

### 6.1 Create Subscription
- **Endpoint**: `POST /subscriptions`
- **Request Body**:
  ```json
  {
    "products": [
      {
        "productId": "...",
        "quantity": 1,
        "deliveryFrequency": "daily" // daily, alternate, weekly, monthly
      }
    ],
    "startDate": "2023-10-27",
    "endDate": "2023-11-27",
    "slot": "morning", // morning, evening
    "addressId": "..."
  }
  ```

### 6.2 Get My Subscription
- **Endpoint**: `GET /subscriptions/my` (or `/subscriptions/customer/:customerId`)
- **Response**: Active subscription details including `deliveries` array.

### 6.3 Cancel Subscription
- **Endpoint**: `PATCH /subscriptions/:id/cancel`
- **Logic**:
  - Checks `cancellationCutoff` (hours before next delivery).
  - If within cutoff, allows cancellation.
  - Marks future scheduled deliveries as `canceled`.

---

## 7. Delivery Management (`/deliveries`)

### 7.1 Get Delivery Details
- **Endpoint**: `GET /deliveries/:subscriptionId/:deliveryDate`
- **Response**:
  ```json
  {
    "success": true,
    "delivery": {
      "date": "...",
      "status": "scheduled",
      "isPastDelivery": false,
      "pastCutoff": false,
      "canModify": true,
      ...
    }
  }
  ```

### 7.2 Change Delivery Slot
- **Endpoint**: `PATCH /deliveries/:subscriptionId/:deliveryDate/slot`
- **Request Body**: `{ "newSlot": "evening" }`
- **Logic**:
  - Checks if delivery is in the past.
  - Checks if past cutoff time (2 hours before delivery).
  - Recalculates cutoff time.

### 7.3 Reschedule Single Delivery
- **Endpoint**: `PATCH /deliveries/:subscriptionId/:deliveryDate/reschedule`
- **Request Body**:
  ```json
  {
    "newDate": "2023-11-01",
    "newSlot": "morning"
  }
  ```
- **Logic**:
  - Validates new date is within 2 months.
  - Checks for conflicts (existing delivery on new date).
  - Updates subscription end date if needed.

### 7.4 Bulk Reschedule
- **Endpoint**: `PATCH /deliveries/:subscriptionId/reschedule`
- **Request Body**:
  ```json
  {
    "deliveryDates": ["2023-10-28", "2023-10-29"],
    "newStartDate": "2023-11-05",
    "rescheduleType": "shift"
  }
  ```

### 7.5 Mark Delivery Delivered (Partner)
- **Endpoint**: `POST /subscriptions/delivery/delivered` (Check route path)
- **Request Body**:
  ```json
  {
    "subscriptionId": "...",
    "deliveryDate": "...",
    "deliveryPartnerId": "..."
  }
  ```
- **Logic**: Sets status to `awaitingCustomer`.

### 7.6 Confirm Delivery (Customer)
- **Endpoint**: `POST /subscriptions/delivery/confirm`
- **Logic**:
  - Sets status to `delivered`.
  - Updates `deliveredCount` and `remainingDeliveries`.
  - Emits `deliveryConfirmed` socket event.

---

## 8. Payments (`/payments`)

### 8.1 Create Razorpay Order
- **Endpoint**: `POST /payments/orders`
- **Request Body**:
  ```json
  {
    "amount": 500, // Amount in INR
    "currency": "INR",
    "receipt": "receipt_123",
    "orderId": "..." // Optional, for validating against existing order
  }
  ```
- **Logic**: Validates amount against order total if `orderId` provided.

### 8.2 Verify Payment
- **Endpoint**: `POST /payments/verify`
- **Request Body**:
  ```json
  {
    "order_id": "razorpay_order_id",
    "payment_id": "razorpay_payment_id",
    "signature": "razorpay_signature",
    "appOrderId": "..." // Optional (for one-time orders)
    "subscriptionId": "..." // Optional (for subscriptions)
  }
  ```
- **Logic**:
  - Verifies HMAC signature.
  - Updates Order or Subscription status to `active`/`verified`.
  - Uses database transactions for atomicity.
