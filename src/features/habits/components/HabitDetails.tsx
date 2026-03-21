"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { Completion } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { CompleteButton } from "./CompleteButton";
import { CompletionCounterButton } from "./CompletionCounterButton";
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
                    {dateString && (
                        requiredCompletions === 1 ? (
                            <CompleteButton
                                variant="secondary"
                                habitId={id}
                                dateString={dateString}
                                completions={completions}
                                allowUndo
                            />
                        ) : (
                            <CompletionCounterButton
                                className="w-full"
                                habitId={id}
                                dateString={dateString}
                                completions={completions}
                                requiredCompletions={requiredCompletions}
                            />
                        )
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
