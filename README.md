# Life of Habits

[![Checks](https://github.com/rowanryan/lifeofhabits/actions/workflows/push.yaml/badge.svg)](https://github.com/rowanryan/lifeofhabits/actions/workflows/push.yaml)

A habit and event tracking web app that helps you log daily activities and plan future events. Built with Next.js, featuring a clean calendar-based interface for navigating between days.

## Features

-   **Event Logging** - Track and log daily events and habits
-   **Future Planning** - Plan events for upcoming days
-   **Date Navigation** - Browse through past and future dates with an intuitive interface
-   **User Authentication** - Secure sign-in with Clerk
-   **Subscription Billing** - Premium features via Polar integration
-   **Modern UI** - Clean, responsive design with Tailwind CSS and shadcn/ui

## Tech Stack

-   [Next.js 16](https://nextjs.org/) with App Router and React 19
-   [Bun](https://bun.sh/) for package management
-   [Clerk](https://clerk.com/) for authentication
-   [Polar](https://polar.sh/) for subscription billing
-   [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL/[Neon](https://neon.tech/)
-   [Zustand](https://zustand.docs.pmnd.rs/) for state management
-   [Tailwind CSS 4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
-   [Sentry](https://sentry.io/) for error monitoring
-   [next-intl](https://next-intl.dev/) for internationalization

## Prerequisites

-   [Bun](https://bun.sh/)
-   A PostgreSQL database such as [Neon](https://neon.tech/)
-   A [Clerk](https://clerk.com/) application
-   A [Polar](https://polar.sh/) organization and product
-   A [Sentry](https://sentry.io/) project

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rowanryan/lifeofhabits.git
cd lifeofhabits
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create your environment file

Create a `.env` file in the project root:

```bash
# App
APP_NAME="Life of Habits"
APP_ENV=development
NEXT_PUBLIC_APP_NAME="Life of Habits"
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
```

### 4. Initialize the database

```bash
bun db:push
```

Or use migrations:

```bash
bun db:generate
bun db:migrate
```

### 5. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

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
├── app/           # App Router routes and pages
├── components/    # Shared UI components
├── features/      # Feature modules (app-shell, user accounts, etc.)
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── server/        # Database schema, actions, and queries
├── lib/           # Utilities and integrations
├── env/           # Typed environment validation
├── i18n/          # Internationalization setup
└── types/         # TypeScript definitions
```
