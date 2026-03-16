"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, CalendarSyncIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Habits } from "@/features/habits";
import { getHabits } from "./actions";

export default function Page() {
    const t = useTranslations("Habits");

    const {
        data: habits,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["habits"],
        queryFn: async () => (await getHabits()).data,
    });

    return (
        <PageLayout title={t("Title")} description={t("Description")}>
            <ButtonGroup className="flex mb-4 flex-wrap items-center">
                <Button size="sm">
                    <PlusIcon /> {t("Actions.Add")}
                </Button>
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
                {(data) => (
                    <PageSection>
                        {data.length > 0 ? (
                            <Habits showDelete habits={data} />
                        ) : (
                            <Empty>
                                <EmptyMedia variant="icon">
                                    <CalendarSyncIcon className="size-5" />
                                </EmptyMedia>

                                <EmptyHeader>
                                    <EmptyTitle>{t("Empty.Title")}</EmptyTitle>
                                    <EmptyDescription>
                                        {t("Empty.Description.Page")}
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
