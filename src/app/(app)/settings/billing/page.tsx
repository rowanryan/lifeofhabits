import { ZapIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { CheckoutButton } from "./components/CheckoutButton";
import { Subscription } from "./components/Subscription";
import { getInternalCustomer } from "./queries";

export default async function Page() {
    const internalCustomer = await getInternalCustomer();
    const t = await getTranslations("Settings.Billing.Checkout");

    if (!internalCustomer.subscriptionId) {
        return (
            <Empty>
                <EmptyMedia variant="icon">
                    <ZapIcon className="size-5" />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>{t("Title")}</EmptyTitle>
                    <EmptyDescription>{t("Description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <CheckoutButton internalCustomerId={internalCustomer.id} />
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="space-y-4">
            <Subscription />
        </div>
    );
}
