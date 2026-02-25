"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FormField } from "@/components/FormField";
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

type AddEmailAddressProps = React.PropsWithChildren;

const formSchema = z.object({
    emailAddress: z.email(),
});

export function AddEmailAddress({ children }: AddEmailAddressProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const t = useTranslations(
        "Settings.Account.EmailAddresses.CreateEmailAddress",
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: "",
        },
    });

    const onCreate = useCallback((values: z.infer<typeof formSchema>) => {
        console.log(values);
    }, []);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>{t("Description")}</DialogDescription>
                </DialogHeader>

                <form
                    id="create-email-address-form"
                    onSubmit={form.handleSubmit(onCreate)}
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
                    <Button>{t("Confirm")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
