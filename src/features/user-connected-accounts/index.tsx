"use client";

import { useUser } from "@clerk/nextjs";
import { SiApple, SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";
import { CircleQuestionMarkIcon, EllipsisIcon, PlusIcon } from "lucide-react";
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

const ACCOUNT_TO_ICON: Record<string, React.ReactNode> = {
    google: <SiGoogle className="size-5" />,
    facebook: <SiFacebook className="size-5" />,
    apple: <SiApple className="size-5" />,
};

const ACCOUNT_TO_NAME: Record<string, string> = {
    google: "Google",
    facebook: "Facebook",
    apple: "Apple",
};

export function UserConnectedAccounts() {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.ConnectedAccounts");

    const externalAccounts = useMemo(() => {
        return user?.externalAccounts
            .map((account) => ({
                id: account.id,
                provider: account.provider,
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
                    <Button size="sm">
                        <PlusIcon /> {t("AddButton")}
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <ItemGroup className="gap-0 rounded-2xl border">
                    {externalAccounts.map((account, idx) => (
                        <Fragment key={account.id}>
                            <Item>
                                <ItemMedia>
                                    {ACCOUNT_TO_ICON[account.provider] ?? (
                                        <CircleQuestionMarkIcon />
                                    )}
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>
                                        {ACCOUNT_TO_NAME[account.provider] ??
                                            "Unknown"}
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
                    ))}
                </ItemGroup>
            </CardContent>
        </Card>
    );
}
