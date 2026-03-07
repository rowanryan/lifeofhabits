import { Subscription } from "./components/Subscription";
import { getCustomerState, getInternalCustomer } from "./queries";

export default async function Page() {
    const internalCustomer = await getInternalCustomer();
    const customerState = await getCustomerState();

    const subscription =
        customerState && internalCustomer.subscriptionId
            ? {
                  id: internalCustomer.subscriptionId,
                  meters: customerState.meters,
                  plan: customerState.plan,
              }
            : null;

    return (
        <div className="space-y-4">
            <Subscription
                subscription={subscription}
                internalCustomerId={internalCustomer.id}
            />
        </div>
    );
}
