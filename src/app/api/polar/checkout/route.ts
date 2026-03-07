import { Checkout } from "@polar-sh/nextjs";
import { env } from "@/env";
import { getBaseUrl } from "@/lib/utils";

export const GET = Checkout({
    accessToken: env.POLAR_ACCESS_TOKEN,
    successUrl: `${getBaseUrl()}/settings/billing?checkout_id={CHECKOUT_ID}`,
    returnUrl: `${getBaseUrl()}/settings/billing`,
    server: env.APP_ENV === "development" ? "sandbox" : "production",
});
