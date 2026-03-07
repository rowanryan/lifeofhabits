"use client";

import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { Fragment } from "react";
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
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createCheckout } from "../actions";

export type SubscriptionProps = {
    internalCustomer: {
        id: string;
        spendLimit: number | null;
    };
    subscription: {
        id: string;
        plan: {
            name: string;
            price: number;
            currency: string;
            currentPeriodEnd: Date;
            status: string;
        };
        meters: {
            id: string;
            consumedUnits: number;
            creditedUnits: number;
        }[];
    } | null;
};

export function Subscription({
    subscription,
    internalCustomer,
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

    const isSpendLimitLowerThanIncludedUsage =
        subscription !== null &&
        internalCustomer.spendLimit !== null &&
        internalCustomer.spendLimit <
            subscription.meters.reduce(
                (acc, meter) => acc + meter.creditedUnits,
                0,
            );

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

                        {subscription.meters.length > 0 && (
                            <div className="mt-3">
                                <ItemGroup className="gap-0 rounded-2xl border">
                                    {subscription.meters.map((meter, idx) => (
                                        <Fragment key={meter.id}>
                                            <Item>
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {t("Credits.Title")}
                                                    </ItemTitle>
                                                    <ItemDescription className="text-xs">
                                                        {t(
                                                            "Credits.Description",
                                                        )}
                                                    </ItemDescription>

                                                    <Progress
                                                        value={
                                                            (meter.consumedUnits /
                                                                meter.creditedUnits) *
                                                            100
                                                        }
                                                        className="my-1 h-4"
                                                    />

                                                    <ItemDescription className="text-xs">
                                                        {t("Credits.Usage", {
                                                            consumedUnits:
                                                                format.number(
                                                                    meter.consumedUnits,
                                                                    {
                                                                        maximumFractionDigits: 2,
                                                                    },
                                                                ),
                                                            creditedUnits:
                                                                meter.creditedUnits,
                                                        })}{" "}
                                                        &bull; (
                                                        {format.number(
                                                            meter.consumedUnits /
                                                                meter.creditedUnits,
                                                            {
                                                                style: "percent",
                                                            },
                                                        )}
                                                        )
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>

                                            {idx !==
                                                subscription.meters.length -
                                                    1 && (
                                                <ItemSeparator className="my-0" />
                                            )}
                                        </Fragment>
                                    ))}
                                </ItemGroup>

                                <p className="mt-5 text-sm font-medium">
                                    {t("Credits.CurrentSpend")}{" "}
                                    <span className="text-muted-foreground">
                                        {format.number(
                                            subscription.meters.reduce(
                                                (acc, meter) =>
                                                    acc + meter.consumedUnits,
                                                0,
                                            ),
                                            {
                                                style: "currency",
                                                currency:
                                                    subscription.plan.currency,
                                            },
                                        )}
                                        {internalCustomer.spendLimit &&
                                            ` / ${format.number(internalCustomer.spendLimit, { style: "currency", currency: subscription.plan.currency })}`}
                                    </span>
                                </p>
                            </div>
                        )}
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
                                        internalCustomerId: internalCustomer.id,
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

            {!!subscription && (
                <CardFooter className="flex items-start gap-2">
                    {!internalCustomer.spendLimit && (
                        <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
                    )}

                    <div className="flex flex-col @xl/card:flex-row gap-3 @xl/card:items-center @xl/card:justify-between @xl/card:grow">
                        <div>
                            <p className="font-medium">
                                {internalCustomer.spendLimit
                                    ? t("SpendLimit.IsSet.Title", {
                                          limit: format.number(
                                              internalCustomer.spendLimit,
                                              {
                                                  style: "currency",
                                                  currency:
                                                      subscription.plan
                                                          .currency,
                                              },
                                          ),
                                      })
                                    : t("SpendLimit.NotSet.Title")}
                            </p>
                            <p
                                className={cn("text-sm text-muted-foreground", {
                                    "dark:text-orange-300 text-orange-400":
                                        isSpendLimitLowerThanIncludedUsage,
                                })}
                            >
                                {isSpendLimitLowerThanIncludedUsage
                                    ? t("SpendLimit.Warning")
                                    : t("SpendLimit.Description")}
                            </p>
                        </div>

                        <Button size="sm" variant="secondary" className="w-fit">
                            {internalCustomer.spendLimit
                                ? t("SpendLimit.IsSet.ButtonLabel")
                                : t("SpendLimit.NotSet.ButtonLabel")}
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
