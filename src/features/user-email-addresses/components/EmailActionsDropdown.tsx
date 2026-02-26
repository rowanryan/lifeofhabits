"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import type { SessionVerificationLevel } from "@clerk/types";
import { EllipsisIcon, ShieldCheckIcon, StarIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ReverificationDialog } from "@/components/ReverificationDialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EmailActionsDropdownProps = {
    emailId: string;
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
    isPrimary,
    isVerified,
}: EmailActionsDropdownProps) {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.EmailAddresses.Actions");
    const [showReverification, setShowReverification] = useState(false);
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

    const handleSetAsPrimary = async () => {
        try {
            await setAsPrimary();
            toast.success(t("SetAsPrimarySuccess"));
        } catch (error) {
            console.error("Error setting primary email:", error);
            toast.error(t("SetAsPrimaryError"));
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

    const canSetAsPrimary = !isPrimary && isVerified;

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
                    <DropdownMenuItem disabled>
                        <ShieldCheckIcon />
                        {t("Verify")}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" disabled>
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
        </>
    );
}
