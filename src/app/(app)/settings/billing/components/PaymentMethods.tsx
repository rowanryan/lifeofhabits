"use client";

import { useTranslations } from "next-intl";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function PaymentMethods() {
    const t = useTranslations("Settings.Billing.PaymentMethods");

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
            </CardHeader>
        </Card>
    );
}
