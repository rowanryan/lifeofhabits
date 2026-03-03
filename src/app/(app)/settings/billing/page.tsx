import { Invoices } from "./components/Invoices";
import { PaymentMethods } from "./components/PaymentMethods";
import { Plan } from "./components/Plan";
import { getStripeCustomer } from "./queries";

export default async function Page() {
    await getStripeCustomer();

    return (
        <div className="space-y-4">
            <Plan />
            <PaymentMethods />
            <Invoices />
        </div>
    );
}
