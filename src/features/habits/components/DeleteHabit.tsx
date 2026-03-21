"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/db";

export type DeleteHabitProps = {
    id: string;
    children: React.ReactNode;
} & React.ComponentProps<typeof AlertDialog>;

export function DeleteHabit({ id, children, ...props }: DeleteHabitProps) {
    const t = useTranslations("Habits.Details.Delete");

    const onDelete = useCallback(() => {
        const habit = db.tx.habits[id];

        if (habit) {
            db.transact(habit.delete());
        }
    }, [id]);

    return (
        <AlertDialog {...props}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("Description")}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onDelete}>
                            {t("Confirm")}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
