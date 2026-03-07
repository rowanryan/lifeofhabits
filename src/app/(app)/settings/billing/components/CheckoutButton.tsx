"use client";

import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createCheckout } from "../actions";

export type CheckoutButtonProps = {
    internalCustomerId: string;
};

export function CheckoutButton({ internalCustomerId }: CheckoutButtonProps) {
    const t = useTranslations("Settings.Billing.Checkout");

    const action = useAction(createCheckout, {
        onSuccess({ data }) {
            window.location.href = data.url;
        },
        onError() {
            toast.error(t("Error"));
        },
    });

    return (
        <Button
            disabled={action.isExecuting}
            onClick={() => action.execute({ internalCustomerId })}
        >
            {action.isExecuting && <Spinner />} {t("ButtonLabel")}
        </Button>
    );
}
