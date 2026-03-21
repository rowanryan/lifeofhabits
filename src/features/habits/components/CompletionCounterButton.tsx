"use client";

import { id as createId } from "@instantdb/react";
import { CheckCircleIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { db } from "@/db";
import type { Completion } from "@/db/schema";

export type CompletionCounterButtonProps = {
    habitId: string;
    dateString: string;
    completions: Completion[];
    requiredCompletions: number;
} & Omit<React.ComponentProps<typeof ButtonGroup>, "children">;

export function CompletionCounterButton({
    habitId,
    dateString,
    completions,
    requiredCompletions,
    ...props
}: CompletionCounterButtonProps) {
    const currentCompletions = completions.length;
    const isComplete = currentCompletions >= requiredCompletions;
    const canDecrement = currentCompletions > 0;

    const handleIncrement = () => {
        if (isComplete) return;
        const completion = db.tx.completions[createId()];
        if (completion) {
            db.transact([
                completion
                    .update({ habitId, dateString })
                    .link({ habit: habitId }),
            ]);
        }
    };

    const handleDecrement = () => {
        if (!canDecrement) return;
        const completionToDelete = completions[0];
        if (completionToDelete) {
            const completion = db.tx.completions[completionToDelete.id];
            if (completion) {
                db.transact([completion.delete()]);
            }
        }
    };

    return (
        <ButtonGroup {...props}>
            <Button
                variant="secondary"
                size="icon"
                disabled={!canDecrement}
                onClick={handleDecrement}
            >
                <MinusIcon />
            </Button>
            <ButtonGroupText className="flex-1 justify-center">
                <CheckCircleIcon className="text-success" />
                {currentCompletions} / {requiredCompletions}
            </ButtonGroupText>
            <Button
                variant="secondary"
                size="icon"
                disabled={isComplete}
                onClick={handleIncrement}
            >
                <PlusIcon />
            </Button>
        </ButtonGroup>
    );
}
