# Next Boiler

[![Checks](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml/badge.svg)](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml)

A modern, production-ready Next.js boilerplate with authentication, payments, database, styling, and internationalization pre-configured.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) with App Router
-   **Runtime & Package Manager:** [Bun](https://bun.sh/)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **Payments:** [Polar](https://polar.sh/)
-   **Database:** [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.tech/) (PostgreSQL)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
-   **Testing:** [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
-   **Linting & Formatting:** [Biome](https://biomejs.dev/)
-   **Validation:** [Zod](https://zod.dev/)

## Prerequisites

-   [Bun](https://bun.sh/) (latest version recommended)
-   A [Clerk](https://clerk.com/) account for authentication
-   A [Polar](https://polar.sh/) account for payments
-   A [Neon](https://neon.tech/) database (or any PostgreSQL database)

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

### 3. Set up environment variables

Create a `.env` file in the root directory and add your environment variables:

```bash
# Database
DATABASE_URL=your_neon_database_url

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Polar
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret
POLAR_SUCCESS_URL=/settings/billing
POLAR_PRODUCT_ID=your_polar_product_id

# App
APP_ENV=development
```

### 4. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `bun dev`             | Start the development server   |
| `bun build`           | Build for production           |
| `bun start`           | Start the production server    |
| `bun lint`            | Run Biome linter               |
| `bun format`          | Format code with Biome         |
| `bun check`           | Run Biome linter and formatter |
| `bun test:unit`       | Run unit tests                 |
| `bun test:unit:watch` | Run unit tests in watch mode   |
| `bun i18n:check`      | Check for missing translations |

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Shared UI components
├── config/           # App configuration
├── env/              # Environment variable validation
├── features/         # Feature-based modules
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization config
├── lib/              # Utility functions
├── server/           # Server-side actions and queries
└── types/            # TypeScript type definitions
messages/             # Translation files
```
