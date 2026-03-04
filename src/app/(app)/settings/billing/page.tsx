import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoices } from "./components/Invoices";
import { Plan } from "./components/Plan";
import { getInvoices, getStripeCustomer } from "./queries";

export default async function Page() {
    await getStripeCustomer();

    const invoices = getInvoices();

    return (
        <div className="space-y-4">
            <Plan />

            <Suspense fallback={<Skeleton className="h-84 w-full" />}>
                <Invoices queryPromise={invoices} />
            </Suspense>
        </div>
    );
}
