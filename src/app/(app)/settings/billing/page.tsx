import { Subscription } from "./components/Subscription";
import { getCustomerState, getInternalCustomer } from "./queries";

export default async function Page() {
    const internalCustomer = await getInternalCustomer();
    const customerState = await getCustomerState();

    const subscription =
        customerState && internalCustomer.subscriptionId
            ? {
                  id: internalCustomer.subscriptionId,
                  plan: {
                      name: customerState.plan.name,
                      price: customerState.plan.price,
                      currency: customerState.plan.currency,
                      currentPeriodEnd: customerState.plan.currentPeriodEnd,
                      status: customerState.plan.status,
                  },
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
