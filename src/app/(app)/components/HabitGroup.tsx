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
import { rRuleToSchedule } from "@/lib/schedule";

export type HabitGroupProps = {
    label?: string;
    habits: Array<{
        id: string;
        name: string;
        description: string | null;
        rrule: string;
    }>;
};

export function HabitGroup({ label, habits }: HabitGroupProps) {
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
                                            Every {schedule.intervalCount}{" "}
                                            {schedule.interval}
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
