"use client";

import { CheckCircleIcon, EyeIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import type { Habit } from "@/db/schema";
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { DeleteHabit } from "./components/DeleteHabit";
import { HabitDetails } from "./components/HabitDetails";

export type HabitsProps = {
    showMarkAsDone?: boolean;
    showDelete?: boolean;
    habits: Array<Habit>;
} & React.ComponentProps<typeof ItemGroup>;

export function Habits({
    habits,
    showMarkAsDone = false,
    showDelete = false,
    className,
    ...props
}: HabitsProps) {
    const t = useTranslations("Habits");
    const getKey = useScheduleTranslation();

    return (
        <ItemGroup className={cn("gap-2 rounded-2xl", className)} {...props}>
            {habits.map((habit) => {
                const schedule = rRuleToSchedule(habit.rrule);

                return (
                    <Item
                        key={habit.id}
                        className="bg-muted/50 border border-border/50 shadow-xs"
                    >
                        <ItemContent>
                            <ItemTitle>{habit.name}</ItemTitle>
                            {schedule && (
                                <ItemDescription>
                                    {(() => {
                                        const { key, params } =
                                            getKey(schedule);
                                        return t(
                                            // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                                            `Schedule.${key}` as any,
                                            // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                                            params as any,
                                        );
                                    })()}
                                </ItemDescription>
                            )}
                        </ItemContent>
                        <ItemActions className="w-full">
                            {showMarkAsDone && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <CheckCircleIcon className="text-success" />{" "}
                                    Mark as done
                                </Button>
                            )}

                            <HabitDetails
                                id={habit.id}
                                name={habit.name}
                                description={habit.description}
                                rrule={habit.rrule}
                            >
                                <Button size="sm" variant="outline">
                                    <EyeIcon /> View details
                                </Button>
                            </HabitDetails>

                            {showDelete && (
                                <DeleteHabit id={habit.id}>
                                    <Button size="sm" variant="destructive">
                                        <TrashIcon /> Delete
                                    </Button>
                                </DeleteHabit>
                            )}
                        </ItemActions>
                    </Item>
                );
            })}
        </ItemGroup>
    );
}
