# Next Boiler

[![Checks](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml/badge.svg)](https://github.com/rowanryan/next-boiler/actions/workflows/push.yaml)

A modern, production-ready Next.js boilerplate with authentication, database, styling, and internationalization pre-configured.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) with App Router
-   **Runtime & Package Manager:** [Bun](https://bun.sh/)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **Database:** [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.tech/) (PostgreSQL)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
-   **Linting & Formatting:** [Biome](https://biomejs.dev/)
-   **Validation:** [Zod](https://zod.dev/)

## Prerequisites

-   [Bun](https://bun.sh/) (latest version recommended)
-   A [Clerk](https://clerk.com/) account for authentication
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

Create a `.env.local` file in the root directory and add your environment variables:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_neon_database_url
```

### 4. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `bun dev`        | Start the development server   |
| `bun build`      | Build for production           |
| `bun start`      | Start the production server    |
| `bun lint`       | Run Biome linter               |
| `bun format`     | Format code with Biome         |
| `bun check`      | Run Biome linter and formatter |
| `bun i18n:check` | Check for missing translations |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared UI components
├── features/         # Feature-based modules
├── i18n/             # Internationalization config
├── lib/              # Utility functions
└── types/            # TypeScript type definitions
messages/             # Translation files
```

## License

MIT
