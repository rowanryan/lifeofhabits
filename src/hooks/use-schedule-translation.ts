"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { Schedule } from "@/lib/schedule";

export function useScheduleTranslation() {
    const t = useTranslations("Habits.Schedule");

    const getKey = useCallback<
        (schedule: Schedule) => {
            key: string;
            params?: Record<string, unknown>;
        }
    >(
        schedule => {
            if (schedule.interval === "minute") {
                return {
                    key: "Every.minute",
                    params: { count: schedule.count },
                };
            }

            if (schedule.interval === "hour") {
                return {
                    key: "Every.hour",
                    params: {
                        count: schedule.count,
                        startTime: schedule.startTime,
                    },
                };
            }

            if (schedule.interval === "day") {
                return {
                    key: "Every.day",
                    params: {
                        count: schedule.count,
                        // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                        startDay: t(`StartDay.${schedule.startDay}` as any),
                    },
                };
            }

            if (schedule.interval === "month") {
                return {
                    key: "Every.month",
                    params: {
                        count: schedule.count,
                        startMonth: t(
                            // biome-ignore lint/suspicious/noExplicitAny: dynamic key from schedule type
                            `StartMonth.${schedule.startMonth}` as any
                        ),
                    },
                };
            }

            if (schedule.interval === "weekday") {
                return { key: `Weekday.${schedule.day}` };
            }

            if (schedule.interval === "year") {
                return { key: `Yearly.${schedule.month}` };
            }

            return { key: "Every.minute", params: { count: 1 } };
        },
        [t]
    );

    return getKey;
}
