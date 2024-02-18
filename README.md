# Bark Bank Pawtal 🐾

Bark Bank Pawtal is a web application for donors, Bark Bank staff/volunteers, and partner vets.

## Getting Started

First, run the development server using `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In another terminal, run `make` to execute code formatting and run tests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on AWS App Runner

The `main` branch will be deployed by AWS App Runner at:

- https://f8ppypkcjp.ap-southeast-1.awsapprunner.com/

This is a dev deployment for integration testing.

## Environment Variables for Dev

```
# SMTP Configuration
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_HOST=""  # Set to empty string, then the email can be read in the server logs.
SMTP_PORT=465

# OTP Configuration
OTP_SENDER_NAME="Bark Bank OTP"
OTP_SENDER_EMAIL="otp@barkbank.co"
OTP_SECRET="random-string-2925cd7d7bdf5b33d16bb8662beb3819dc300775"
OTP_PERIOD_MILLIS=15000
OTP_NUM_RECENT_PERIODS=4

# Next Auth
NEXTAUTH_SECRET="random-string-8a4a29fb78dbfcf61ceb79c10a4cfaaca539048b"
NEXTAUTH_URL=http://localhost:3000
```
