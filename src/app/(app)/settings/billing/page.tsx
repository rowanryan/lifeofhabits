import { Invoices } from "./components/Invoices";
import { PaymentMethods } from "./components/PaymentMethods";
import { Plan } from "./components/Plan";

export default function Page() {
    return (
        <div className="space-y-4">
            <Plan />
            <PaymentMethods />
            <Invoices />
        </div>
    );
}
