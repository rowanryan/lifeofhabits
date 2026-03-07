import { auth } from "@clerk/nextjs/server";
import { CustomerPortal } from "@polar-sh/nextjs";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { getBaseUrl } from "@/lib/utils";
import { db } from "@/server/db";

export const GET = CustomerPortal({
    accessToken: env.POLAR_ACCESS_TOKEN,
    getCustomerId: async () => {
        const clerkAuth = await auth();

        if (!clerkAuth.userId) {
            throw notFound();
        }

        const internalCustomer = await db.query.polarCustomers.findFirst({
            where: {
                clerkUserId: clerkAuth.userId,
            },
        });

        if (!internalCustomer) {
            throw notFound();
        }

        return internalCustomer.externalId;
    },
    returnUrl: `${getBaseUrl()}/settings/billing`,
    server: env.APP_ENV === "development" ? "sandbox" : "production",
});
