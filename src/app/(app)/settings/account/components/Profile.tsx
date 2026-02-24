"use client";

import { useUser } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullName, getInitials } from "@/lib/utils";

export function Profile() {
    const { user } = useUser();
    const t = useTranslations("Settings.Account.Profile");

    const onSelectImage = useCallback(
        async (file: File) => {
            if (user) {
                toast.promise(user.setProfileImage({ file }), {
                    loading: t("Toast.Updating"),
                    success: t("Toast.Success"),
                    error: t("Toast.Error"),
                });
            }
        },
        [user, t],
    );

    if (!user) return <Skeleton className="h-12 rounded-lg" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription className="text-pretty">
                    {t("Description")}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Avatar className="size-12 @xl/card:size-16 rounded-full">
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
                </div>
            </CardContent>
        </Card>
    );
}
