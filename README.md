# HotWheels : Live MART- Online Delivery System

- A Web application for e-marketing that connects customers (individuals who shop for home purpose) to retailers (people dealing with multiple items who stores items in large quantities) and retailers to wholesalers (warehouse maintaining people)
- Tech. Stack: Typescript,Nest.js,GraphQL,PostgreSQL,TypeORM
- Frontend Link: https://github.com/rajatvohra/Hotwheels-frontend

## Team-Details:
Member | College Id
------------ | -------------
Rishabh Varshney | 2017B4A31124H
Abhyudaya Prakash Rai   | 2017B4AA0816H
Rajat Vohra | 2017B4AA0966H
Vrinda | 2017B1A31316H


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

## Store Model

- name
- category
- address
- coverImage
- Edit Store
- Delete Store
- See Categories
- See Stores by Category (pagination)
- See Stores (pagination)
- See Store

## Products CRUD

- Create Product
- Edit Product
- Delete Product

## Orders CRUD

- Orders CRUD
- Orders Subscription (Owner, Customer, Delivery)
  - Pending Orders (Owner) (S: newOrder) (T: createOrder(newOrder))
  - Order Status (Customer, Delivery, Owner) (S: orderUpdate) (T: editOrder(orderUpdate))
  - Pending Pickup Order (Delivery) (S: orderUpdate) (T: editOrder(orderUpdate))
- Add Driver to Order

## Payments

- Payments(CRON)


