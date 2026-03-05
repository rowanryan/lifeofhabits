import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        POLAR_ACCESS_TOKEN: z.string(),
        POLAR_SUCCESS_URL: z.string(),
        POLAR_WEBHOOK_SECRET: z.string(),
    },

    client: {},

    experimental__runtimeEnv: {},

    skipValidation: process.env.NODE_ENV === "test",
});
