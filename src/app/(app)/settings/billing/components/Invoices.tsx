"use client";

import { CalendarIcon, EyeIcon, ReceiptTextIcon } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
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
import type { getInvoices } from "../queries";

export type InvoicesProps = {
    queryPromise: Promise<QueryOutput<typeof getInvoices>>;
};

export function Invoices({ queryPromise }: InvoicesProps) {
    const invoices = use(queryPromise);
    const format = useFormatter();

    const t = useTranslations("Settings.Billing.Invoices");

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
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Amount
                                </TableHead>
                                <TableHead className="text-right">
                                    Status
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="text-muted-foreground">
                                            <CalendarIcon className="size-3 mr-2" />{" "}
                                            {invoice.created}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.description}
                                        </TableCell>
                                        <TableCell>
                                            {format.number(invoice.amount_due, {
                                                style: "currency",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    invoice.status === "paid"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                asChild
                                                disabled={
                                                    !invoice.hosted_invoice_url
                                                }
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={
                                                        invoice.hosted_invoice_url ??
                                                        ""
                                                    }
                                                >
                                                    <EyeIcon className="size-4" />{" "}
                                                    View
                                                </Link>
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
                                                    <ReceiptTextIcon className="size-5" />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No invoices.
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    You don&apos;t have any
                                                    invoices yet.
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
