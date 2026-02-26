"use client";

import type { EmailAddressResource } from "@clerk/types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FieldSet } from "@/components/ui/field";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

type VerifyEmailDialogProps = {
    open: boolean;
    onComplete: () => void;
    onCancel: () => void;
    emailResource: EmailAddressResource;
};

export function VerifyEmailDialog({
    open,
    onComplete,
    onCancel,
    emailResource,
}: VerifyEmailDialogProps) {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations(
        "Settings.Account.EmailAddresses.CreateEmailAddress.VerifyEmail",
    );

    const handleVerify = async () => {
        if (!code) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await emailResource.attemptVerification({ code });

            if (result.verification.status === "verified") {
                onComplete();
            } else {
                setError(t("VerificationFailed"));
                setCode("");
            }
        } catch (err) {
            console.error("Error verifying email:", err);
            setError(t("InvalidCode"));
            setCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeComplete = (value: string) => {
        setCode(value);
        if (value.length === 6) {
            handleVerify();
        }
    };

    const handleResendCode = async () => {
        setError(null);
        setCode("");

        try {
            await emailResource.prepareVerification({ strategy: "email_code" });
        } catch (err) {
            console.error("Error resending code:", err);
            setError(t("ResendError"));
        }
    };

    useEffect(() => {
        if (!open) {
            setCode("");
            setError(null);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>
                        {t("Description", {
                            email: emailResource.emailAddress,
                        })}
                    </DialogDescription>
                </DialogHeader>

                <FieldSet className="items-center">
                    <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={code}
                        onChange={setCode}
                        onComplete={handleCodeComplete}
                        disabled={isLoading}
                        containerClassName="justify-center"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors"
                    >
                        {t("ResendCode")}
                    </button>
                </FieldSet>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {t("Cancel")}
                    </Button>
                    <Button
                        onClick={handleVerify}
                        disabled={isLoading || code.length !== 6}
                    >
                        {t("Verify")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
