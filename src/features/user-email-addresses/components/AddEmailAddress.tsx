"use client";

import { useReverification, useUser } from "@clerk/nextjs";
import type {
    EmailAddressResource,
    SessionVerificationLevel,
} from "@clerk/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FormField } from "@/components/FormField";
import { ReverificationDialog } from "@/components/ReverificationDialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useZodResolver } from "@/hooks/use-zod-error-map";
import { VerifyEmailDialog } from "./VerifyEmailDialog";

type AddEmailAddressProps = React.PropsWithChildren;

const formSchema = z.object({
    emailAddress: z.email(),
});

type ReverificationHandlers = {
    complete: () => void;
    cancel: () => void;
    level: SessionVerificationLevel | undefined;
};

export function AddEmailAddress({ children }: AddEmailAddressProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [nestedDialog, setNestedDialog] = useState<
        "reverification" | "verification" | null
    >(null);
    const [emailResource, setEmailResource] =
        useState<EmailAddressResource | null>(null);
    const [reverificationHandlers, setReverificationHandlers] =
        useState<ReverificationHandlers | null>(null);

    const { user } = useUser();
    const t = useTranslations(
        "Settings.Account.EmailAddresses.CreateEmailAddress",
    );
    const resolver = useZodResolver<z.infer<typeof formSchema>>(formSchema);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver,
        defaultValues: {
            emailAddress: "",
        },
    });

    const createEmailAddress = useReverification(
        (emailAddress: string) =>
            user?.createEmailAddress({
                email: emailAddress,
            }),
        {
            onNeedsReverification: ({ complete, cancel, level }) => {
                setReverificationHandlers({ complete, cancel, level });
                setNestedDialog("reverification");
            },
        },
    );

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const result = await createEmailAddress(values.emailAddress);

            if (result) {
                await user?.reload();

                const newEmailAddress = user?.emailAddresses.find(
                    (ea) => ea.id === result.id,
                );

                if (newEmailAddress) {
                    setEmailResource(newEmailAddress);
                    await newEmailAddress.prepareVerification({
                        strategy: "email_code",
                    });
                    setNestedDialog("verification");
                }
            }
        } catch (error) {
            console.error("Error creating email address:", error);
        }
    };

    const handleReverificationComplete = () => {
        reverificationHandlers?.complete();
        setNestedDialog(null);
        setReverificationHandlers(null);
    };

    const handleReverificationCancel = () => {
        reverificationHandlers?.cancel();
        setNestedDialog(null);
        setReverificationHandlers(null);
    };

    const handleVerificationComplete = () => {
        setNestedDialog(null);
        setEmailResource(null);
        setIsDialogOpen(false);
        form.reset();
    };

    const handleVerificationCancel = () => {
        setNestedDialog(null);
        setEmailResource(null);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setNestedDialog(null);
            setEmailResource(null);
            setReverificationHandlers(null);
            form.reset();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>{t("Description")}</DialogDescription>
                </DialogHeader>

                <form
                    id="create-email-address-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FieldSet>
                        <Controller
                            control={form.control}
                            name="emailAddress"
                            render={({ field, fieldState }) => (
                                <FormField
                                    label={t("Form.EmailAddress")}
                                    isInvalid={fieldState.invalid}
                                    error={fieldState.error}
                                >
                                    <Input
                                        aria-invalid={fieldState.invalid}
                                        placeholder={t("Form.EmailAddress")}
                                        {...field}
                                    />
                                </FormField>
                            )}
                        />
                    </FieldSet>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">{t("Cancel")}</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form="create-email-address-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {t("Confirm")}
                    </Button>
                </DialogFooter>

                <ReverificationDialog
                    open={nestedDialog === "reverification"}
                    onComplete={handleReverificationComplete}
                    onCancel={handleReverificationCancel}
                    level={reverificationHandlers?.level}
                />

                {emailResource && (
                    <VerifyEmailDialog
                        open={nestedDialog === "verification"}
                        onComplete={handleVerificationComplete}
                        onCancel={handleVerificationCancel}
                        emailResource={emailResource}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
