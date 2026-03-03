import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        STRIPE_SECRET_KEY: z.string(),
        STRIPE_WEBHOOK_SECRET: z.string(),
    },

    client: {
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
