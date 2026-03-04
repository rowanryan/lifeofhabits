"use client";

import { useTranslations } from "next-intl";
import { use } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
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
    use(queryPromise);

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

                        <TableBody></TableBody>
                    </Table>

                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
