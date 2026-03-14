"use client";

import { useFormatter } from "next-intl";
import { Fragment } from "react";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import type { eventScheduleTypeEnum, eventTypeEnum } from "@/server/db/schema";

export type EventGroupProps = {
    label: string;
    events: Array<{
        id: string;
        type: (typeof eventTypeEnum.enumValues)[number];
        scheduleType: (typeof eventScheduleTypeEnum.enumValues)[number];
        name: string;
        description: string | null;
        startDate: string;
        startTime: string | null;
        rrule: string | null;
    }>;
};

export function EventGroup({ label, events }: EventGroupProps) {
    const format = useFormatter();

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <ItemGroup className="gap-0 rounded-2xl bg-muted/70">
                {events.map((event, idx) => (
                    <Fragment key={event.id}>
                        <Item>
                            <ItemContent>
                                <ItemTitle className="gap-0">
                                    {event.name}
                                    {event.startTime && (
                                        <span className="text-muted-foreground text-xs">
                                            &nbsp;&bull;&nbsp;
                                            {format.dateTime(
                                                new Date(
                                                    `${event.startDate}T${event.startTime}`,
                                                ),
                                                {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </span>
                                    )}
                                </ItemTitle>
                                {event.description && (
                                    <ItemDescription>
                                        {event.description}
                                    </ItemDescription>
                                )}
                            </ItemContent>
                        </Item>

                        {idx !== events.length - 1 && (
                            <ItemSeparator className="my-0" />
                        )}
                    </Fragment>
                ))}
            </ItemGroup>
        </div>
    );
}
