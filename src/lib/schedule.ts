import { Frequency, RRule, type Weekday } from "rrule";
import z from "zod";

const days = z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]);

const months = z.enum([
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
]);

const timeRegex = /^\d{2}:\d{2}$/;

export type Month = z.infer<typeof months>;
export type Day = z.infer<typeof days>;

export const ScheduleSchema = z.discriminatedUnion("interval", [
    z.object({
        interval: z.literal("minute"),
        count: z.number().int().positive(),
    }),
    z.object({
        interval: z.literal("hour"),
        count: z.number().int().positive(),
        startTime: z.string().regex(timeRegex),
    }),
    z.object({
        interval: z.literal("day"),
        count: z.number().int().positive(),
        startDay: days,
    }),
    z.object({
        interval: z.literal("month"),
        count: z.number().int().positive(),
        startMonth: months,
    }),
    z.object({
        interval: z.literal("weekday"),
        day: days,
    }),
    z.object({
        interval: z.literal("year"),
        month: months,
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
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

export function scheduleToRRule(schedule: Schedule, dtstart?: Date): string {
    const start = dtstart ?? new Date();

    if (schedule.interval === "minute") {
        const rule = new RRule({
            freq: Frequency.MINUTELY,
            interval: schedule.count,
            dtstart: start,
        });
        return rule.toString();
    }

    if (schedule.interval === "hour") {
        const { hour, minute } = parseTime(schedule.startTime);
        const ruleStart = new Date(start);
        ruleStart.setHours(hour, minute, 0, 0);
        const rule = new RRule({
            freq: Frequency.HOURLY,
            interval: schedule.count,
            dtstart: ruleStart,
        });
        return rule.toString();
    }

    if (schedule.interval === "day") {
        const dayIndex = days.options.indexOf(schedule.startDay);
        const ruleStart = new Date(start);
        const currentDay = ruleStart.getDay();
        const targetDay = (dayIndex + 1) % 7;
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        ruleStart.setDate(ruleStart.getDate() + daysUntilTarget);
        const rule = new RRule({
            freq: Frequency.DAILY,
            interval: schedule.count,
            dtstart: ruleStart,
        });
        return rule.toString();
    }

    if (schedule.interval === "month") {
        const monthIndex = monthToNumber[schedule.startMonth] - 1;
        const ruleStart = new Date(start);
        ruleStart.setMonth(monthIndex, 1);
        if (ruleStart < start) {
            ruleStart.setFullYear(ruleStart.getFullYear() + 1);
        }
        const rule = new RRule({
            freq: Frequency.MONTHLY,
            interval: schedule.count,
            dtstart: ruleStart,
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

        if (rule.options.freq === Frequency.MINUTELY) {
            return ScheduleSchema.parse({
                interval: "minute",
                count: rule.options.interval,
            });
        }

        if (rule.options.freq === Frequency.HOURLY) {
            const hour = dtstart?.getHours() ?? 0;
            const minute = dtstart?.getMinutes() ?? 0;
            return ScheduleSchema.parse({
                interval: "hour",
                count: rule.options.interval,
                startTime: formatTime(hour, minute),
            });
        }

        if (rule.options.freq === Frequency.DAILY) {
            const dayNum = dtstart?.getDay() ?? 0;
            const dayIndex = dayNum === 0 ? 6 : dayNum - 1;
            return ScheduleSchema.parse({
                interval: "day",
                count: rule.options.interval,
                startDay: weekdayToDay[dayIndex],
            });
        }

        if (rule.options.freq === Frequency.MONTHLY) {
            const monthNum = (dtstart?.getMonth() ?? 0) + 1;
            return ScheduleSchema.parse({
                interval: "month",
                count: rule.options.interval,
                startMonth: numberToMonth[monthNum],
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
