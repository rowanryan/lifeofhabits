import { redirect } from "next/navigation";
import { getInternalCustomer } from "../settings/billing/queries";
import { CheckoutVerification } from "./components/CheckoutVerification";

type CheckoutPageProps = {
    searchParams: Promise<{
        checkoutId?: string | string[];
    }>;
};

export default async function Page({ searchParams }: CheckoutPageProps) {
    const { checkoutId: rawCheckoutId } = await searchParams;
    const checkoutId = Array.isArray(rawCheckoutId)
        ? rawCheckoutId[0]
        : rawCheckoutId;

    if (!checkoutId) {
        redirect("/settings/billing");
    }

    await getInternalCustomer();

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <div className="max-w-2xl w-full">
                <CheckoutVerification checkoutId={checkoutId} />
            </div>
        </div>
    );
}
