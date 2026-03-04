import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoices } from "./components/Invoices";
import { PaymentMethods } from "./components/PaymentMethods";
import { Plan } from "./components/Plan";
import { getInvoices, getPaymentMethods, getStripeCustomer } from "./queries";

export default async function Page() {
    const stripeCustomer = await getStripeCustomer();

    const paymentMethods = getPaymentMethods({
        stripeCustomerId: stripeCustomer.id,
    });

    const invoices = getInvoices({
        stripeCustomerId: stripeCustomer.id,
    });

    return (
        <div className="space-y-4">
            <Plan />

            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                <PaymentMethods queryPromise={paymentMethods} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                <Invoices queryPromise={invoices} />
            </Suspense>
        </div>
    );
}
