"use client";

import { addDays, format, subDays } from "date-fns";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    CalendarSyncIcon,
    PlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { rrulestr } from "rrule";
import { DataLoader } from "@/components/DataLoader";
import { PageLayout } from "@/components/PageLayout";
import { PageSection } from "@/components/PageSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db";
import { Habits } from "@/features/habits";
import { CreateHabit } from "@/features/habits/components/CreateHabit";
import { useRelativeDate } from "@/hooks/use-relative-date";
import { useLogStore } from "@/stores/useLogStore";
import { Calendar } from "./components/Calendar";

export default function Page() {
    const t = useTranslations();

    const formatRelativeDate = useRelativeDate();
    const currentDate = useLogStore((state) => state.currentDate);
    const setCurrentDate = useLogStore((state) => state.setCurrentDate);

    const currentYear = currentDate.getFullYear();
    const previousDate = subDays(currentDate, 1);
    const nextDate = addDays(currentDate, 1);
    const dateString = format(currentDate, "yyyy-MM-dd");

    const { data, isLoading, error } = db.useQuery({
        habits: {
            completions: {
                $: { where: { dateString } },
            },
        },
    });

    type HabitWithCompletions = NonNullable<typeof data>["habits"][number];

    const habits = useMemo(() => {
        if (data) {
            const targetDate = new Date(dateString);
            const start = new Date(
                Date.UTC(
                    targetDate.getFullYear(),
                    targetDate.getMonth(),
                    targetDate.getDate(),
                    0,
                    0,
                    0,
                    0,
                ),
            );
            const end = new Date(
                Date.UTC(
                    targetDate.getFullYear(),
                    targetDate.getMonth(),
                    targetDate.getDate(),
                    23,
                    59,
                    59,
                    999,
                ),
            );

            const filteredHabits: HabitWithCompletions[] = [];
            for (const habit of data.habits) {
                try {
                    const rule = rrulestr(habit.rrule);
                    const occurrences = rule.between(start, end, true);

                    if (occurrences.length > 0) {
                        filteredHabits.push(habit);
                    }
                } catch {
                    // Skip habits with invalid rrule
                }
            }

            return filteredHabits;
        }
    }, [data, dateString]);

    return (
        <PageLayout
            prefix={currentYear.toString()}
            title={formatRelativeDate(currentDate, {
                day: "numeric",
                month: "long",
                weekday: "long",
            })}
        >
            <ButtonGroup className="flex mb-4 flex-wrap items-center">
                <ButtonGroup>
                    <CreateHabit>
                        <Button size="sm">
                            <PlusIcon /> {t("Habits.Actions.Add")}
                        </Button>
                    </CreateHabit>
                </ButtonGroup>

                <ButtonGroup>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(previousDate)}
                        className="min-w-12"
                    >
                        <ArrowLeftIcon />
                    </Button>

                    <Calendar>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="min-w-32"
                        >
                            <CalendarDaysIcon />{" "}
                            {formatRelativeDate(currentDate, {
                                day: "numeric",
                                month: "long",
                            })}
                        </Button>
                    </Calendar>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentDate(nextDate)}
                        className="min-w-12"
                    >
                        <ArrowRightIcon />
                    </Button>
                </ButtonGroup>
            </ButtonGroup>

            <DataLoader
                data={habits}
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
                        <AlertTitle>{t("Habits.Error.Title")}</AlertTitle>
                        <AlertDescription>
                            {t("Habits.Error.Description")}
                        </AlertDescription>
                    </Alert>
                )}
            >
                {(data) => (
                    <PageSection>
                        {data.length > 0 ? (
                            <Habits
                                showMarkAsDone
                                habits={data}
                                dateString={dateString}
                            />
                        ) : (
                            <Empty>
                                <EmptyMedia variant="icon">
                                    <CalendarSyncIcon className="size-5" />
                                </EmptyMedia>

                                <EmptyHeader>
                                    <EmptyTitle>
                                        {t("Habits.Empty.Title")}
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        {t("Habits.Empty.Description.Log")}
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </PageSection>
                )}
            </DataLoader>
        </PageLayout>
    );
}
