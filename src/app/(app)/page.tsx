"use client";

import { addDays, isAfter, subDays } from "date-fns";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    PlusIcon,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
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
import { useRelativeDate } from "@/hooks/use-relative-date";
import { useLogStore } from "@/stores/useLogStore";

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

            <Empty>
                <EmptyMedia variant="icon">
                    <CalendarDaysIcon className="size-5" />
                </EmptyMedia>

                <EmptyHeader>
                    <EmptyTitle>
                        No events {isInTheFuture ? "planned" : "logged"}
                    </EmptyTitle>
                    <EmptyDescription>
                        You haven&apos;t {isInTheFuture ? "planned" : "logged"}{" "}
                        any events yet. Get started by{" "}
                        {isInTheFuture ? "planning" : "logging"} something.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Button>
                        <PlusIcon /> Add event
                    </Button>
                </EmptyContent>
            </Empty>
        </PageLayout>
    );
}
