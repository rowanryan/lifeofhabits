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

export type EventGroupProps = {
    label: string;
    events: Array<{
        id: string;
        name: string;
        description: string | null;
    }>;
};

export function EventGroup({ label, events }: EventGroupProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <ItemGroup className="gap-0 rounded-2xl bg-muted/70">
                {events.map((event, idx) => (
                    <Fragment key={event.id}>
                        <Item>
                            <ItemContent>
                                <ItemTitle>{event.name}</ItemTitle>
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
