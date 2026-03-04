"use client";

import { CreditCardIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { QueryOutput } from "@/server/queries";
import type { getPaymentMethods } from "../queries";

export type PaymentMethodsProps = {
    queryPromise: Promise<QueryOutput<typeof getPaymentMethods>>;
};

export function PaymentMethods({ queryPromise }: PaymentMethodsProps) {
    const paymentMethods = use(queryPromise);

    const t = useTranslations("Settings.Billing.PaymentMethods");

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Last 4 digits</TableHead>
                                <TableHead>Name on card</TableHead>
                                <TableHead className="text-right">
                                    Expiration
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paymentMethods.length > 0 ? (
                                paymentMethods.map((paymentMethod) => (
                                    <TableRow key={paymentMethod.id}>
                                        <TableCell>
                                            {paymentMethod.card?.display_brand}
                                        </TableCell>
                                        <TableCell>
                                            {paymentMethod.card?.last4}
                                        </TableCell>
                                        <TableCell>
                                            {paymentMethod.billing_details
                                                .name ?? "-"}
                                        </TableCell>
                                        <TableCell>
                                            {paymentMethod.card?.exp_month}/
                                            {paymentMethod.card?.exp_year}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <TrashIcon className="size-4" />{" "}
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Empty>
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <CreditCardIcon className="size-5" />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No payment methods.
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    You don&apos;t have any
                                                    payment methods yet.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
