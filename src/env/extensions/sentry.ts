import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        SENTRY_DSN: z.string(),
        SENTRY_AUTH_TOKEN: z.string(),
        SENTRY_ORG: z.string(),
        SENTRY_PROJECT: z.string(),
    },

    client: {
        NEXT_PUBLIC_SENTRY_DSN: z.string(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
