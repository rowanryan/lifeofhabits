"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { deleteHabit } from "../actions";
import { DeleteHabit } from "./DeleteHabit";
import { UpdateHabit } from "./UpdateHabit";

export type HabitDetailsProps = React.PropsWithChildren<{
    id: string;
    name: string;
    description: string | null;
    rrule: string;
}> &
    React.ComponentProps<typeof Drawer>;

export function HabitDetails({
    id,
    name,
    description,
    rrule,
    children,
    ...props
}: HabitDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Habits");
    const getKey = useScheduleTranslation();
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();

    const schedule = useMemo(() => rRuleToSchedule(rrule), [rrule]);
    const key = useMemo(
        () => (schedule ? getKey(schedule) : null),
        [getKey, schedule],
    );

    const deleteAction = useAction(deleteHabit, {
        onExecute() {
            setIsOpen(false);

            toast.loading(t("Details.Delete.Toast.Loading"), {
                id: "delete-habit-toast",
            });
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ["habits"] });

            toast.success(t("Details.Delete.Toast.Success"), {
                id: "delete-habit-toast",
            });

            deleteAction.reset();
        },
        onError() {
            toast.error(t("Details.Delete.Toast.Error"), {
                id: "delete-habit-toast",
            });
        },
    });

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction={isMobile ? "bottom" : "right"}
            {...props}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className={cn(isMobile && "h-full")}>
                <DrawerHeader>
                    <DrawerTitle>{name}</DrawerTitle>
                    {key && (
                        <DrawerDescription>
                            {/* biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type */}
                            {t(`Schedule.${key.key}` as any, key.params as any)}
                        </DrawerDescription>
                    )}
                </DrawerHeader>

                <div className={cn("overflow-y-auto px-4", isMobile && "px-6")}>
                    <p
                        className={cn(
                            "text-sm text-muted-foreground whitespace-pre-line",
                            !description && "italic",
                        )}
                    >
                        {description ?? t("Details.NoDescription")}
                    </p>
                </div>

                <DrawerFooter>
                    <Button variant="secondary">
                        <CheckCircleIcon className="text-success" />{" "}
                        {t("Details.MarkAsDone.ButtonLabel")}
                    </Button>

                    <UpdateHabit
                        id={id}
                        name={name}
                        description={description}
                        rrule={rrule}
                    >
                        <Button variant="secondary">
                            <PencilIcon /> {t("Details.Edit.ButtonLabel")}
                        </Button>
                    </UpdateHabit>

                    <DeleteHabit
                        id={id}
                        onDelete={() => deleteAction.execute({ id })}
                    >
                        <Button
                            disabled={deleteAction.isExecuting}
                            variant="destructive"
                        >
                            {deleteAction.isExecuting ? (
                                <Spinner />
                            ) : (
                                <TrashIcon />
                            )}{" "}
                            {t("Details.Delete.ButtonLabel")}
                        </Button>
                    </DeleteHabit>

                    <DrawerClose asChild>
                        <Button variant="secondary">
                            {t("Details.Close")}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
