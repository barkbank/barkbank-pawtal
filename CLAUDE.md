# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bark Bank Pawtal is a Next.js 14 (App Router) web application for the Bark Bank canine blood bank. It serves three user types — donors (users), partner vets, and admins — each with their own authenticated portal.

## Commands

```bash
make              # install deps, format, lint, unit test, schema-diff (default dev loop)
make all          # same as above + e2e tests

make dev          # start dev server on :3000
make fmt          # prettier
make lint         # eslint
make test         # spin up testdb → jest → tear down testdb
make test-ui      # playwright headless (Mobile Chrome + chromium)
make run-playwright  # playwright interactive UI mode

make db-reset     # drop & recreate local postgres db via barkbank-schema sibling repo
make db-refill    # seed dev data: admin1-3@admin.com, user1-9@user.com, vet1-3@vet.com
```

**Run a single Jest test file:**
```bash
npx jest tests/path/to/file.test.ts
```

**Run a single Playwright test:**
```bash
npx playwright test e2e/path/to/file.spec.ts --project chromium
```

The `make test` target also runs `scripts/test_no_wip_tasks_remaining.sh`, which fails if any `WIP:` comment marker exists in source. Don't use `WIP:` in code you plan to commit.

## Architecture

### App Router structure

Three portals live under `src/app/`:
- `/user/` — donor portal (registration, pet management, profile)
- `/vet/` — vet portal (call tasks, appointments, report submission)
- `/admin/` — admin portal (user/vet/dog management)

Each portal has `(logged-in)/` route groups for protected pages, a `login/` route, and a `_lib/` folder for portal-specific helpers.

### Dependency injection — `AppFactory` (`src/lib/app.ts`)

A single `AppFactory` singleton (exported as `APP`) is created at module load and holds all services as promise-cached singletons. Services are lazily initialized on first access. Never construct services directly in page or route code — always go through `APP`.

```ts
import APP from "@/lib/app";
const userActorFactory = await APP.getUserActorFactory();
```

### Actor pattern

Business operations are executed through Actors, not accessed directly via services. An actor represents an authenticated caller:

- `UserActor` — for logged-in donors
- `VetActor` — for logged-in vets  
- `AdminActor` — for logged-in admins
- `Visitor` — for unauthenticated users (registration)

Actors are constructed per-request from their respective factories using the caller's email. Route handlers and server actions call `getAuthenticatedUserActor()` / `getAuthenticatedVetActor()` / `getAuthenticatedAdminActor()` from `src/lib/auth.ts`.

### BarkContext

`BarkContext` (`src/lib/bark/bark-context.ts`) is the central dependency object passed to all operations and services:

```ts
type BarkContext = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;  // for personal data (user PII)
  oiiEncryptionService: EncryptionService;  // for other identifiable info (dog data)
  textEncryptionService: EncryptionService; // for free-form text fields
  emailService: EmailService;
};
```

### Operations (`src/lib/bark/operations/op-*.ts`)

Operations are stateless async functions that implement domain business logic. They take `(context: BarkContext, args)` and return `Result<T, E>`. All domain business logic lives here.

### Result type

No thrown errors in business logic. Functions return `Result<T, E>` from `src/lib/utilities/result.ts`:

```ts
// Returning success
return Ok({ reportId });

// Returning typed error
return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);

// Consuming
const { result, error } = await opSubmitReport(context, args);
if (error !== undefined) { /* handle */ }
```

Error codes live in `src/lib/utilities/bark-code.ts`.

### Authentication

OTP-based auth via NextAuth Credentials provider. Login flow:
1. User submits email → server sends OTP via email (or logs to console in dev)
2. User submits OTP → NextAuth validates, sets session + STK cookie

In `BARKBANK_ENV=development` or `test`, `DevelopmentOtpService` accepts any 6-digit code and logs the real OTP to stdout instead of emailing it.

### Encryption

Emails are stored as HMAC hashes (never plaintext). User PII and dog OII (other identifiable info) are encrypted at rest using HKDF-derived keys. The three encryption services use different key derivation purposes (`"pii"`, `"oii"`, `"text"`).

### Database

PostgreSQL 15.2, running locally on port **5800**. Flyway manages migrations in `db/`. Unit tests use a separate testdb instance (managed by `scripts/testdb.sh`).

The `barkbank-schema` sibling repo holds the canonical schema. Use `make schema-diff` / `make schema-recv` / `make schema-send` to sync.

### Path alias

`@/*` maps to `src/*` throughout the codebase.

## Environment variables

Copy `env.template` to `.env.local`. Key variables:
- `BARKBANK_ENV` — `development` | `test` | `production` (controls OTP and email service behavior)
- `BARKBANK_DB_*` — postgres connection (default: localhost:5800, user postgres, password "password")
- `DANGEROUS_ENABLED=true` — enables `/api/dangerous/*` endpoints for dev data manipulation
- `BARKBANK_IKM1_HEX`, `BARKBANK_IKM2_HEX` — encryption key material (required)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — NextAuth config
- `BARKBANK_ROOT_ADMIN_EMAIL` — bootstrap admin account whitelist

## Comment markers

`WIP:`, `TODO:`, `STEP:` are tracked by `make wip`, `make todo`, `make step`. Commits must have zero `WIP:` markers (enforced by CI).
