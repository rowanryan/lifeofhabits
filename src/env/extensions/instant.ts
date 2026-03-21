import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        INSTANT_SCHEMA_FILE_PATH: z.string(),
        INSTANT_PERMS_FILE_PATH: z.string(),
    },

    client: {
        NEXT_PUBLIC_INSTANT_APP_ID: z.string(),
        NEXT_PUBLIC_INSTANT_CLERK_CLIENT_NAME: z.string(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_INSTANT_APP_ID: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
        NEXT_PUBLIC_INSTANT_CLERK_CLIENT_NAME:
            process.env.NEXT_PUBLIC_INSTANT_CLERK_CLIENT_NAME,
    },

    skipValidation: process.env.NODE_ENV === "test",
});
