"use client";

import { CheckCircleIcon, EyeIcon } from "lucide-react";
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
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { HabitDetails } from "./HabitDetails";

export type HabitGroupProps = {
    label?: string;
    habits: Array<{
        id: string;
        name: string;
        description: string | null;
        rrule: string;
    }>;
} & React.ComponentProps<typeof ItemGroup>;

export function HabitGroup({
    label,
    habits,
    className,
    ...props
}: HabitGroupProps) {
    const t = useTranslations("Habits.Schedule");
    const getKey = useScheduleTranslation();

    return (
        <ItemGroup className={cn("gap-2 rounded-2xl", className)} {...props}>
            {habits.map((habit) => {
                const schedule = rRuleToSchedule(habit.rrule);

                return (
                    <Item key={habit.id} className="bg-muted/70">
                        <ItemContent>
                            <ItemTitle>{habit.name}</ItemTitle>
                            {schedule && (
                                <ItemDescription>
                                    {(() => {
                                        const { key, params } =
                                            getKey(schedule);
                                        // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                                        return t(key as any, params as any);
                                    })()}
                                </ItemDescription>
                            )}
                        </ItemContent>
                        <ItemActions className="w-full">
                            <Button
                                size="xs"
                                variant="outline"
                                className="gap-2"
                            >
                                <CheckCircleIcon className="text-success" />{" "}
                                Mark as done
                            </Button>

                            <HabitDetails
                                id={habit.id}
                                name={habit.name}
                                description={habit.description}
                                rrule={habit.rrule}
                            >
                                <Button size="xs" variant="outline">
                                    <EyeIcon /> View details
                                </Button>
                            </HabitDetails>
                        </ItemActions>
                    </Item>
                );
            })}
        </ItemGroup>
    );
}
