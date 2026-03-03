import { client } from "@/lib/stripe";
import { authQuery } from "@/server/queries";

export const getStripeCustomer = authQuery.query(async ({ ctx }) => {
    const clerkUser = await ctx.clerkClient.users.getUser(ctx.clerkAuth.userId);
    const stripeCustomerId = clerkUser.privateMetadata.stripeCustomerId;

    if (!stripeCustomerId) {
        const newStripeCustomer = await client.customers.create({
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName ?? undefined,
        });

        await ctx.clerkClient.users.updateUserMetadata(ctx.clerkAuth.userId, {
            privateMetadata: {
                stripeCustomerId: newStripeCustomer.id,
            },
        });

        return newStripeCustomer;
    }

    const stripeCustomer = await client.customers.retrieve(stripeCustomerId);

    return stripeCustomer;
});
