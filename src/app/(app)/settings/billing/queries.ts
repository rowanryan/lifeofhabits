import { api } from "@/lib/polar";
import { polarCustomers } from "@/server/db/schema";
import { authQuery } from "@/server/queries";

export const getInternalCustomer = authQuery.query(async ({ ctx }) => {
    const internalCustomer = await ctx.db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer) {
        const clerkUser = await ctx.clerkClient.users.getUser(
            ctx.clerkAuth.userId
        );
        const primaryEmailAddress = clerkUser.primaryEmailAddress?.emailAddress;

        if (!primaryEmailAddress) {
            throw new Error("Primary email address not found.");
        }

        const newPolarCustomer = await api.customers.create({
            type: "individual",
            email: primaryEmailAddress,
            name: clerkUser.fullName,
            metadata: {
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        const [newInternalCustomer] = await ctx.db
            .insert(polarCustomers)
            .values({
                clerkUserId: ctx.clerkAuth.userId,
                externalId: newPolarCustomer.id,
            })
            .returning();

        if (!newInternalCustomer) {
            throw new Error("Failed to create new internal customer.");
        }

        await ctx.clerkClient.users.updateUserMetadata(ctx.clerkAuth.userId, {
            privateMetadata: {
                internalCustomerId: newInternalCustomer.id,
                polarCustomerId: newPolarCustomer.id,
            },
        });

        return newInternalCustomer;
    }

    return internalCustomer;
});
