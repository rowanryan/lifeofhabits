import { api } from "@/lib/polar";
import { polarCustomers } from "@/server/db/schema";
import { authQuery } from "@/server/queries";

export const getInternalCustomer = authQuery.query(async ({ ctx }) => {
    let internalCustomer = await ctx.db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer) {
        const clerkUser = await ctx.clerkClient.users.getUser(
            ctx.clerkAuth.userId
        );

        if (!clerkUser.primaryEmailAddress?.emailAddress) {
            throw new Error("Email not found");
        }

        const newPolarCustomer = await api.customers.create({
            type: "individual",
            email: clerkUser.primaryEmailAddress.emailAddress,
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
            throw new Error("Failed to create internal customer");
        }

        internalCustomer = newInternalCustomer;

        await ctx.clerkClient.users.updateUserMetadata(ctx.clerkAuth.userId, {
            privateMetadata: {
                polarCustomerId: newPolarCustomer.id,
                internalCustomerId: internalCustomer.id,
            },
        });
    }

    return internalCustomer;
});

export const getCustomerState = authQuery.query(async ({ ctx }) => {
    const internalCustomer = await ctx.db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer?.subscriptionId) {
        return null;
    }

    const customerState = await api.customers.getState({
        id: internalCustomer.externalId,
    });

    const activeSubscription = customerState.activeSubscriptions.find(
        subscription => subscription.id === internalCustomer.subscriptionId
    );
    if (!activeSubscription) {
        return null;
    }

    const product = await api.products.get({
        id: activeSubscription.productId,
    });

    return {
        meters: activeSubscription.meters.map(meter => ({
            id: meter.id,
            consumedUnits: meter.consumedUnits,
            creditedUnits: meter.creditedUnits,
        })),
        plan: {
            name: product.name,
            price: activeSubscription.amount,
            currency: activeSubscription.currency,
            currentPeriodEnd: activeSubscription.currentPeriodEnd,
            status: activeSubscription.status,
        },
    };
});
