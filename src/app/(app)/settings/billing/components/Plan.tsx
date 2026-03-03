"use client";

import { useTranslations } from "next-intl";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function Plan() {
    const t = useTranslations("Settings.Billing.Plan");

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
            </CardHeader>
        </Card>
    );
}
