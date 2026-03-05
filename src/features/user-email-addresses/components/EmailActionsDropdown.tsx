"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import type {
    EmailAddressResource,
    SessionVerificationLevel,
} from "@clerk/types";
import {
    EllipsisIcon,
    ShieldCheckIcon,
    StarIcon,
    TrashIcon,
} from "lucide-react";
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
import { VerifyEmailDialog } from "./VerifyEmailDialog";

type EmailActionsDropdownProps = {
    emailId: string;
    emailAddress: string;
    isPrimary: boolean;
    isVerified: boolean;
};

type ReverificationHandlers = {
    complete: () => void;
    cancel: () => void;
    level: SessionVerificationLevel | undefined;
};

export function EmailActionsDropdown({
    emailId,
    emailAddress,
    isPrimary,
    isVerified,
}: EmailActionsDropdownProps) {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.EmailAddresses.Actions");
    const [showReverification, setShowReverification] = useState(false);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);
    const [emailResourceToVerify, setEmailResourceToVerify] =
        useState<EmailAddressResource | null>(null);
    const [reverificationHandlers, setReverificationHandlers] =
        useState<ReverificationHandlers | null>(null);

    const setAsPrimary = useReverification(
        async () => {
            await user?.update({ primaryEmailAddressId: emailId });
        },
        {
            onNeedsReverification: ({ complete, cancel, level }) => {
                setReverificationHandlers({ complete, cancel, level });
                setShowReverification(true);
            },
        },
    );

    const removeEmail = useReverification(
        async () => {
            const emailToRemove = user?.emailAddresses.find(
                (ea) => ea.id === emailId,
            );
            if (emailToRemove) {
                await emailToRemove.destroy();
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

    const handleSetAsPrimary = async () => {
        try {
            await setAsPrimary();
            toast.success(t("SetAsPrimarySuccess"));
        } catch (error) {
            console.error("Error setting primary email:", error);
            toast.error(t("SetAsPrimaryError"));
        }
    };

    const handleRemove = () => {
        setShowRemoveConfirmation(true);
    };

    const handleConfirmRemove = async () => {
        setShowRemoveConfirmation(false);
        try {
            await removeEmail();
        } catch (error) {
            console.error("Error removing email:", error);
            toast.error(t("RemoveError"));
        }
    };

    const handleVerify = async () => {
        try {
            const emailResource = user?.emailAddresses.find(
                (ea) => ea.id === emailId,
            );
            if (emailResource) {
                await emailResource.prepareVerification({
                    strategy: "email_code",
                });
                setEmailResourceToVerify(emailResource);
                setShowVerifyDialog(true);
            }
        } catch (error) {
            console.error("Error starting verification:", error);
            toast.error(t("VerifyError"));
        }
    };

    const handleVerifyComplete = () => {
        setShowVerifyDialog(false);
        setEmailResourceToVerify(null);
        toast.success(t("VerifySuccess"));
    };

    const handleVerifyCancel = () => {
        setShowVerifyDialog(false);
        setEmailResourceToVerify(null);
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

    const canSetAsPrimary = !isPrimary && isVerified;
    const canVerify = !isVerified;
    const canRemove = !isPrimary;

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
                        onClick={handleSetAsPrimary}
                        disabled={!canSetAsPrimary}
                    >
                        <StarIcon />
                        {t("SetAsPrimary")}
                    </DropdownMenuItem>
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
                        disabled={!canRemove}
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
                            {t("RemoveConfirmDescription", {
                                email: emailAddress,
                            })}
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

            {emailResourceToVerify && (
                <VerifyEmailDialog
                    open={showVerifyDialog}
                    onComplete={handleVerifyComplete}
                    onCancel={handleVerifyCancel}
                    emailResource={emailResourceToVerify}
                />
            )}
        </>
    );
}
