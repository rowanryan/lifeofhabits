"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
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
                <CardAction>
                    <Button variant="secondary" size="sm">
                        Manage <ExternalLinkIcon />
                    </Button>
                </CardAction>
            </CardHeader>
        </Card>
    );
}
