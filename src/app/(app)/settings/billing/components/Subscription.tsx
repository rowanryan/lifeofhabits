"use client";

import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
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
    internalCustomerId: string;
    subscription: {
        id: string;
        plan: {
            name: string;
            price: number;
            currency: string;
            currentPeriodEnd: Date;
            status: string;
        };
    } | null;
};

export function Subscription({
    subscription,
    internalCustomerId,
}: SubscriptionProps) {
    const t = useTranslations("Settings.Billing.Subscription");
    const format = useFormatter();

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
                {!!subscription && (
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
                {subscription ? (
                    <div>
                        <p className="text-lg font-semibold">
                            {subscription.plan.name}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                            {t("Plan.Price", {
                                price: format.number(
                                    subscription.plan.price / 100,
                                    {
                                        style: "currency",
                                        currency: subscription.plan.currency,
                                    },
                                ),
                            })}{" "}
                            &bull;{" "}
                            {t("Plan.RenewalDate", {
                                date: format.dateTime(
                                    subscription.plan.currentPeriodEnd,
                                    {
                                        dateStyle: "medium",
                                    },
                                ),
                            })}
                        </p>
                    </div>
                ) : (
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
                        disabled={!subscription}
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
