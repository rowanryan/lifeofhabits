"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { match } from "ts-pattern";
import z from "zod";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    NestedDrawer,
} from "@/components/ui/drawer";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    days,
    intervals,
    months,
    rRuleToSchedule,
    type Schedule,
    ScheduleSchema,
    scheduleToRRule,
} from "@/lib/schedule";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(1, { error: "Cannot be empty" }),
    description: z
        .string()
        .nullable()
        .transform((val) => (val === "" ? null : val)),
    schedule: ScheduleSchema,
});

type FormValues = z.input<typeof formSchema>;

const defaultScheduleValues: Record<Schedule["interval"], Schedule> = {
    day: { interval: "day" },
    weekday: { interval: "weekday", day: "monday" },
    month: { interval: "month" },
    year: { interval: "year", month: "january" },
};

export type UpdateHabitProps = React.PropsWithChildren<{
    id: string;
    name: string;
    description: string | undefined;
    rrule: string;
}> &
    React.ComponentProps<typeof NestedDrawer>;

export function UpdateHabit({
    id,
    name,
    description,
    rrule,
    children,
    ...props
}: UpdateHabitProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Habits.Edit");
    const tForm = useTranslations("Habits.Create.Form");
    const isMobile = useIsMobile();

    const initialSchedule = useMemo(
        () => rRuleToSchedule(rrule) ?? defaultScheduleValues.weekday,
        [rrule],
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name,
            description,
            schedule: initialSchedule,
        },
    });

    const interval = form.watch("schedule.interval");

    useEffect(() => {
        if (interval !== initialSchedule.interval) {
            form.setValue("schedule", defaultScheduleValues[interval]);
        }
    }, [interval, initialSchedule.interval, form]);

    const onSubmit = useCallback(
        (data: FormValues) => {
            const habit = db.tx.habits[id];

            if (habit) {
                const rrule = scheduleToRRule(data.schedule);

                db.transact(
                    habit.update({
                        rrule,
                        name: data.name,
                        description: data.description,
                    }),
                );

                setIsOpen(false);
            }
        },
        [id],
    );

    return (
        <NestedDrawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction={isMobile ? "bottom" : "right"}
            {...props}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className={cn(isMobile && "max-w-lg!")}>
                <DrawerHeader>
                    <DrawerTitle>{t("Title")}</DrawerTitle>
                    <DrawerDescription>{t("Description")}</DrawerDescription>
                </DrawerHeader>

                <div className={cn("overflow-y-auto px-4", isMobile && "px-6")}>
                    <form
                        id="update-habit-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldSet>
                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <FormField
                                            label={tForm("Name")}
                                            isInvalid={fieldState.invalid}
                                            error={fieldState.error}
                                        >
                                            <Input
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={tForm(
                                                    "NamePlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormField>
                                    )}
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="description"
                                    render={({ field, fieldState }) => (
                                        <FormField
                                            label={tForm("Description")}
                                            isInvalid={fieldState.invalid}
                                            error={fieldState.error}
                                        >
                                            <Textarea
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={tForm(
                                                    "DescriptionPlaceholder",
                                                )}
                                                className="min-h-32"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormField>
                                    )}
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="schedule.interval"
                                    render={({ field, fieldState }) => (
                                        <FormField
                                            label={tForm("Interval")}
                                            isInvalid={fieldState.invalid}
                                            error={fieldState.error}
                                        >
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    className="w-full"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {intervals.map(
                                                        (intervalOption) => (
                                                            <SelectItem
                                                                key={
                                                                    intervalOption
                                                                }
                                                                value={
                                                                    intervalOption
                                                                }
                                                            >
                                                                {tForm(
                                                                    `IntervalOptions.${intervalOption}`,
                                                                )}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    )}
                                />
                            </FieldGroup>

                            {match(interval)
                                .with("day", () => (
                                    <FieldGroup>
                                        <Controller
                                            control={form.control}
                                            name="schedule.time"
                                            render={({
                                                field,
                                                fieldState,
                                            }) => (
                                                <FormField
                                                    label={tForm("Time")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            type="time"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            {...field}
                                                            value={field.value ?? ""}
                                                        />
                                                        {field.value && (
                                                            <InputGroupAddon align="inline-end">
                                                                <InputGroupButton
                                                                    size="icon-xs"
                                                                    onClick={() =>
                                                                        field.onChange(
                                                                            undefined,
                                                                        )
                                                                    }
                                                                >
                                                                    <XIcon />
                                                                </InputGroupButton>
                                                            </InputGroupAddon>
                                                        )}
                                                    </InputGroup>
                                                </FormField>
                                            )}
                                        />
                                    </FieldGroup>
                                ))
                                .with("month", () => (
                                    <FieldGroup>
                                        <Controller
                                            control={form.control}
                                            name="schedule.dayNumber"
                                            render={({
                                                field,
                                                fieldState,
                                            }) => (
                                                <FormField
                                                    label={tForm("DayNumber")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={31}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target.value;
                                                            field.onChange(
                                                                val === ""
                                                                    ? undefined
                                                                    : Number(val),
                                                            );
                                                        }}
                                                    />
                                                </FormField>
                                            )}
                                        />
                                    </FieldGroup>
                                ))
                                .with("weekday", () => (
                                    <FieldGroup>
                                        <Controller
                                            control={form.control}
                                            name="schedule.day"
                                            render={({ field, fieldState }) => (
                                                <FormField
                                                    label={tForm("Day")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <Select
                                                        value={
                                                            field.value ??
                                                            "monday"
                                                        }
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            className="w-full"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {days.map((day) => (
                                                                <SelectItem
                                                                    key={day}
                                                                    value={day}
                                                                >
                                                                    {tForm(
                                                                        `Days.${day}`,
                                                                    )}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormField>
                                            )}
                                        />
                                    </FieldGroup>
                                ))
                                .with("year", () => (
                                    <FieldGroup>
                                        <Controller
                                            control={form.control}
                                            name="schedule.month"
                                            render={({ field, fieldState }) => (
                                                <FormField
                                                    label={tForm("Month")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <Select
                                                        value={
                                                            field.value ??
                                                            "january"
                                                        }
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            className="w-full"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {months.map(
                                                                (month) => (
                                                                    <SelectItem
                                                                        key={
                                                                            month
                                                                        }
                                                                        value={
                                                                            month
                                                                        }
                                                                    >
                                                                        {tForm(
                                                                            `Months.${month}`,
                                                                        )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormField>
                                            )}
                                        />
                                    </FieldGroup>
                                ))
                                .exhaustive()}
                        </FieldSet>
                    </form>
                </div>

                <DrawerFooter>
                    <Button type="submit" form="update-habit-form">
                        {t("Submit")}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="secondary">{t("Cancel")}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </NestedDrawer>
    );
}
