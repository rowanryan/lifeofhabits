"use client";

import { useCallback } from "react";
import type { Schedule } from "@/lib/schedule";

export function useScheduleTranslation() {
    const getKey = useCallback<
        (schedule: Schedule) => {
            key: string;
            params?: Record<string, unknown>;
        }
    >((schedule) => {
        if (schedule.interval === "day") {
            if (schedule.time) {
                return {
                    key: "DailyAt",
                    params: { time: schedule.time },
                };
            }
            return { key: "Daily" };
        }

        if (schedule.interval === "month") {
            if (schedule.dayNumber) {
                return {
                    key: "MonthlyOn",
                    params: { dayNumber: schedule.dayNumber },
                };
            }
            return { key: "Monthly" };
        }

        if (schedule.interval === "weekday") {
            return { key: `Weekday.${schedule.day}` };
        }

        if (schedule.interval === "year") {
            return { key: `Yearly.${schedule.month}` };
        }

        return { key: "Daily" };
    }, []);

    return getKey;
}
