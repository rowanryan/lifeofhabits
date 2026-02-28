"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import type { OAuthStrategy, SessionVerificationLevel } from "@clerk/types";
import { useTranslations } from "next-intl";
import { cloneElement, isValidElement, useState } from "react";
import { toast } from "sonner";
import { ReverificationDialog } from "@/components/ReverificationDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OAUTH_PROVIDERS } from "@/config/clerk";

type AddConnectedAccountProps = {
    children: React.ReactElement<{ disabled?: boolean }>;
};

type ReverificationHandlers = {
    complete: () => void;
    cancel: () => void;
    level: SessionVerificationLevel | undefined;
};

export function AddConnectedAccount({ children }: AddConnectedAccountProps) {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.ConnectedAccounts");
    const [showReverification, setShowReverification] = useState(false);
    const [reverificationHandlers, setReverificationHandlers] =
        useState<ReverificationHandlers | null>(null);
    const [pendingStrategy, setPendingStrategy] = useState<OAuthStrategy | null>(
        null,
    );

    const createExternalAccount = useReverification(
        async (strategy: OAuthStrategy) => {
            const externalAccount = await user?.createExternalAccount({
                strategy,
                redirectUrl: "/settings/account",
            });

            if (externalAccount?.verification?.externalVerificationRedirectURL) {
                window.location.href =
                    externalAccount.verification.externalVerificationRedirectURL.toString();
            }
        },
        {
            onNeedsReverification: ({ complete, cancel, level }) => {
                setReverificationHandlers({ complete, cancel, level });
                setShowReverification(true);
            },
        },
    );

    const handleProviderSelect = async (strategy: OAuthStrategy) => {
        setPendingStrategy(strategy);
        try {
            await createExternalAccount(strategy);
        } catch (error) {
            console.error("Error creating external account:", error);
            toast.error(t("AddAccount.Error"));
        } finally {
            setPendingStrategy(null);
        }
    };

    const handleReverificationComplete = () => {
        reverificationHandlers?.complete();
        setShowReverification(false);
        setReverificationHandlers(null);
    };

    const handleReverificationCancel = () => {
        reverificationHandlers?.cancel();
        setShowReverification(false);
        setReverificationHandlers(null);
        setPendingStrategy(null);
    };

    const connectedProviderIds = user?.externalAccounts.map(
        (account) => account.provider,
    );

    const availableProviders = OAUTH_PROVIDERS.filter(
        (provider) => !connectedProviderIds?.includes(provider.id as never),
    );

    const hasAvailableProviders = availableProviders.length > 0;

    const trigger = isValidElement(children)
        ? cloneElement(children, { disabled: !hasAvailableProviders })
        : children;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {availableProviders.map((provider) => {
                        const Icon = provider.icon;
                        return (
                            <DropdownMenuItem
                                key={provider.id}
                                onClick={() => handleProviderSelect(provider.strategy)}
                                disabled={pendingStrategy === provider.strategy}
                            >
                                <Icon className="size-4" />
                                {provider.name}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <ReverificationDialog
                open={showReverification}
                onComplete={handleReverificationComplete}
                onCancel={handleReverificationCancel}
                level={reverificationHandlers?.level}
            />
        </>
    );
}
