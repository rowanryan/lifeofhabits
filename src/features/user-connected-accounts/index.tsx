"use client";

import { useUser } from "@clerk/nextjs";
import { CircleHelpIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
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
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { getOAuthProvider, type OAuthProviderId } from "@/config/clerk";
import { cn } from "@/lib/utils";
import { AddConnectedAccount } from "./components/AddConnectedAccount";
import { ConnectedAccountActionsDropdown } from "./components/ConnectedAccountActionsDropdown";

type VerificationStatus =
    | "unverified"
    | "verified"
    | "transferable"
    | "failed"
    | "expired";

export function UserConnectedAccounts() {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.ConnectedAccounts");

    const verificationStatusToLabel: Record<VerificationStatus, string> = {
        verified: t("VerificationStatus.Verified"),
        unverified: t("VerificationStatus.Unverified"),
        expired: t("VerificationStatus.Expired"),
        failed: t("VerificationStatus.Failed"),
        transferable: t("VerificationStatus.Transferable"),
    };

    const verificationErrorCodes: Record<string, string> = {
        oauth_identification_claimed: t(
            "VerificationStatus.Errors.oauth_identification_claimed",
        ),
    };

    const externalAccounts = useMemo(() => {
        return user?.externalAccounts
            .map((account) => ({
                id: account.id,
                provider: account.provider as OAuthProviderId,
                identifier: account.accountIdentifier(),
                verificationStatus: account.verification
                    ?.status as VerificationStatus,
                verificationError: account.verification?.error,
            }))
            .sort((a, b) => a.provider.localeCompare(b.provider));
    }, [user]);

    if (!externalAccounts) return <Skeleton className="h-48 rounded-lg" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
                <CardAction>
                    <AddConnectedAccount>
                        <Button size="sm">
                            <PlusIcon /> {t("AddButton")}
                        </Button>
                    </AddConnectedAccount>
                </CardAction>
            </CardHeader>

            <CardContent>
                <ItemGroup className="gap-0 rounded-2xl border">
                    {externalAccounts.map((account, idx) => {
                        const provider = getOAuthProvider(account.provider);
                        const isVerified =
                            account.verificationStatus === "verified";
                        const errorMessage = account.verificationError
                            ? (verificationErrorCodes[
                                  account.verificationError.code
                              ] ?? t("VerificationStatus.Errors.other"))
                            : null;

                        return (
                            <Fragment key={account.id}>
                                <Item>
                                    <ItemMedia>
                                        {provider ? (
                                            <provider.icon className="size-5" />
                                        ) : (
                                            <CircleHelpIcon className="size-5" />
                                        )}
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>
                                            {provider?.name ?? "Unknown"}
                                        </ItemTitle>
                                        <ItemDescription
                                            className={cn({
                                                "text-red-500":
                                                    account.verificationStatus ===
                                                    "failed",
                                                "text-yellow-500":
                                                    account.verificationStatus ===
                                                        "expired" ||
                                                    account.verificationStatus ===
                                                        "unverified",
                                                "text-blue-500":
                                                    account.verificationStatus ===
                                                    "transferable",
                                            })}
                                        >
                                            {isVerified ? (
                                                account.identifier
                                            ) : (
                                                <>
                                                    <span>
                                                        {
                                                            verificationStatusToLabel[
                                                                account
                                                                    .verificationStatus
                                                            ]
                                                        }
                                                    </span>
                                                    {errorMessage && (
                                                        <span>
                                                            {" "}
                                                            &bull;{" "}
                                                            {errorMessage}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </ItemDescription>
                                    </ItemContent>
                                    <ItemActions>
                                        <ConnectedAccountActionsDropdown
                                            accountId={account.id}
                                            isVerified={isVerified}
                                        />
                                    </ItemActions>
                                </Item>

                                {idx !== externalAccounts.length - 1 && (
                                    <ItemSeparator className="my-0" />
                                )}
                            </Fragment>
                        );
                    })}
                </ItemGroup>
            </CardContent>
        </Card>
    );
}
