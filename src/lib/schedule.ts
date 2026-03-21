import { Frequency, RRule, type Weekday } from "rrule";
import z from "zod";

export const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

export const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
] as const;

export const intervals = ["day", "weekday", "month", "year"] as const;

export const DaysSchema = z.enum(days);

export const MonthsSchema = z.enum(months);

export const timeRegex = /^\d{2}:\d{2}$/;

export type Month = z.infer<typeof MonthsSchema>;
export type Day = z.infer<typeof DaysSchema>;

export const ScheduleSchema = z.discriminatedUnion("interval", [
    z.object({
        interval: z.literal("day"),
        time: z.string().regex(timeRegex).optional(),
    }),
    z.object({
        interval: z.literal("month"),
        dayNumber: z.number().int().positive().max(31).optional(),
    }),
    z.object({
        interval: z.literal("weekday"),
        day: DaysSchema,
    }),
    z.object({
        interval: z.literal("year"),
        month: MonthsSchema,
    }),
]);

export type Schedule = z.infer<typeof ScheduleSchema>;

const dayToWeekday: Record<Day, Weekday> = {
    monday: RRule.MO,
    tuesday: RRule.TU,
    wednesday: RRule.WE,
    thursday: RRule.TH,
    friday: RRule.FR,
    saturday: RRule.SA,
    sunday: RRule.SU,
};

const weekdayToDay: Record<number, Day> = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
};

const monthToNumber: Record<Month, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};

const numberToMonth: Record<number, Month> = {
    1: "january",
    2: "february",
    3: "march",
    4: "april",
    5: "may",
    6: "june",
    7: "july",
    8: "august",
    9: "september",
    10: "october",
    11: "november",
    12: "december",
};

function parseTime(time: string): { hour: number; minute: number } {
    const [hour, minute] = time.split(":").map(Number);
    return { hour: hour ?? 0, minute: minute ?? 0 };
}

function formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
}

export function scheduleToRRule(schedule: Schedule, dtstart?: Date): string {
    const start = dtstart ?? new Date();

    if (schedule.interval === "day") {
        const ruleStart = new Date(start);
        if (schedule.time) {
            const { hour, minute } = parseTime(schedule.time);
            ruleStart.setHours(hour, minute, 0, 0);
        }
        const rule = new RRule({
            freq: Frequency.DAILY,
            dtstart: ruleStart,
        });
        return rule.toString();
    }

    if (schedule.interval === "month") {
        const rule = new RRule({
            freq: Frequency.MONTHLY,
            bymonthday: schedule.dayNumber ? [schedule.dayNumber] : undefined,
            dtstart: start,
        });
        return rule.toString();
    }

    if (schedule.interval === "weekday") {
        const rule = new RRule({
            freq: Frequency.WEEKLY,
            byweekday: [dayToWeekday[schedule.day]],
            dtstart: start,
        });
        return rule.toString();
    }

    if (schedule.interval === "year") {
        const rule = new RRule({
            freq: Frequency.YEARLY,
            bymonth: [monthToNumber[schedule.month]],
            dtstart: start,
        });
        return rule.toString();
    }

    throw new Error("Invalid schedule interval");
}

export function rRuleToSchedule(rruleStr: string): Schedule | null {
    const rule = RRule.fromString(rruleStr);

    try {
        const byweekday = rule.options.byweekday;
        const bymonth = rule.options.bymonth;
        const dtstart = rule.options.dtstart;

        if (rule.options.freq === Frequency.DAILY) {
            const hour = dtstart?.getHours();
            const minute = dtstart?.getMinutes();
            const hasTime =
                hour !== undefined &&
                minute !== undefined &&
                (hour !== 0 || minute !== 0);
            return ScheduleSchema.parse({
                interval: "day",
                time: hasTime ? formatTime(hour, minute) : undefined,
            });
        }

        if (rule.options.freq === Frequency.MONTHLY) {
            const bymonthday = rule.options.bymonthday;
            return ScheduleSchema.parse({
                interval: "month",
                dayNumber: bymonthday?.length ? bymonthday[0] : undefined,
            });
        }

        if (
            rule.options.freq === Frequency.WEEKLY &&
            byweekday?.length &&
            byweekday[0] !== undefined
        ) {
            return ScheduleSchema.parse({
                interval: "weekday",
                day: weekdayToDay[byweekday[0]],
            });
        }

        if (
            rule.options.freq === Frequency.YEARLY &&
            bymonth?.length &&
            bymonth[0] !== undefined
        ) {
            return ScheduleSchema.parse({
                interval: "year",
                month: numberToMonth[bymonth[0]],
            });
        }

        return null;
    } catch {
        return null;
    }
}
