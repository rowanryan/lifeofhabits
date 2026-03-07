import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        POLAR_ACCESS_TOKEN: z.string(),
        POLAR_WEBHOOK_SECRET: z.string(),
        POLAR_PRODUCT_ID: z.string(),
    },

    client: {
        NEXT_PUBLIC_POLAR_PRODUCT_ID: z.string(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_POLAR_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
