"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, format, isAfter, subDays } from "date-fns";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    PlusIcon,
} from "lucide-react";
import { useMemo } from "react";
import { DataLoader } from "@/components/DataLoader";
import { PageLayout } from "@/components/PageLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useRelativeDate } from "@/hooks/use-relative-date";
import { getPartOfDay } from "@/lib/date";
import { useLogStore } from "@/stores/useLogStore";
import { getEvents } from "./actions";
import { EventGroup } from "./components/EventGroup";

export default function Page() {
    const formatRelativeDate = useRelativeDate();
    const currentDate = useLogStore((state) => state.currentDate);
    const setCurrentDate = useLogStore((state) => state.setCurrentDate);
    const isInTheFuture = isAfter(currentDate, new Date());
    const currentYear = currentDate.getFullYear();
    const previousDate = subDays(currentDate, 1);
    const nextDate = addDays(currentDate, 1);
    const previousDateLabel = formatRelativeDate(previousDate, {
        day: "numeric",
        month: "long",
    });
    const nextDateLabel = formatRelativeDate(nextDate, {
        day: "numeric",
        month: "long",
    });

    const dateString = format(currentDate, "yyyy-MM-dd");

    const {
        data: events,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["events", { dateString }],
        queryFn: async () => (await getEvents({ dateString })).data,
    });

    const groups = useMemo(() => {
        if (!events) return null;
        if (events.length === 0) return null;

        return {
            morning: events.filter(
                (e) => getPartOfDay(e.startTime) === "morning",
            ),
            afternoon: events.filter(
                (e) => getPartOfDay(e.startTime) === "afternoon",
            ),
            evening: events.filter(
                (e) => getPartOfDay(e.startTime) === "evening",
            ),
            night: events.filter((e) => getPartOfDay(e.startTime) === "night"),
            anytime: events.filter((e) => getPartOfDay(e.startTime) === null),
        };
    }, [events]);

    return (
        <PageLayout
            prefix={currentYear.toString()}
            title={formatRelativeDate(currentDate, {
                day: "numeric",
                month: "long",
            })}
        >
            <ButtonGroup className="flex mb-4 flex-wrap gap-2 items-center">
                <ButtonGroup>
                    <Button size="sm">
                        <PlusIcon /> Add event
                    </Button>
                </ButtonGroup>

                <ButtonGroup>
                    <Button size="sm" variant="secondary">
                        <CalendarDaysIcon /> Calendar
                    </Button>
                </ButtonGroup>

                <ButtonGroup>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(previousDate)}
                    >
                        <ArrowLeftIcon /> {previousDateLabel}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(nextDate)}
                    >
                        {nextDateLabel} <ArrowRightIcon />
                    </Button>
                </ButtonGroup>
            </ButtonGroup>

            <DataLoader
                data={groups}
                isLoading={isLoading}
                error={error}
                loader={
                    <div className="flex items-center justify-center py-6">
                        <Spinner />
                    </div>
                }
                renderError={() => (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Oops!</AlertTitle>
                        <AlertDescription>
                            Your events could not be loaded. Please try again by
                            refreshing the page.
                        </AlertDescription>
                    </Alert>
                )}
            >
                {(data) =>
                    !data ? (
                        <Empty>
                            <EmptyMedia variant="icon">
                                <CalendarDaysIcon className="size-5" />
                            </EmptyMedia>

                            <EmptyHeader>
                                <EmptyTitle>
                                    No events{" "}
                                    {isInTheFuture ? "planned" : "logged"}
                                </EmptyTitle>
                                <EmptyDescription>
                                    You haven&apos;t{" "}
                                    {isInTheFuture ? "planned" : "logged"} any
                                    events yet. Get started by{" "}
                                    {isInTheFuture ? "planning" : "logging"}{" "}
                                    something.
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <Button>
                                    <PlusIcon /> Add event
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <div className="space-y-4">
                            {data.morning.length > 0 && (
                                <EventGroup
                                    label="Morning"
                                    events={data.morning}
                                />
                            )}

                            {data.afternoon.length > 0 && (
                                <EventGroup
                                    label="Afternoon"
                                    events={data.afternoon}
                                />
                            )}

                            {data.evening.length > 0 && (
                                <EventGroup
                                    label="Evening"
                                    events={data.evening}
                                />
                            )}

                            {data.night.length > 0 && (
                                <EventGroup label="Night" events={data.night} />
                            )}

                            {data.anytime.length > 0 && (
                                <EventGroup
                                    label="Anytime"
                                    events={data.anytime}
                                />
                            )}
                        </div>
                    )
                }
            </DataLoader>
        </PageLayout>
    );
}
