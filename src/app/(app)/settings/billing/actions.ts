"use server";

import { client } from "@/lib/stripe";
import { ActionError, authAction } from "@/server/actions";

export const createPortalSession = authAction.action(async ({ ctx }) => {
    const internalCustomer = await ctx.db.query.stripeCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer) {
        throw new ActionError("Internal customer not found.");
    }

    const portalSession = await client.billingPortal.sessions.create({
        customer: internalCustomer.externalId,
    });

    return {
        url: portalSession.url,
    };
});
