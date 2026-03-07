import { api } from "@/lib/polar";
import type { Context } from "@/server/shared";

export type CheckoutPollResult = {
    status: "pending" | "ready" | "invalid";
    checkoutValid: boolean;
    hasSubscription: boolean;
};

type GetCheckoutPollResultParams = {
    checkoutId: string;
    userId: string;
    db: Context["db"];
};

const invalidResult = (): CheckoutPollResult => ({
    status: "invalid",
    checkoutValid: false,
    hasSubscription: false,
});

export async function getCheckoutPollResult({
    checkoutId,
    userId,
    db,
}: GetCheckoutPollResultParams): Promise<CheckoutPollResult> {
    const internalCustomer = await db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: userId,
        },
    });

    if (!internalCustomer) {
        return invalidResult();
    }

    try {
        const checkout = await api.checkouts.get({
            id: checkoutId,
        });

        const checkoutValid =
            checkout.status === "succeeded" &&
            checkout.customerId === internalCustomer.externalId;

        if (!checkoutValid) {
            return invalidResult();
        }

        const hasSubscription = Boolean(internalCustomer.subscriptionId);

        return {
            status: hasSubscription ? "ready" : "pending",
            checkoutValid: true,
            hasSubscription,
        };
    } catch {
        return invalidResult();
    }
}
