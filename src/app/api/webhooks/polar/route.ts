import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { db } from "@/server/db";
import { polarCustomers } from "@/server/db/schema";

export const POST = Webhooks({
    webhookSecret: env.POLAR_WEBHOOK_SECRET,
    async onSubscriptionCreated(payload) {
        const internalCustomer = await db.query.polarCustomers.findFirst({
            where: {
                externalId: payload.data.customerId,
            },
        });

        if (internalCustomer) {
            await db
                .update(polarCustomers)
                .set({
                    subscriptionId: payload.data.id,
                })
                .where(eq(polarCustomers.id, internalCustomer.id));
        }
    },
    async onSubscriptionRevoked(payload) {
        const internalCustomer = await db.query.polarCustomers.findFirst({
            where: {
                externalId: payload.data.customerId,
            },
        });

        if (internalCustomer) {
            await db
                .update(polarCustomers)
                .set({
                    subscriptionId: null,
                })
                .where(eq(polarCustomers.id, internalCustomer.id));
        }
    },
});
