"use client";

import { useTranslations } from "next-intl";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import { rRuleToSchedule, type Schedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export type HabitGroupProps = {
    label?: string;
    habits: Array<{
        id: string;
        name: string;
        description: string | null;
        rrule: string;
    }>;
} & React.ComponentProps<typeof ItemGroup>;

function getScheduleTranslationKey(
    schedule: Schedule,
    t: ReturnType<typeof useTranslations<"Habits.Schedule">>,
): {
    key: string;
    params?: Record<string, unknown>;
} {
    if (schedule.interval === "minute") {
        return {
            key: "Every.minute",
            params: { count: schedule.count },
        };
    }

    if (schedule.interval === "hour") {
        return {
            key: "Every.hour",
            params: {
                count: schedule.count,
                startTime: schedule.startTime,
            },
        };
    }

    if (schedule.interval === "day") {
        return {
            key: "Every.day",
            params: {
                count: schedule.count,
                // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                startDay: t(`StartDay.${schedule.startDay}` as any),
            },
        };
    }

    if (schedule.interval === "month") {
        return {
            key: "Every.month",
            params: {
                count: schedule.count,
                // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                startMonth: t(`StartMonth.${schedule.startMonth}` as any),
            },
        };
    }

    if (schedule.interval === "weekday") {
        return { key: `Weekday.${schedule.day}` };
    }

    if (schedule.interval === "year") {
        return { key: `Yearly.${schedule.month}` };
    }

    return { key: "Every.minute", params: { count: 1 } };
}

export function HabitGroup({
    label,
    habits,
    className,
    ...props
}: HabitGroupProps) {
    const t = useTranslations("Habits.Schedule");

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
                                            getScheduleTranslationKey(
                                                schedule,
                                                t,
                                            );
                                        // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                                        return t(key as any, params as any);
                                    })()}
                                </ItemDescription>
                            )}
                        </ItemContent>
                    </Item>
                );
            })}
        </ItemGroup>
    );
}
