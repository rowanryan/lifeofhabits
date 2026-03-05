"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
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
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/api/polar/portal">
                            {t("Manage.Label")}{" "}
                            <ExternalLinkIcon className="size-4" />
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
        </Card>
    );
}
