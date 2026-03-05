import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { api } from "@/lib/polar";
import { getBaseUrl } from "@/lib/utils";
import { db } from "@/server/db";
import { polarCustomers } from "@/server/db/schema";

export async function GET() {
    const clerkAuth = await auth();
    const clerk = await clerkClient();

    if (!clerkAuth.userId) {
        throw new Error("Unauthorized");
    }

    let internalCustomer = await db.query.polarCustomers.findFirst({
        where: {
            clerkUserId: clerkAuth.userId,
        },
    });

    if (!internalCustomer) {
        const clerkUser = await clerk.users.getUser(clerkAuth.userId);

        if (!clerkUser.primaryEmailAddress?.emailAddress) {
            throw new Error("Email not found");
        }

        const newPolarCustomer = await api.customers.create({
            type: "individual",
            email: clerkUser.primaryEmailAddress.emailAddress,
            name: clerkUser.fullName,
            metadata: {
                clerkUserId: clerkAuth.userId,
            },
        });

        const [newInternalCustomer] = await db
            .insert(polarCustomers)
            .values({
                clerkUserId: clerkAuth.userId,
                externalId: newPolarCustomer.id,
            })
            .returning();

        if (!newInternalCustomer) {
            throw new Error("Failed to create internal customer");
        }

        internalCustomer = newInternalCustomer;

        await clerk.users.updateUserMetadata(clerkAuth.userId, {
            privateMetadata: {
                polarCustomerId: newPolarCustomer.id,
                internalCustomerId: internalCustomer.id,
            },
        });
    }

    if (!internalCustomer.subscriptionId) {
        const checkout = await api.checkouts.create({
            customerId: internalCustomer.externalId,
            products: [env.POLAR_PRODUCT_ID],
            successUrl: `${getBaseUrl()}${env.POLAR_SUCCESS_URL}`,
            returnUrl: getBaseUrl(),
        });

        return NextResponse.redirect(checkout.url);
    } else {
        const portal = await api.customerSessions.create({
            customerId: internalCustomer.externalId,
            returnUrl: `${getBaseUrl()}/settings`,
        });

        return NextResponse.redirect(portal.customerPortalUrl);
    }
}
