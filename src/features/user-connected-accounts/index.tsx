"use client";

import { useUser } from "@clerk/nextjs";
import { CircleHelpIcon, EllipsisIcon, PlusIcon } from "lucide-react";
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
import { AddConnectedAccount } from "./components/AddConnectedAccount";

export function UserConnectedAccounts() {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.ConnectedAccounts");

    const externalAccounts = useMemo(() => {
        return user?.externalAccounts
            .map((account) => ({
                id: account.id,
                provider: account.provider as OAuthProviderId,
                identifier: account.accountIdentifier(),
                verification: account.verification,
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
                                        <ItemDescription>
                                            {account.identifier}
                                        </ItemDescription>
                                    </ItemContent>
                                    <ItemActions>
                                        <Button variant="ghost" size="icon-sm">
                                            <EllipsisIcon />
                                        </Button>
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
