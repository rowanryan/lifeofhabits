import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoices } from "./components/Invoices";
import { Plan } from "./components/Plan";
import { getInvoices, getStripeCustomer } from "./queries";

export default async function Page() {
    const stripeCustomer = await getStripeCustomer();

    const invoices = getInvoices({
        stripeCustomerId: stripeCustomer.id,
    });

    return (
        <div className="space-y-4">
            <Plan />

            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                <Invoices queryPromise={invoices} />
            </Suspense>
        </div>
    );
}
