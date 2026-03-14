"use client";

import { Fragment } from "react";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { rRuleToSchedule, type Schedule } from "@/lib/schedule";
import { useTranslations } from "next-intl";

export type HabitGroupProps = {
    label?: string;
    habits: Array<{
        id: string;
        name: string;
        description: string | null;
        rrule: string;
    }>;
};

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

export function HabitGroup({ label, habits }: HabitGroupProps) {
    const t = useTranslations("Habits.Schedule");

    return (
        <div className="space-y-2">
            {label && (
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
            )}

            <ItemGroup className="gap-0 rounded-2xl bg-muted/70">
                {habits.map((habit, idx) => {
                    const schedule = rRuleToSchedule(habit.rrule);

                    return (
                        <Fragment key={habit.id}>
                            <Item>
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

                            {idx !== habits.length - 1 && (
                                <ItemSeparator className="my-0 bg-background" />
                            )}
                        </Fragment>
                    );
                })}
            </ItemGroup>
        </div>
    );
}
