import z from "zod";
import { client } from "@/lib/stripe";
import { stripeCustomers } from "@/server/db/schema";
import { authQuery } from "@/server/queries";

export const getStripeCustomer = authQuery.query(async ({ ctx }) => {
    const internalCustomer = await ctx.db.query.stripeCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer) {
        const clerkUser = await ctx.clerkClient.users.getUser(
            ctx.clerkAuth.userId
        );

        const newStripeCustomer = await client.customers.create({
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName ?? undefined,
        });

        const [newInternalCustomer] = await ctx.db
            .insert(stripeCustomers)
            .values({
                clerkUserId: ctx.clerkAuth.userId,
                externalId: newStripeCustomer.id,
            })
            .returning();

        if (!newInternalCustomer) {
            throw new Error("Failed to create internal customer.");
        }

        await ctx.clerkClient.users.updateUserMetadata(ctx.clerkAuth.userId, {
            privateMetadata: {
                internalCustomerId: newInternalCustomer.id,
                stripeCustomerId: newStripeCustomer.id,
            },
        });

        return newStripeCustomer;
    }

    const stripeCustomer = await client.customers.retrieve(
        internalCustomer.externalId
    );

    return stripeCustomer;
});

export const getPaymentMethods = authQuery.query(
    z.object({
        stripeCustomerId: z.string(),
    }),
    async ({ input }) => {
        const paymentMethods = await client.paymentMethods.list({
            customer: input.stripeCustomerId,
        });

        return paymentMethods.data;
    }
);

export const getInvoices = authQuery.query(
    z.object({
        stripeCustomerId: z.string(),
    }),
    async ({ input }) => {
        const invoices = await client.invoices.list({
            customer: input.stripeCustomerId,
        });

        return invoices.data;
    }
);
