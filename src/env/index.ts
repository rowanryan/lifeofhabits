import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
import { env as clerkEnv } from "./extensions/clerk";
import { env as instantEnv } from "./extensions/instant";
import { env as sentryEnv } from "./extensions/sentry";

export const env = createEnv({
    extends: [clerkEnv, sentryEnv, instantEnv],

    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        APP_NAME: z.string().default("Next Boiler"),
        APP_ENV: z.enum(["development", "production"]).default("development"),
    },

    client: {
        NEXT_PUBLIC_APP_NAME: z.string().default("Next Boiler"),
        NEXT_PUBLIC_APP_ENV: z
            .enum(["development", "production"])
            .default("development"),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
