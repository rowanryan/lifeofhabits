# Next Boiler

[![Checks](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml/badge.svg)](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml)

A production-ready [Next.js 16](https://nextjs.org/) starter built with the App Router, Bun, Clerk, Polar, Drizzle, and Sentry. It includes authentication, subscription billing, usage-based credit tracking, typed environment validation, a PostgreSQL data layer, internationalization, testing, and a prebuilt UI foundation with Tailwind CSS and shadcn/ui.

## Features

-   [Next.js 16](https://nextjs.org/) with App Router and React 19
-   [Bun](https://bun.sh/) for package management and local scripts
-   [Clerk](https://clerk.com/) authentication with sign-in, sign-up, profile, and connected accounts flows
-   [Polar](https://polar.sh/) subscription billing with checkout, portal, and webhook handling
-   [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL/[Neon](https://neon.tech/)
-   [Sentry](https://sentry.io/) for client, server, and edge error monitoring
-   [Vercel AI SDK](https://sdk.vercel.ai/) helper for subscription-gated, metered AI usage
-   [next-intl](https://next-intl.dev/) for internationalization
-   [Tailwind CSS 4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for UI
-   [Biome](https://biomejs.dev/) for linting and formatting
-   [Vitest](https://vitest.dev/) and Testing Library for unit tests

## Prerequisites

-   [Bun](https://bun.sh/)
-   A PostgreSQL database such as [Neon](https://neon.tech/)
-   A [Clerk](https://clerk.com/) application
-   A [Polar](https://polar.sh/) organization, product, and credit meter
-   A [Sentry](https://sentry.io/) project

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rowanryan/next-boiler.git
cd next-boiler
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create your environment file

Create a `.env` file in the project root and add the values required by the current app configuration:

```bash
# App
APP_NAME="Next Boiler"
APP_ENV=development
NEXT_PUBLIC_APP_NAME="Next Boiler"
NEXT_PUBLIC_APP_ENV=development

# Database
DATABASE_URL="postgresql://..."

# Clerk
CLERK_SECRET_KEY="sk_test_..."
CLERK_BYPASS_PROTECTION=false
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"

# Polar
POLAR_ACCESS_TOKEN="..."
POLAR_WEBHOOK_SECRET="..."
POLAR_PRODUCT_ID="..."
POLAR_CREDITS_METER_ID="..."
NEXT_PUBLIC_POLAR_PRODUCT_ID="..."

# Sentry
SENTRY_DSN="..."
SENTRY_AUTH_TOKEN="..."
SENTRY_ORG="..."
SENTRY_PROJECT="..."
NEXT_PUBLIC_SENTRY_DSN="..."

# Optional AI Gateway
VERCEL_AI_GATEWAY_API_KEY="..."
```

Notes:

-   `APP_ENV` and `NEXT_PUBLIC_APP_ENV` should be `development` or `production`.
-   `CLERK_BYPASS_PROTECTION` is optional and is mainly useful for local development or preview environments.
-   `POLAR_PRODUCT_ID` and `NEXT_PUBLIC_POLAR_PRODUCT_ID` should point to the same product.
-   `POLAR_CREDITS_METER_ID` should reference the Polar meter used to track included credits and usage.
-   The current app expects Sentry to be configured because it is wired into `next.config.ts`, `src/instrumentation.ts`, and `src/instrumentation-client.ts`.
-   `VERCEL_AI_GATEWAY_API_KEY` is only needed if you use the AI helper in `src/lib/ai.ts`.

### 4. Initialize the database

For a fresh local database, sync the schema:

```bash
bun db:push
```

If you prefer working with generated migrations instead, use:

```bash
bun db:generate
bun db:migrate
```

### 5. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common Workflows

### Billing and webhooks

The boilerplate includes:

-   Polar checkout at `/api/polar/checkout`
-   Polar customer portal at `/api/polar/portal`
-   Polar webhook handling at `/api/webhooks/polar`
-   Billing UI under `/settings/billing`
-   Subscription credit usage display based on the configured Polar meter
-   Spend-limit controls stored against the local customer record

When testing Polar locally, make sure your webhook endpoint is reachable and uses the same `POLAR_WEBHOOK_SECRET` configured in `.env`.

The billing page expects `POLAR_CREDITS_METER_ID` to match the meter attached to the active subscription product so it can display usage correctly.

### AI usage metering

The project includes an `AI` helper in `src/lib/ai.ts` that can sit in front of Vercel AI SDK calls. It checks whether a Polar customer still has available credited usage, runs the model call, and records usage back to Polar through a `credit_usage` event when the call finishes.

This is useful if you want AI features to consume subscription credits instead of being completely unmetered. If you adopt it, configure `VERCEL_AI_GATEWAY_API_KEY` and pass a fallback `defaultMarketCost` for cases where gateway pricing metadata is unavailable.

### Error monitoring

Sentry is configured for:

-   client-side monitoring
-   server-side monitoring
-   edge runtime monitoring
-   request error capture through Next.js instrumentation

If you change or remove Sentry, update both the environment schema in `src/env/extensions/sentry.ts` and the integration points in `next.config.ts`, `src/instrumentation.ts`, and `src/instrumentation-client.ts`.

## Available Scripts

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `bun dev`             | Start the development server             |
| `bun build`           | Build for production                     |
| `bun start`           | Start the production server              |
| `bun lint`            | Run Biome linting                        |
| `bun format`          | Format the codebase with Biome           |
| `bun check`           | Run Biome checks and apply safe fixes    |
| `bun test:unit`       | Run unit tests once                      |
| `bun test:unit:watch` | Run unit tests in watch mode             |
| `bun i18n:check`      | Validate translation files               |
| `bun db:generate`     | Generate Drizzle migrations              |
| `bun db:migrate`      | Apply Drizzle migrations                 |
| `bun db:push`         | Push the schema directly to the database |
| `bun db:studio`       | Open Drizzle Studio                      |
| `bun vercel-build`    | Run database migrations and build for CI |

## Project Structure

```text
src/
├── app/           # App Router routes, pages, and API handlers
├── components/    # Shared UI components
├── config/        # Project-level configuration
├── env/           # Typed environment validation
├── features/      # Feature-focused UI and logic
├── hooks/         # Shared React hooks
├── i18n/          # next-intl setup
├── lib/           # Utilities and integrations
├── server/        # Database, server actions, and queries
└── types/         # Shared TypeScript definitions
messages/          # Translation message files
public/            # Static assets
```
