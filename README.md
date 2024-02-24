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

- https://fewspg9b3p.ap-southeast-1.awsapprunner.com/

This is a dev deployment for integration testing.

## Environment Variables for Dev

Put these into `.env.local` for local development.

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
BARKBANK_OTP_NUM_RECENT_PERIODS=4
BARKBANK_OTP_SECRET="secret-for-otp-generation"
BARKBANK_PII_SECRET="secret-for-pii-privacy"
```
