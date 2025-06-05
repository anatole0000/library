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
