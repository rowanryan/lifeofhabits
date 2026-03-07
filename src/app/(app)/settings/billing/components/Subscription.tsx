"use client";

import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { createCheckout } from "../actions";

export type SubscriptionProps = {
    id: string | null;
    internalCustomerId: string;
};

export function Subscription({ id, internalCustomerId }: SubscriptionProps) {
    const t = useTranslations("Settings.Billing.Subscription");

    const createCheckoutAction = useAction(createCheckout, {
        onSuccess({ data }) {
            window.location.href = data.url;
        },
        onError() {
            toast.error(t("Checkout.Error"));
        },
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
                {!!id && (
                    <CardAction>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/api/polar/portal">
                                {t("ManageButton.Label")} <ExternalLinkIcon />
                            </Link>
                        </Button>
                    </CardAction>
                )}
            </CardHeader>

            <CardContent>
                {id ? null : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle>{t("Checkout.Title")}</EmptyTitle>
                            <EmptyDescription>
                                {t("Checkout.Description")}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                disabled={createCheckoutAction.isExecuting}
                                onClick={() =>
                                    createCheckoutAction.execute({
                                        internalCustomerId,
                                    })
                                }
                            >
                                {createCheckoutAction.isExecuting && (
                                    <Spinner />
                                )}{" "}
                                {t("Checkout.ButtonLabel")}
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}
            </CardContent>

            <CardFooter className="flex items-start gap-2">
                <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />

                <div className="flex flex-col @xl/card:flex-row gap-3 @xl/card:items-center @xl/card:justify-between @xl/card:grow">
                    <div>
                        <p className="font-medium">{t("SpendLimit.Title")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("SpendLimit.Description")}
                        </p>
                    </div>

                    <Button
                        disabled={!id}
                        size="sm"
                        variant="secondary"
                        className="w-fit"
                    >
                        {t("SpendLimit.ButtonLabel")}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
