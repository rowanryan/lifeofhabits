import { Webhooks } from "@polar-sh/nextjs";
import { env } from "@/env";

export const POST = Webhooks({
    webhookSecret: env.POLAR_WEBHOOK_SECRET,
    onPayload: async () => {},
});
