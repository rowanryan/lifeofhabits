"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { id } from "@instantdb/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { match } from "ts-pattern";
import z from "zod";
import { FormField } from "@/components/FormField";
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
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    type Schedule,
    ScheduleSchema,
    scheduleToRRule,
} from "@/lib/schedule";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(1, { error: "Cannot be empty" }),
    description: z
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val)),
    schedule: ScheduleSchema,
});

type FormValues = z.input<typeof formSchema>;

const defaultScheduleValues: Record<Schedule["interval"], Schedule> = {
    minute: { interval: "minute", count: 1 },
    hour: { interval: "hour", count: 1, startTime: "09:00" },
    day: { interval: "day" },
    month: { interval: "month" },
    weekday: { interval: "weekday", day: "monday" },
    year: { interval: "year", month: "january" },
};

export type CreateHabitProps = React.PropsWithChildren &
    React.ComponentProps<typeof Drawer>;

export function CreateHabit({ children, ...props }: CreateHabitProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Habits.Create");
    const isMobile = useIsMobile();
    const { user } = db.useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            schedule: defaultScheduleValues.weekday,
        },
    });

    const interval = form.watch("schedule.interval");

    useEffect(() => {
        form.setValue("schedule", defaultScheduleValues[interval]);
    }, [interval, form]);

    const onSubmit = useCallback(
        (data: FormValues) => {
            const habit = db.tx.habits[id()];

            if (habit && user) {
                const rrule = scheduleToRRule(data.schedule);

                db.transact([
                    habit.create({
                        rrule,
                        userId: user.id,
                        name: data.name,
                        description: data.description,
                    }),
                    habit.link({
                        user: user.id,
                    }),
                ]);

                setIsOpen(false);
                form.reset();
            }
        },
        [user, form.reset],
    );

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction={isMobile ? "bottom" : "right"}
            {...props}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className={cn(isMobile ? "h-full" : "max-w-lg!")}>
                <DrawerHeader>
                    <DrawerTitle>{t("Title")}</DrawerTitle>
                    <DrawerDescription>{t("Description")}</DrawerDescription>
                </DrawerHeader>

                <div className={cn("overflow-y-auto px-4", isMobile && "px-6")}>
                    <form
                        id="create-habit-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldSet>
                            <FieldGroup>
                                <Controller
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <FormField
                                            label={t("Form.Name")}
                                            isInvalid={fieldState.invalid}
                                            error={fieldState.error}
                                        >
                                            <Input
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={t(
                                                    "Form.NamePlaceholder",
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
                                            label={t("Form.Description")}
                                            isInvalid={fieldState.invalid}
                                            error={fieldState.error}
                                        >
                                            <Textarea
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={t(
                                                    "Form.DescriptionPlaceholder",
                                                )}
                                                className="min-h-32"
                                                {...field}
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
                                            label={t("Form.Interval")}
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
                                                                {t(
                                                                    `Form.IntervalOptions.${intervalOption}`,
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
                                .with("minute", () => (
                                    <FieldGroup>
                                        <Controller
                                            control={form.control}
                                            name="schedule.count"
                                            render={({ field, fieldState }) => (
                                                <FormField
                                                    label={t("Form.Count")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        {...field}
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target.value;
                                                            field.onChange(
                                                                val === ""
                                                                    ? undefined
                                                                    : Number(
                                                                          val,
                                                                      ),
                                                            );
                                                        }}
                                                    />
                                                </FormField>
                                            )}
                                        />
                                    </FieldGroup>
                                ))
                                .with("hour", () => (
                                    <>
                                        <FieldGroup>
                                            <Controller
                                                control={form.control}
                                                name="schedule.count"
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormField
                                                        label={t("Form.Count")}
                                                        isInvalid={
                                                            fieldState.invalid
                                                        }
                                                        error={fieldState.error}
                                                    >
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            {...field}
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const val =
                                                                    e.target
                                                                        .value;
                                                                field.onChange(
                                                                    val === ""
                                                                        ? undefined
                                                                        : Number(
                                                                              val,
                                                                          ),
                                                                );
                                                            }}
                                                        />
                                                    </FormField>
                                                )}
                                            />
                                        </FieldGroup>
                                        <FieldGroup>
                                            <Controller
                                                control={form.control}
                                                name="schedule.startTime"
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormField
                                                        label={t(
                                                            "Form.StartTime",
                                                        )}
                                                        isInvalid={
                                                            fieldState.invalid
                                                        }
                                                        error={fieldState.error}
                                                    >
                                                        <Input
                                                            type="time"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                            {...field}
                                                            value={
                                                                field.value ??
                                                                "09:00"
                                                            }
                                                        />
                                                    </FormField>
                                                )}
                                            />
                                        </FieldGroup>
                                    </>
                                ))
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
                                                    label={t("Form.Time")}
                                                    isInvalid={
                                                        fieldState.invalid
                                                    }
                                                    error={fieldState.error}
                                                >
                                                    <Input
                                                        type="time"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
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
                                                    label={t("Form.DayNumber")}
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
                                                    label={t("Form.Day")}
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
                                                                    {t(
                                                                        `Form.Days.${day}`,
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
                                                    label={t("Form.Month")}
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
                                                                        {t(
                                                                            `Form.Months.${month}`,
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
                    <Button type="submit" form="create-habit-form">
                        {t("Form.Submit")}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="secondary">{t("Form.Cancel")}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
