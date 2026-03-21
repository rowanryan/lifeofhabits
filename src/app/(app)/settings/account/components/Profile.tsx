"use client";

import { useUser } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormField } from "@/components/FormField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useZodResolver } from "@/hooks/use-zod-error-map";
import { getFullName, getInitials } from "@/lib/utils";

const formSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
});

export function Profile() {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.Profile");
    const [isLoading, setIsLoading] = useState(false);
    const resolver = useZodResolver<z.infer<typeof formSchema>>(formSchema);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver,
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const onSelectImage = useCallback(
        async (file: File) => {
            if (user) {
                toast.promise(user.setProfileImage({ file }), {
                    loading: t("Picture.Toast.Loading"),
                    success: t("Picture.Toast.Success"),
                    error: t("Picture.Toast.Error"),
                });
            }
        },
        [user, t],
    );

    const onSaveName = useCallback(
        async (data: z.infer<typeof formSchema>) => {
            if (user) {
                setIsLoading(true);
                toast.promise(
                    user.update({
                        firstName: data.firstName,
                        lastName: data.lastName,
                    }),
                    {
                        loading: t("Form.Toast.Loading"),
                        success: () => {
                            setIsLoading(false);
                            return t("Form.Toast.Success");
                        },
                        error: () => {
                            setIsLoading(false);
                            return t("Form.Toast.Error");
                        },
                    },
                );
            }
        },
        [user, t],
    );

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
            });
        }
    }, [user, form.reset]);

    if (!user) return <Skeleton className="h-64 rounded-lg" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription className="text-pretty">
                    {t("Description")}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-nowrap items-center gap-3">
                    <div className="relative group">
                        <Avatar className="size-14 @xl/card:size-16 rounded-full">
                            <AvatarImage
                                src={user.imageUrl}
                                alt={
                                    getFullName(
                                        user.firstName,
                                        user.lastName,
                                    ) ?? "Unknown"
                                }
                            />
                            <AvatarFallback className="rounded-lg">
                                {getInitials(user.firstName, user.lastName) ??
                                    "?"}
                            </AvatarFallback>
                        </Avatar>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    onSelectImage(file);
                                }
                            }}
                            className="absolute cursor-pointer top-0 left-0 z-10 size-full rounded-full opacity-0"
                        />
                        <div className="absolute top-0 left-0 size-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 flex items-center justify-center pointer-events-none">
                            <PencilIcon className="size-4 text-white" />
                        </div>
                    </div>

                    <div>
                        <p className="font-medium">{t("Picture.Title")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("Picture.Description")}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                <form
                    id="profile-form"
                    onSubmit={form.handleSubmit(onSaveName)}
                >
                    <FieldSet>
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="firstName"
                                render={({ field, fieldState }) => (
                                    <FormField
                                        label={t("Form.FirstName")}
                                        isInvalid={fieldState.invalid}
                                        error={fieldState.error}
                                    >
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder={t("Form.FirstName")}
                                            {...field}
                                        />
                                    </FormField>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="lastName"
                                render={({ field, fieldState }) => (
                                    <FormField
                                        label={t("Form.LastName")}
                                        isInvalid={fieldState.invalid}
                                        error={fieldState.error}
                                    >
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder={t("Form.LastName")}
                                            {...field}
                                        />
                                    </FormField>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>
                </form>
            </CardContent>

            <CardFooter>
                <Button
                    type="submit"
                    form="profile-form"
                    disabled={!form.formState.isDirty || isLoading}
                >
                    {isLoading && <Spinner />} {t("Form.SaveButton")}
                </Button>
            </CardFooter>
        </Card>
    );
}
