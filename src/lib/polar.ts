import { Polar } from "@polar-sh/sdk";
import { env } from "@/env";

export const api = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: env.APP_ENV === "development" ? "sandbox" : "production",
});
