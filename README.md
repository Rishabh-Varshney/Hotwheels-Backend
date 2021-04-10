# Hotwheels

The Backend of Hotwheels

## User Model

- id
- created at
- updated at
- email
- password
- role(client|owner|delivery)

## User CRUD

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email

## Restaurant Model

- name
- category
- address
- coverImage
- Edit Restaurant
- Delete Restaurant
- See Categories
- See Restaurants by Category (pagination)
- See Restaurants (pagination)
- See Restaurant

## Dishes CRUD

- Create Dish
- Edit Dish
- Delete Dish

## Orders CRUD

- Orders CRUD
- Orders Subscription (Owner, Customer, Delivery)
  - Pending Orders (Owner) (S: newOrder) (T: createOrder(newOrder))
  - Order Status (Customer, Delivery, Owner) (S: orderUpdate) (T: editOrder(orderUpdate))
  - Pending Pickup Order (Delivery) (S: orderUpdate) (T: editOrder(orderUpdate))
- Add Driver to Order

## Payments

- Payments(CRON)
