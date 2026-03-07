import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        VERCEL_AI_GATEWAY_API_KEY: z.string(),
    },

    client: {},

    experimental__runtimeEnv: {},

    skipValidation: process.env.NODE_ENV === "test",
});
