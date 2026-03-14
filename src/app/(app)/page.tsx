"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    PlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DataLoader } from "@/components/DataLoader";
import { PageLayout } from "@/components/PageLayout";
import { PageSection } from "@/components/PageSection";
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
import { useLogStore } from "@/stores/useLogStore";
import { getHabits } from "./actions";
import { Calendar } from "./components/Calendar";
import { HabitGroup } from "./components/HabitGroup";

export default function Page() {
    const t = useTranslations("Habits");

    const formatRelativeDate = useRelativeDate();
    const currentDate = useLogStore((state) => state.currentDate);
    const setCurrentDate = useLogStore((state) => state.setCurrentDate);

    const currentYear = currentDate.getFullYear();
    const previousDate = subDays(currentDate, 1);
    const nextDate = addDays(currentDate, 1);
    const dateString = format(currentDate, "yyyy-MM-dd");

    const previousDateLabel = formatRelativeDate(previousDate, {
        day: "numeric",
        month: "long",
    });

    const nextDateLabel = formatRelativeDate(nextDate, {
        day: "numeric",
        month: "long",
    });

    const {
        data: habits,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["habits", { date: dateString }],
        queryFn: async () => (await getHabits({ date: dateString })).data,
    });

    return (
        <PageLayout
            prefix={currentYear.toString()}
            title={formatRelativeDate(currentDate, {
                day: "numeric",
                month: "long",
            })}
        >
            <ButtonGroup className="flex mb-8 flex-wrap items-center">
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
                                <EmptyTitle>{t("Empty.Title")}</EmptyTitle>
                                <EmptyDescription>
                                    {t("Empty.Description")}
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <Button>
                                    <PlusIcon /> {t("Actions.Add")}
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <div className="space-y-8">
                            <PageSection title="To do">
                                <HabitGroup habits={data} />
                            </PageSection>

                            <PageSection title="Completed">
                                <HabitGroup habits={data} />
                            </PageSection>
                        </div>
                    )
                }
            </DataLoader>
        </PageLayout>
    );
}
