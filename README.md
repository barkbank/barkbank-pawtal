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

In the working directory of the `barkbank-pawtal` repository, ensure the following environment variables are defined in the `.env.local` file.

```
NEXTAUTH_SECRET="secret-for-next-auth"
NEXTAUTH_URL=http://localhost:3000

BARKBANK_SMTP_USER=""
BARKBANK_SMTP_PASSWORD=""
BARKBANK_SMTP_HOST=""  # Set to empty string, then the email can be read in the server logs.
BARKBANK_SMTP_PORT=465
BARKBANK_OTP_SENDER_NAME="Bark Bank OTP"
BARKBANK_OTP_SENDER_EMAIL="otp@barkbank.co"
BARKBANK_OTP_PERIOD_MILLIS=15000
BARKBANK_OTP_NUM_RECENT_PERIODS=8
BARKBANK_OTP_SECRET="secret-for-otp-generation"
BARKBANK_PII_SECRET="secret-for-pii-privacy"
BARKBANK_OII_SECRET="secret-for-oii-privacy"
BARKBANK_TEXT_SECRET="secret-for-text-privacy"
BARKBANK_IKM1_HEX="7f70f45f9f0cf9384a5b9f9d5b15d2b982f42bce4b971049e90e63972cfd871c"
BARKBANK_IKM2_HEX="b445c469a7ea83f201df41f21345e33271601db7a736ed379eef5cac07c5dbf1"
BARKBANK_DB_HOST=localhost
BARKBANK_DB_PORT=5800
BARKBANK_DB_NAME=devdb
BARKBANK_DB_USER=postgres
BARKBANK_DB_PASSWORD=password
BARKBANK_ROOT_ADMIN_EMAIL=admin1@admin.com
DANGEROUS_ENABLED=true
DANGEROUS_CREDENTIALS=developer:password
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

## Dev deployment

There is a dev deployment running in AWS at the URL below.

- https://fewspg9b3p.ap-southeast-1.awsapprunner.com/

Whenever changes are merged into the `main` branch, the dev deployment will be rebuilt and redeployed.
