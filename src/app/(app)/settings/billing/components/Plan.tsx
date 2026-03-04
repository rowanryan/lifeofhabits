"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { createPortalSession } from "../actions";

export function Plan() {
    const t = useTranslations("Settings.Billing.Plan");

    const manage = useAction(createPortalSession, {
        onSuccess({ data }) {
            window.open(data.url, "_blank", "noopener,noreferrer");
        },
        onError() {
            toast.error(t("Manage.Toast.Error"));
        },
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
                <CardAction>
                    <Button
                        disabled={manage.isExecuting}
                        variant="secondary"
                        size="sm"
                        onClick={() => manage.execute()}
                    >
                        {t("Manage.Label")}{" "}
                        {manage.isExecuting ? (
                            <Spinner />
                        ) : (
                            <ExternalLinkIcon className="size-4" />
                        )}
                    </Button>
                </CardAction>
            </CardHeader>
        </Card>
    );
}
