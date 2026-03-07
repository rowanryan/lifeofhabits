import { Subscription } from "./components/Subscription";
import { getInternalCustomer } from "./queries";

export default async function Page() {
    const internalCustomer = await getInternalCustomer();

    return (
        <div className="space-y-4">
            <Subscription
                id={internalCustomer.subscriptionId}
                internalCustomerId={internalCustomer.id}
            />
        </div>
    );
}
