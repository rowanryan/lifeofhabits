"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

type CheckoutVerificationProps = {
    checkoutId: string;
};

type CheckoutPollResponse = {
    status: "pending" | "ready" | "invalid";
    checkoutValid: boolean;
    hasSubscription: boolean;
};

type CheckoutUiState = CheckoutPollResponse["status"] | "timeout" | "error";

const POLL_INTERVAL_MS = 1500;
const MAX_ATTEMPTS = 20;
const REDIRECT_DELAY_SECONDS = 5;

export function CheckoutVerification({
    checkoutId,
}: CheckoutVerificationProps) {
    const router = useRouter();
    const t = useTranslations("Checkout.Confirmation");
    const [state, setState] = useState<CheckoutUiState>("pending");
    const [redirectInSeconds, setRedirectInSeconds] = useState(
        REDIRECT_DELAY_SECONDS,
    );

    useEffect(() => {
        let isCancelled = false;
        let timeoutId: number | undefined;
        let attempts = 0;

        const poll = async () => {
            try {
                const response = await fetch(
                    `/checkout/poll?checkout_id=${encodeURIComponent(checkoutId)}`,
                    {
                        cache: "no-store",
                    },
                );

                if (isCancelled) {
                    return;
                }

                if (!response.ok) {
                    setState("error");
                    return;
                }

                const data = (await response.json()) as CheckoutPollResponse;

                if (data.status === "ready") {
                    setRedirectInSeconds(REDIRECT_DELAY_SECONDS);
                    setState("ready");
                    return;
                }

                if (data.status === "invalid") {
                    setState("invalid");
                    return;
                }

                attempts += 1;

                if (attempts >= MAX_ATTEMPTS) {
                    setState("timeout");
                    return;
                }

                timeoutId = window.setTimeout(
                    () => void poll(),
                    POLL_INTERVAL_MS,
                );
            } catch {
                if (isCancelled) {
                    return;
                }

                attempts += 1;

                if (attempts >= MAX_ATTEMPTS) {
                    setState("error");
                    return;
                }

                timeoutId = window.setTimeout(
                    () => void poll(),
                    POLL_INTERVAL_MS,
                );
            }
        };

        setState("pending");
        setRedirectInSeconds(REDIRECT_DELAY_SECONDS);
        void poll();

        return () => {
            isCancelled = true;

            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [checkoutId]);

    useEffect(() => {
        if (state !== "ready") {
            return;
        }

        if (redirectInSeconds === 0) {
            router.replace("/");
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setRedirectInSeconds((currentSeconds) => currentSeconds - 1);
        }, 1000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [redirectInSeconds, router, state]);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <Card className="w-full">
            <CardHeader className="items-center text-center">
                {state === "pending" ? (
                    <div className="flex justify-center">
                        <Spinner className="size-6" />
                    </div>
                ) : null}

                <CardTitle>
                    {state === "ready"
                        ? t("Success.Title")
                        : state === "invalid"
                          ? t("Invalid.Title")
                          : state === "timeout"
                            ? t("Timeout.Title")
                            : state === "error"
                              ? t("Error.Title")
                              : t("Pending.Title")}
                </CardTitle>

                <CardDescription>
                    {state === "ready"
                        ? t("Success.Description", {
                              seconds: redirectInSeconds,
                          })
                        : state === "invalid"
                          ? t("Invalid.Description")
                          : state === "timeout"
                            ? t("Timeout.Description")
                            : state === "error"
                              ? t("Error.Description")
                              : t("Pending.Description")}
                </CardDescription>
            </CardHeader>

            {state === "pending" ? (
                <CardContent className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        {t("Pending.CheckoutId", { checkoutId })}
                    </p>
                </CardContent>
            ) : null}

            {state === "invalid" || state === "timeout" || state === "error" ? (
                <CardFooter className="justify-center gap-3">
                    {state === "timeout" || state === "error" ? (
                        <Button onClick={handleRetry} variant="outline">
                            {t("Actions.Retry")}
                        </Button>
                    ) : null}

                    <Button asChild>
                        <Link href="/settings/billing">
                            {t("Actions.BackToBilling")}
                        </Link>
                    </Button>
                </CardFooter>
            ) : null}

            {state === "ready" ? (
                <CardFooter className="justify-center">
                    <Button asChild>
                        <Link href="/">{t("Actions.GoToHome")}</Link>
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    );
}
