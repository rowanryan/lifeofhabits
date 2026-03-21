import { init } from "@instantdb/react";
import { env } from "@/env";
import schema from "./schema";

export const db = init({
    appId: env.NEXT_PUBLIC_INSTANT_APP_ID,
    schema,
    useDateObjects: true,
});
