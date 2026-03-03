import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
import { env as clerkEnv } from "./extensions/clerk";
import { env as stripeEnv } from "./extensions/stripe";

export const env = createEnv({
    extends: [clerkEnv, stripeEnv],

    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DATABASE_URL: z.string(),
        APP_NAME: z.string().default("Next Boiler"),
    },

    client: {
        NEXT_PUBLIC_APP_NAME: z.string().default("Next Boiler"),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
