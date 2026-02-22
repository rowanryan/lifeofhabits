import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
import { env as clerkEnv } from "./clerk";

export const env = createEnv({
    extends: [clerkEnv],

    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DATABASE_URL: z.url(),
    },

    experimental__runtimeEnv: {},
});
