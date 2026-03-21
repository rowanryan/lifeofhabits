"use client";

import { id as createId } from "@instantdb/react";
import { MinusIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { db } from "@/db";
import type { Completion } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { DeleteHabit } from "./DeleteHabit";
import { UpdateHabit } from "./UpdateHabit";

export type HabitDetailsProps = React.PropsWithChildren<{
    id: string;
    name: string;
    description: string | undefined;
    rrule: string;
    completions?: Completion[];
    requiredCompletions?: number;
    dateString?: string;
}> &
    React.ComponentProps<typeof Drawer>;

export function HabitDetails({
    id,
    name,
    description,
    rrule,
    completions = [],
    requiredCompletions = 1,
    dateString,
    children,
    ...props
}: HabitDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Habits");
    const getKey = useScheduleTranslation();
    const isMobile = useIsMobile();

    const schedule = useMemo(() => rRuleToSchedule(rrule), [rrule]);
    const key = useMemo(
        () => (schedule ? getKey(schedule) : null),
        [getKey, schedule],
    );

    const currentCompletions = completions.length;
    const isComplete = currentCompletions >= requiredCompletions;
    const canDecrement = currentCompletions > 0;

    const handleIncrement = () => {
        if (!dateString || isComplete) return;
        const completion = db.tx.completions[createId()];
        if (completion) {
            db.transact([
                completion
                    .update({ habitId: id, dateString })
                    .link({ habit: id }),
            ]);
        }
    };

    const handleDecrement = () => {
        if (!dateString || !canDecrement) return;
        const completionToDelete = completions[0];
        if (completionToDelete) {
            const completion = db.tx.completions[completionToDelete.id];
            if (completion) {
                db.transact([completion.delete()]);
            }
        }
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction={isMobile ? "bottom" : "right"}
            {...props}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{name}</DrawerTitle>
                    {key && (
                        <DrawerDescription>
                            {/* biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type */}
                            {t(`Schedule.${key.key}` as any, key.params as any)}
                        </DrawerDescription>
                    )}
                </DrawerHeader>

                <div className={cn("overflow-y-auto px-4", isMobile && "px-6")}>
                    <p
                        className={cn(
                            "text-sm text-muted-foreground whitespace-pre-line",
                            !description && "italic",
                        )}
                    >
                        {description ?? t("Details.NoDescription")}
                    </p>
                </div>

                <DrawerFooter>
                    {dateString && (
                        <ButtonGroup className="w-full">
                            <Button
                                variant="secondary"
                                size="icon"
                                disabled={!canDecrement}
                                onClick={handleDecrement}
                            >
                                <MinusIcon />
                            </Button>
                            <ButtonGroupText className="flex-1 justify-center">
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
                    )}

                    <UpdateHabit
                        id={id}
                        name={name}
                        description={description}
                        rrule={rrule}
                    >
                        <Button variant="secondary">
                            <PencilIcon /> {t("Details.Edit.ButtonLabel")}
                        </Button>
                    </UpdateHabit>

                    <DeleteHabit id={id}>
                        <Button variant="destructive">
                            <TrashIcon /> {t("Details.Delete.ButtonLabel")}
                        </Button>
                    </DeleteHabit>

                    <DrawerClose asChild>
                        <Button variant="secondary">
                            {t("Details.Close")}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
