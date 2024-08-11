# Bark Bank Pawtal 🐾

Bark Bank Pawtal is a web application for donors, partner vets, and Bark Bank admins.

## Setting up the development environment

This section walks through the steps for setting up a local deployment with a Pawtal service at port 3000 connected to a PostgreSQL database at port 5800, as illustrated below.

```
+----------------+
|     Pawtal     | <-- barkbank-pawtal
| localhost:3000 |
+----------------+
        |
        V
+----------------+
|   PostgreSQL   | <-- barkbank-schema
| localhost:5800 |
+----------------+
```

### First, start the database

In the `main` branch of the `barkbank-schema` repository, run `make local` to create the local PostgreSQL database that listens at port 5800.

Additional notes:

- The `make local` target is idempotent. It will always try to bring the locally running database at 5800 to the latest schema defined. It will not make changes to the schema or existing data once all migrations have been applied.
- Instructions for changing the schema itself can be found in the `barkbank-schema` repository.

### Second, create `.env.local`

In the working directory of the `barkbank-pawtal` repository, ensure the required environment variables are defined in the `.env.local` file. The easiest way is to copy from the `env.template` file.

```
$ cat env.template > .env.local
```

### Third, start the service

In the `main` branch of the `barkbank-pawtal` repository, run `make run` to start a Pawtal service that listens on port 3000. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Keep this terminal window handy. In the local deployment configured above, OTP emails are not sent, they are logged to standard out.

### Fourth, create local accounts

Run `make local-accounts` to create the following accounts in the local deployment:

- Admin Accounts: admin1@admin.com, admin2@admin.com, admin3@admin.com
- User Accounts: user1@user.com, user2@user.com, user3@user.com, ... (9 users)
- Vet Accounts: vet1@vet.com, vet2@vet.com, vet3@vet.com

The number of dogs created for a user is that user's index modulo 5.
So user1 to user4 will get 1, 2, 3, and 4 dogs respectively, while user5 will get 0 dogs.

## Backend Development

1. First, run `make` to ensure everything works. Running `make` does a couple of things. It will run `npm install`, format the code using Prettier, start a database for unit tests, run the unit tests, and then tear down the unit test database.

2. Second, write your code, and add tests.

3. Repeat, run `make` again to test and auto format the code, make changes, and so on and so forth.

## Frontend Development

1. Start the Playwright application using `make run-playwright`. (It is also possible to run all the tests using `make test-ui`, but I find the visual tool more useful for development.)

2. Make your changes, add the UI tests. They live in the `e2e` directory.

## Deployments

- Development/Demo: https://pawtal.dev.barkbank.co
- Production: https://pawtal.barkbank.co
