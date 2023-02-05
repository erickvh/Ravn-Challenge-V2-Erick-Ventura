# Ravn challenge v2 Erick Ventura

Multistore e-commerce platform.

## Pre-requisites

-   Node v18.0.0
-   PostgreSQL >= 13
-   Redis >= 6.0

## Optional pre-requisites

-   Docker >= 20.10.7
-   Docker-compose >= 1.29.2

Note:

-   If you want to use docker, you should execute the command `docker-compose up` in the root of the project.
-   If you want to use any command in the project, you should execute the command `docker-compose exec app bash` in the root of the project.

## Installation

1. Create a copy of `.env.example` with name `.env` and fill the variables with your data.

```bash
cp .env.example .env
```

### Enviroment variables

| Variables         | Description                             |
| ----------------- | --------------------------------------- |
| PORT              | Port where the server will be listening |
| POSTGRES_HOST     | Postgres host                           |
| POSTGRES_PORT     | Postgres port                           |
| POSTGRES_USER     | Postgres user                           |
| POSTGRES_PASSWORD | Postgres password                       |
| POSTGRES_DB       | Postgres database                       |
| REDIS_HOST        | Redis host                              |
| REDIS_PORT        | Redis port                              |
| EMAIL_HOST        | Email host                              |
| EMAIL_PORT        | Email port                              |
| EMAIL_USER        | Email user                              |
| EMAIL_PASSWORD    | Email password                          |
| JWT_SECRET        | Secret key for JWT                      |
| DATABASE_URL      | Postgres database url                   |

2. Install dependencies

```bash
npm install
```

3. Run migrations

```bash
npx prisma migrate dev
```

4. Seed database

```bash
npx prisma db seed
```

5. Run project

```bash
npm run dev
```

## Commands

Run the project in development mode with hot reload

```bash
npm run dev
```

Transpile the project to javascript

```bash
npm run build
```

## Testing

Run tests with jest and supertest and generate coverage report verbose

```bash
npm run test:verbose
```

Run tests with jest and supertest and generate coverage report no verbose

```bash
npm run test
```

Note: if you run the tests the database will be reset, so you should run seed again.

## Documentation

You can find the documentation in the following link:

https://documenter.getpostman.com/view/9154195/2s935oL4JT

## Credenctials for login (email / password / Role)

-   admin@store.com / admin / manager
-   customer.bar@test.com / secret123 / client

## Limitations

-   The checkout process is based on the last cart created by the user, so an user can only have one cart at the same time.
-   Once you like a product, if you like it again it will indicate that you have already liked it.
-   Queue for sending emails is implemented when stock is 3 or less, but it is not implemented when the stock is 0.

## Deployment

Solution deployed in Digital Ocean: http://137.184.1.34 or http://erickventura.tech

## Testing results

Here a brief summary of the testing results:

| File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| --------- | ------- | -------- | ------- | ------- | ----------------- |
| All files | 95.41   | 75       | 92.59   | 96.47   |                   |
