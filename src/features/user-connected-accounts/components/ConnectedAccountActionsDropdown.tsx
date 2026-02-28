"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import type { SessionVerificationLevel } from "@clerk/types";
import { EllipsisIcon, ShieldCheckIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ReverificationDialog } from "@/components/ReverificationDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ConnectedAccountActionsDropdownProps = {
    accountId: string;
    providerName: string;
    isVerified: boolean;
};

type ReverificationHandlers = {
    complete: () => void;
    cancel: () => void;
    level: SessionVerificationLevel | undefined;
};

export function ConnectedAccountActionsDropdown({
    accountId,
    providerName,
    isVerified,
}: ConnectedAccountActionsDropdownProps) {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.ConnectedAccounts.Actions");
    const [showReverification, setShowReverification] = useState(false);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [reverificationHandlers, setReverificationHandlers] =
        useState<ReverificationHandlers | null>(null);

    const reauthorizeAccount = useReverification(
        async () => {
            const externalAccount = user?.externalAccounts.find(
                (ea) => ea.id === accountId,
            );
            if (externalAccount) {
                const result = await externalAccount.reauthorize({
                    redirectUrl: "/settings/account",
                });
                if (result?.verification?.externalVerificationRedirectURL) {
                    window.location.href =
                        result.verification.externalVerificationRedirectURL.toString();
                }
            }
        },
        {
            onNeedsReverification: ({ complete, cancel, level }) => {
                setReverificationHandlers({ complete, cancel, level });
                setShowReverification(true);
            },
        },
    );

    const removeAccount = useReverification(
        async () => {
            const accountToRemove = user?.externalAccounts.find(
                (ea) => ea.id === accountId,
            );
            if (accountToRemove) {
                await accountToRemove.destroy();
                toast.success(t("RemoveSuccess"));
            }
        },
        {
            onNeedsReverification: ({ complete, cancel, level }) => {
                setReverificationHandlers({ complete, cancel, level });
                setShowReverification(true);
            },
        },
    );

    const handleVerify = async () => {
        try {
            await reauthorizeAccount();
        } catch (error) {
            console.error("Error verifying connected account:", error);
            toast.error(t("VerifyError"));
        }
    };

    const handleRemove = () => {
        setShowRemoveConfirmation(true);
    };

    const handleConfirmRemove = async () => {
        setShowRemoveConfirmation(false);
        try {
            await removeAccount();
        } catch (error) {
            console.error("Error removing connected account:", error);
            toast.error(t("RemoveError"));
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
    };

    const canVerify = !isVerified;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <EllipsisIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={handleVerify}
                        disabled={!canVerify}
                    >
                        <ShieldCheckIcon />
                        {t("Verify")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleRemove}
                    >
                        <TrashIcon />
                        {t("Remove")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ReverificationDialog
                open={showReverification}
                onComplete={handleReverificationComplete}
                onCancel={handleReverificationCancel}
                level={reverificationHandlers?.level}
            />

            <AlertDialog
                open={showRemoveConfirmation}
                onOpenChange={setShowRemoveConfirmation}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("RemoveConfirmTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("RemoveConfirmDescription", { provider: providerName })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("RemoveConfirmCancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleConfirmRemove}
                        >
                            {t("RemoveConfirmAction")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
