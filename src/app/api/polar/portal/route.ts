import { auth } from "@clerk/nextjs/server";
import { CustomerPortal } from "@polar-sh/nextjs";
import { env } from "@/env";
import { getBaseUrl } from "@/lib/utils";
import { db } from "@/server/db";

export const GET = CustomerPortal({
    accessToken: env.POLAR_ACCESS_TOKEN,
    getCustomerId: async () => {
        const clerkAuth = await auth();

        if (!clerkAuth.userId) {
            throw new Error("Unauthorized");
        }

        const internalCustomer = await db.query.polarCustomers.findFirst({
            where: {
                clerkUserId: clerkAuth.userId,
            },
        });

        if (!internalCustomer) {
            throw new Error("Internal customer not found.");
        }

        return internalCustomer.externalId;
    },
    returnUrl: `${getBaseUrl()}/settings`,
    server: env.APP_ENV === "development" ? "sandbox" : "production",
});
