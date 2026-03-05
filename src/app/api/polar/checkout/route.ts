import { Checkout } from "@polar-sh/nextjs";
import { env } from "@/env";
import { getBaseUrl } from "@/lib/utils";

export const GET = Checkout({
    accessToken: env.POLAR_ACCESS_TOKEN,
    successUrl: `${getBaseUrl()}${env.POLAR_SUCCESS_URL}`,
});
