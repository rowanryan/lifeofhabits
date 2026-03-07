"use server";

import { eq } from "drizzle-orm";
import z from "zod";
import { env } from "@/env";
import { api } from "@/lib/polar";
import { getBaseUrl } from "@/lib/utils";
import { ActionError, authAction } from "@/server/actions";
import { polarCustomers } from "@/server/db/schema";

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

export const updateSpendLimit = authAction
    .inputSchema(
        z.object({
            spendLimit: z.number().min(0).max(1_000_000).nullable(),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const internalCustomer = await ctx.db.query.polarCustomers.findFirst({
            where: {
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        if (!internalCustomer) {
            throw new ActionError("Internal customer not found");
        }

        const [updatedInternalCustomer] = await ctx.db
            .update(polarCustomers)
            .set({
                spendLimit: parsedInput.spendLimit,
            })
            .where(eq(polarCustomers.id, internalCustomer.id))
            .returning();

        if (!updatedInternalCustomer) {
            throw new ActionError("Failed to update internal customer");
        }

        return updatedInternalCustomer.spendLimit;
    });
