import { redirect } from "next/navigation";
import { api } from "@/lib/polar";
import { authQuery } from "@/server/queries";

export const getCustomerState = authQuery.query(async ({ ctx }) => {
    const internalCustomer = await ctx.db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    if (!internalCustomer?.subscriptionId || !internalCustomer?.meterId) {
        redirect("/settings/billing/portal");
    }

    const customerState = await api.customers.getState({
        id: internalCustomer.externalId,
    });

    const activeSubscription = customerState.activeSubscriptions.find(
        subscription => subscription.id === internalCustomer.subscriptionId
    );
    if (!activeSubscription) {
        redirect("/settings/billing/portal");
    }

    const meter = activeSubscription.meters.find(
        meter => meter.id === internalCustomer.meterId
    );
    if (!meter) {
        redirect("/settings/billing/portal");
    }

    const product = await api.products.get({
        id: activeSubscription.productId,
    });
    if (!product) {
        throw new Error("Product not found.");
    }

    return {
        plan: {
            name: product.name,
            price: activeSubscription.amount,
            currency: activeSubscription.currency,
        },
        meter: {
            consumedUnits: meter.consumedUnits,
            creditedUnits: meter.creditedUnits,
        },
    };
});
