import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import { env } from "@/env";
import { relations } from "./relations";

if (typeof WebSocket === "undefined") {
    neonConfig.webSocketConstructor = ws;
}

const sql = neon(env.DATABASE_URL);

export const db = drizzle({ client: sql, relations });
