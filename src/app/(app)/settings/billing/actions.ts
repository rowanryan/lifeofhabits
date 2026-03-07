"use server";

import z from "zod";
import { env } from "@/env";
import { api } from "@/lib/polar";
import { getBaseUrl } from "@/lib/utils";
import { ActionError, authAction } from "@/server/actions";

export const createCheckout = authAction
    .inputSchema(
        z.object({
            internalCustomerId: z.string(),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const internalCustomer = await ctx.db.query.polarCustomers.findFirst({
            where: {
                id: parsedInput.internalCustomerId,
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        if (!internalCustomer) {
            throw new ActionError("Internal customer not found");
        }

        const checkout = await api.checkouts.create({
            customerId: internalCustomer.externalId,
            products: [env.POLAR_PRODUCT_ID],
            successUrl: `${getBaseUrl()}/checkout?checkoutId={CHECKOUT_ID}`,
            returnUrl: `${getBaseUrl()}/settings/billing`,
        });

        return checkout;
    });
