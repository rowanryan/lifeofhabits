"use client";

import { useUser } from "@clerk/nextjs";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type VerificationStatus =
    | "unverified"
    | "verified"
    | "transferable"
    | "failed"
    | "expired";

export function EmailAddresses() {
    const t = useTranslations("Settings.Account.EmailAddresses");
    const { user } = useUser();

    const verificationStatusToLabel: Record<VerificationStatus, string> = {
        verified: t("VerificationStatus.Verified"),
        unverified: t("VerificationStatus.Unverified"),
        expired: t("VerificationStatus.Expired"),
        failed: t("VerificationStatus.Failed"),
        transferable: t("VerificationStatus.Transferable"),
    };

    const emailAddresses = useMemo(() => {
        if (user) {
            return user.emailAddresses
                .map((ea) => ({
                    id: ea.id,
                    emailAddress: ea.emailAddress,
                    verificationStatus: ea.verification.status,
                    isPrimary: ea.id === user.primaryEmailAddressId,
                }))
                .sort((a, b) => {
                    if (a.isPrimary && !b.isPrimary) return -1;
                    if (!a.isPrimary && b.isPrimary) return 1;
                    return 0;
                });
        }
    }, [user]);

    if (!emailAddresses) return <Skeleton className="h-12 rounded-lg" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
                <CardAction>
                    <Button size="sm">
                        <PlusIcon /> {t("AddButton")}
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <ItemGroup>
                    {emailAddresses.map((ea) => (
                        <Item key={ea.id} variant="outline">
                            <ItemContent className="gap-1">
                                <ItemTitle>{ea.emailAddress}</ItemTitle>
                                <ItemDescription className="text-sm">
                                    {ea.verificationStatus && (
                                        <span
                                            className={cn({
                                                "text-teal-500":
                                                    ea.verificationStatus ===
                                                    "verified",
                                                "text-red-500":
                                                    ea.verificationStatus ===
                                                    "failed",
                                                "text-yellow-500":
                                                    ea.verificationStatus ===
                                                        "expired" ||
                                                    ea.verificationStatus ===
                                                        "unverified",
                                                "text-blue-500":
                                                    ea.verificationStatus ===
                                                    "transferable",
                                            })}
                                        >
                                            {
                                                verificationStatusToLabel[
                                                    ea.verificationStatus
                                                ]
                                            }
                                        </span>
                                    )}
                                    {ea.isPrimary && (
                                        <span className="text-muted-foreground">
                                            &nbsp;&bull; {t("Primary")}
                                        </span>
                                    )}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button variant="ghost" size="icon-sm">
                                    <EllipsisIcon />
                                </Button>
                            </ItemActions>
                        </Item>
                    ))}
                </ItemGroup>
            </CardContent>
        </Card>
    );
}
