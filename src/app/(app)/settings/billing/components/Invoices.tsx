"use client";

import { ReceiptTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function Invoices() {
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
                                <TableHead>{t("Table.Date")}</TableHead>
                                <TableHead>{t("Table.Description")}</TableHead>
                                <TableHead className="text-right">
                                    {t("Table.Amount")}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t("Table.Status")}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t("Table.Actions")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <ReceiptTextIcon className="size-5" />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                {t("Table.Empty.Title")}
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                {t("Table.Empty.Description")}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
