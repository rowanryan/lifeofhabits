"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { parseNumberOrNull } from "@/lib/utils";
import { updateSpendLimit } from "../actions";

export type UpdateLimitProps = {
    spendLimit: number | null;
};

const formSchema = z.object({
    spendLimit: z.number().min(0).max(1_000_000).nullable(),
});

export function UpdateLimit({
    spendLimit,
    children,
}: React.PropsWithChildren<UpdateLimitProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const t = useTranslations(
        "Settings.Billing.Subscription.SpendLimit.Update",
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            spendLimit: spendLimit ?? undefined,
        },
    });

    const updateSpendLimitAction = useAction(updateSpendLimit, {
        onSuccess() {
            toast.success(t("Toast.Success"));
            router.refresh();
            setIsOpen(false);
        },
        onError() {
            toast.error(t("Toast.Error"));
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>{t("Description")}</DialogDescription>
                </DialogHeader>

                <form
                    id="update-limit-form"
                    onSubmit={form.handleSubmit(updateSpendLimitAction.execute)}
                >
                    <FieldSet>
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="spendLimit"
                                render={({ field, fieldState }) => (
                                    <FormField
                                        label={t("Form.SpendLimit")}
                                        isInvalid={fieldState.invalid}
                                        error={fieldState.error}
                                    >
                                        <Input
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="0"
                                            min={0}
                                            max={1_000_000}
                                            step={0.01}
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseNumberOrNull(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </FormField>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            disabled={updateSpendLimitAction.isExecuting}
                            variant="secondary"
                        >
                            {t("Cancel")}
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={updateSpendLimitAction.isExecuting}
                        type="submit"
                        form="update-limit-form"
                    >
                        {updateSpendLimitAction.isExecuting && <Spinner />}
                        {t("Confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
