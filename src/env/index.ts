import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
import { env as clerkEnv } from "./extensions/clerk";

export const env = createEnv({
    extends: [clerkEnv],

    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DATABASE_URL: z.string(),
    },

    experimental__runtimeEnv: {},
});
