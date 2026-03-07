import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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

export function Subscription() {
    const t = useTranslations("Settings.Billing.Subscription");

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
                <CardAction>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/api/polar/portal">
                            {t("ManageButton.Label")} <ExternalLinkIcon />
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent></CardContent>

            <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex gap-3">
                    <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />

                    <div>
                        <p className="font-medium">{t("SpendLimit.Title")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("SpendLimit.Description")}
                        </p>
                    </div>
                </div>

                <Button size="sm">{t("SpendLimit.ButtonLabel")}</Button>
            </CardFooter>
        </Card>
    );
}
