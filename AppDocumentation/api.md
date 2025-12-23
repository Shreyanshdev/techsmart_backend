# API Documentation

Base URL: `http://<your-backend-url>/api/v1`

## 1. Authentication

### Customer Login
- **Endpoint**: `POST /auth/customer/login`
- **Body**:
  ```json
  {
    "phone": "9876543210",
    "password": "password123" // Or OTP flow if implemented
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { ... }
  }
  ```

### Delivery Partner Login
- **Endpoint**: `POST /auth/delivery-partner/login`
- **Body**:
  ```json
  {
    "phone": "9876543210",
    "password": "password123"
  }
  ```

### Refresh Token
- **Endpoint**: `POST /auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```

## 2. User Profile

### Get Profile
- **Endpoint**: `GET /profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User details object.

### Update Profile
- **Endpoint**: `PUT /profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "New Name",
    "email": "new@email.com",
    "address": "New Address" // Optional
  }
  ```

## 3. Addresses

### Get All Addresses
- **Endpoint**: `GET /addresses`
- **Headers**: `Authorization: Bearer <token>`

### Add Address
- **Endpoint**: `POST /addresses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "addressLine1": "Flat 101",
    "addressLine2": "Apartment Name",
    "city": "City",
    "state": "State",
    "zipCode": "123456",
    "latitude": 12.34,
    "longitude": 56.78
  }
  ```

### Update Address
- **Endpoint**: `PUT /addresses/:id`

### Delete Address
- **Endpoint**: `DELETE /addresses/:id`

## 4. Products

### Get All Products
- **Endpoint**: `GET /products`
- **Query Params**: `category`, `search`, `page`, `limit`

### Get Product Details
- **Endpoint**: `GET /products/:productId`

### Get Categories
- **Endpoint**: `GET /products/categories`

## 5. Subscriptions

### Create Subscription
- **Endpoint**: `POST /subscriptions`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "customerId": "user_id", // Optional if inferred from token
    "products": [
      {
        "productId": "prod_id",
        "quantity": 1,
        "deliveryFrequency": "daily" // daily, alternate, weekly, monthly
      }
    ],
    "startDate": "2023-10-27",
    "endDate": "2023-11-27",
    "slot": "morning", // morning, evening
    "addressId": "addr_id"
  }
  ```

### Get My Subscriptions
- **Endpoint**: `GET /subscriptions/my`

### Get Subscription Details
- **Endpoint**: `GET /subscriptions/:id`

### Add Product to Subscription
- **Endpoint**: `POST /subscriptions/:id/products`
- **Body**:
  ```json
  {
    "productId": "prod_id",
    "quantity": 1,
    "frequency": "daily"
  }
  ```

## 6. Delivery Management

### Get Delivery Details
- **Endpoint**: `GET /deliveries/:subscriptionId/:deliveryDate`

### Change Delivery Slot
- **Endpoint**: `PATCH /deliveries/:subscriptionId/:deliveryDate/slot`
- **Body**:
  ```json
  {
    "newSlot": "evening"
  }
  ```

### Reschedule Single Delivery
- **Endpoint**: `PATCH /deliveries/:subscriptionId/:deliveryDate/reschedule`
- **Body**:
  ```json
  {
    "newDate": "2023-10-28",
    "newSlot": "morning" // Optional
  }
  ```

### Bulk Reschedule
- **Endpoint**: `PATCH /deliveries/:subscriptionId/reschedule`
- **Body**:
  ```json
  {
    "startDate": "2023-10-28",
    "endDate": "2023-10-30",
    "newDate": "2023-11-01" // Shift to start from this date
  }
  ```

### Get Calendar
- **Endpoint**: `GET /deliveries/:subscriptionId/calendar`
- **Query Params**: `month=10&year=2023`

## 7. Orders (One-time)

### Create Order
- **Endpoint**: `POST /orders`
- **Body**:
  ```json
  {
    "items": [
      { "productId": "id", "quantity": 2 }
    ],
    "addressId": "addr_id",
    "paymentMethod": "online"
  }
  ```

### Get My Orders
- **Endpoint**: `GET /orders/my-history`

## 8. Payments

### Create Razorpay Order
- **Endpoint**: `POST /payments/orders`
- **Body**:
  ```json
  {
    "amount": 500, // Amount in INR
    "currency": "INR"
  }
  ```

### Verify Payment
- **Endpoint**: `POST /payments/verify`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_123",
    "razorpay_payment_id": "pay_123",
    "razorpay_signature": "sig_123"
  }
  ```
