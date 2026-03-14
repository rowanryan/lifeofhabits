import { CheckCircleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useScheduleTranslation } from "@/hooks/use-schedule-translation";
import { rRuleToSchedule } from "@/lib/schedule";
import { cn } from "@/lib/utils";

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
    const t = useTranslations("Habits.Schedule");
    const getKey = useScheduleTranslation();
    const isMobile = useIsMobile();

    const schedule = useMemo(() => rRuleToSchedule(rrule), [rrule]);
    const key = useMemo(
        () => (schedule ? getKey(schedule) : null),
        [getKey, schedule],
    );

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
                            {t(key.key as any, key.params as any)}
                        </DrawerDescription>
                    )}
                </DrawerHeader>

                <div className={cn("px-4", isMobile && "px-6")}>
                    <p
                        className={cn(
                            "text-sm text-muted-foreground",
                            !description && "italic",
                        )}
                    >
                        {description ?? "No description"}
                    </p>
                </div>

                <DrawerFooter>
                    <Button variant="secondary">
                        <CheckCircleIcon className="text-success" /> Mark as
                        done
                    </Button>
                    <Button variant="secondary">
                        <PencilIcon /> Edit
                    </Button>
                    <Button variant="destructive">
                        <TrashIcon /> Delete
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
