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
import { useTranslations } from "next-intl";
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
import { Calendar } from "./components/Calendar";
import { EventGroup } from "./components/EventGroup";

export default function Page() {
    const t = useTranslations("Events");
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
            <ButtonGroup className="flex mb-4 flex-wrap items-center">
                <ButtonGroup>
                    <Button size="sm">
                        <PlusIcon /> {t("Actions.Add")}
                    </Button>
                </ButtonGroup>

                <ButtonGroup>
                    <Calendar>
                        <Button size="sm" variant="secondary">
                            <CalendarDaysIcon />{" "}
                            {t("Actions.Calendar.ButtonLabel")}
                        </Button>
                    </Calendar>
                </ButtonGroup>

                <ButtonGroup>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(previousDate)}
                        className="min-w-32"
                    >
                        <ArrowLeftIcon /> {previousDateLabel}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(nextDate)}
                        className="min-w-32"
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
                        <AlertTitle>{t("Error.Title")}</AlertTitle>
                        <AlertDescription>
                            {t("Error.Description")}
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
                                    {t("Empty.Title", {
                                        plannedOrLogged: isInTheFuture
                                            ? "planned"
                                            : "logged",
                                    })}
                                </EmptyTitle>
                                <EmptyDescription>
                                    {t("Empty.Description", {
                                        plannedOrLogged: isInTheFuture
                                            ? "planned"
                                            : "logged",
                                        planningOrLogging: isInTheFuture
                                            ? "planning"
                                            : "logging",
                                    })}
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <Button>
                                    <PlusIcon /> {t("Actions.Add")}
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <div className="space-y-4 min-h-[200px] bg-red-500">
                            {data.morning.length > 0 && (
                                <EventGroup
                                    label={t("TimeOfDay.Morning")}
                                    events={data.morning}
                                />
                            )}

                            {data.afternoon.length > 0 && (
                                <EventGroup
                                    label={t("TimeOfDay.Afternoon")}
                                    events={data.afternoon}
                                />
                            )}

                            {data.evening.length > 0 && (
                                <EventGroup
                                    label={t("TimeOfDay.Evening")}
                                    events={data.evening}
                                />
                            )}

                            {data.night.length > 0 && (
                                <EventGroup
                                    label={t("TimeOfDay.Night")}
                                    events={data.night}
                                />
                            )}

                            {data.anytime.length > 0 && (
                                <EventGroup
                                    label={t("TimeOfDay.Anytime")}
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
