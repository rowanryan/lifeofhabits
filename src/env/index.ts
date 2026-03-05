import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
import { env as clerkEnv } from "./extensions/clerk";
import { env as polarEnv } from "./extensions/polar";

export const env = createEnv({
    extends: [clerkEnv, polarEnv],

    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DATABASE_URL: z.string(),
        APP_NAME: z.string().default("Next Boiler"),
        APP_ENV: z.enum(["development", "production"]).default("development"),
    },

    client: {
        NEXT_PUBLIC_APP_NAME: z.string().default("Next Boiler"),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
