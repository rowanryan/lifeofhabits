import { Frequency, RRule } from "rrule";
import z from "zod";

export const ScheduleSchema = z.object({
    interval: z.enum(["minute", "hour", "day", "week", "month", "year"]),
    intervalCount: z.number().int().positive(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;

const freqToInterval: Record<Frequency, Schedule["interval"]> = {
    [Frequency.MINUTELY]: "minute",
    [Frequency.HOURLY]: "hour",
    [Frequency.DAILY]: "day",
    [Frequency.WEEKLY]: "week",
    [Frequency.MONTHLY]: "month",
    [Frequency.YEARLY]: "year",
    [Frequency.SECONDLY]: "minute",
};

const intervalToFreq: Record<Schedule["interval"], Frequency> = {
    minute: Frequency.MINUTELY,
    hour: Frequency.HOURLY,
    day: Frequency.DAILY,
    week: Frequency.WEEKLY,
    month: Frequency.MONTHLY,
    year: Frequency.YEARLY,
};

export function scheduleToRRule(schedule: Schedule): string {
    const rule = new RRule({
        freq: intervalToFreq[schedule.interval],
        interval: schedule.intervalCount,
    });

    return rule.toString();
}

export function rRuleToSchedule(rruleStr: string): Schedule | null {
    const rule = RRule.fromString(rruleStr);

    try {
        const parsed = ScheduleSchema.parse({
            interval: freqToInterval[rule.options.freq],
            intervalCount: rule.options.interval,
        });

        return parsed;
    } catch {
        return null;
    }
}
