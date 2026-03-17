import { auth } from "@clerk/nextjs/server";
import { autumnHandler } from "autumn-js/next";
import { getFullName } from "@/lib/utils";

export const { GET, POST } = autumnHandler({
    identify: async () => {
        const clerkAuth = await auth();

        return {
            customerId: clerkAuth.userId,
            customerData: {
                name: getFullName(
                    clerkAuth.sessionClaims?.firstName,
                    clerkAuth.sessionClaims?.lastName
                ),
                email: clerkAuth.sessionClaims?.priamryEmailAddress,
            },
        };
    },
});
