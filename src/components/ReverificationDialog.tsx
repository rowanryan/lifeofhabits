"use client";

import { useSession } from "@clerk/nextjs";
import type {
    EmailCodeFactor,
    SessionVerificationLevel,
    SessionVerificationResource,
} from "@clerk/types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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

type ReverificationDialogProps = {
    open: boolean;
    onComplete: () => void;
    onCancel: () => void;
    level: SessionVerificationLevel | undefined;
};

export function ReverificationDialog({
    open,
    onComplete,
    onCancel,
    level = "first_factor",
}: ReverificationDialogProps) {
    const { session } = useSession();
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFactor, setEmailFactor] = useState<EmailCodeFactor | null>(
        null,
    );
    const verificationRef = useRef<SessionVerificationResource | null>(null);
    const hasStartedRef = useRef(false);

    const t = useTranslations("Common.Reverification");

    const handleVerify = async () => {
        if (!session || !code) return;

        setIsLoading(true);
        setError(null);

        try {
            await session.attemptFirstFactorVerification({
                strategy: "email_code",
                code,
            });
            onComplete();
        } catch (err) {
            console.error("Error verifying:", err);
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

    useEffect(() => {
        if (!open || !session || hasStartedRef.current) return;

        hasStartedRef.current = true;

        const startVerification = async () => {
            try {
                const response = await session.startVerification({ level });
                verificationRef.current = response;

                if (response.status === "needs_first_factor") {
                    const factor = response.supportedFirstFactors?.find(
                        (f): f is EmailCodeFactor =>
                            f.strategy === "email_code",
                    );

                    if (factor) {
                        setEmailFactor(factor);
                        await session.prepareFirstFactorVerification({
                            strategy: "email_code",
                            emailAddressId: factor.emailAddressId,
                        });
                    }
                }
            } catch (err) {
                console.error("Error starting verification:", err);
                setError(t("Error"));
            }
        };

        startVerification();
    }, [open, session, level, t]);

    useEffect(() => {
        if (!open) {
            setCode("");
            setError(null);
            setEmailFactor(null);
            verificationRef.current = null;
            hasStartedRef.current = false;
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>
                        {t("Description", {
                            email: emailFactor?.safeIdentifier ?? "",
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
