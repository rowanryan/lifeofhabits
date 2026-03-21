"use client";

import { id as createId } from "@instantdb/react";
import { CheckCircleIcon, Undo2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import type { Completion } from "@/db/schema";

export type CompleteButtonProps = {
    habitId: string;
    dateString: string;
    completions: Completion[];
    requiredCompletions?: number;
    allowUndo?: boolean;
    showCounter?: boolean;
} & Omit<React.ComponentProps<typeof Button>, "onClick" | "children">;

export function CompleteButton({
    habitId,
    dateString,
    completions,
    requiredCompletions = 1,
    allowUndo = false,
    showCounter = false,
    ...props
}: CompleteButtonProps) {
    const t = useTranslations("Habits");
    const currentCompletions = completions.length;
    const isComplete = currentCompletions >= requiredCompletions;

    const handleComplete = () => {
        const completion = db.tx.completions[createId()];
        if (completion) {
            db.transact([
                completion
                    .update({ habitId, dateString })
                    .link({ habit: habitId }),
            ]);
        }
    };

    const handleUndo = () => {
        const completionToDelete = completions[0];
        if (completionToDelete) {
            const completion = db.tx.completions[completionToDelete.id];
            if (completion) {
                db.transact([completion.delete()]);
            }
        }
    };

    if (isComplete && allowUndo) {
        return (
            <Button onClick={handleUndo} {...props}>
                <Undo2Icon />
                {t("Details.MarkAsDone.Undo")}
            </Button>
        );
    }

    return (
        <Button
            disabled={isComplete}
            onClick={handleComplete}
            {...props}
        >
            <CheckCircleIcon className="text-success" />
            {showCounter
                ? `${currentCompletions} / ${requiredCompletions}`
                : t("Details.MarkAsDone.ButtonLabel")}
        </Button>
    );
}
