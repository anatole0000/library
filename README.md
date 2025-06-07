# Library GraphQL API

This is a library management API built with **Koa**, **GraphQL (Apollo Server)**, **TypeORM**, and **PostgreSQL**.

## Features

- User registration and login (Reader)
- Role-based access control (READER, ADMIN)
- Manage authors, books, readers, and loans
- JWT-based authentication and authorization
- Input validation with class-validator

## Technologies

- Node.js, TypeScript
- Koa framework
- Apollo Server (GraphQL)
- TypeORM (ORM)
- PostgreSQL (Database)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT)
- class-validator (Input validation)

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/koa-graphql-library.git
cd koa-graphql-library

2. Install dependencies

npm install

3. Configure the database connection

Edit ormconfig.ts or db.ts to match your PostgreSQL setup.

4. Build and run the app

npm run build
npm start

Or run in development mode:

npm run dev

### Usage
Access the GraphQL Playground at http://localhost:4000/graphql.

Use mutations and queries to interact with the API according to the schema.

Email Confirmation on Registration
This project includes automatic email sending functionality after a user registers successfully.

How it works
After a user registers via the register mutation, the server sends a welcome email to the user's email address.

The email is sent using Nodemailer configured with SMTP credentials.

For development and testing, Mailtrap is used as the SMTP server to safely capture emails without sending real emails.

Setup SMTP for email sending
Create an account on Mailtrap and get your SMTP credentials.

Replace the SMTP credentials in src/utils/mailer.ts with your Mailtrap SMTP configuration:

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "your_mailtrap_user",
    pass: "your_mailtrap_password",
  },
});

Make sure your register mutation calls the sendEmail function to send the welcome email.

Testing
Run your app locally.

Register a new user via GraphQL Playground or Apollo Studio.

Check the email in your Mailtrap inbox.