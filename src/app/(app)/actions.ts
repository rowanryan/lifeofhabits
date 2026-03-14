"use server";

import { endOfDay, startOfDay } from "date-fns";
import { rrulestr } from "rrule";
import { z } from "zod";
import { authAction } from "@/server/actions";
import { db } from "@/server/db";

export const getHabits = authAction
    .inputSchema(
        z.object({
            date: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const habits = await db.query.habits.findMany({
            where: {
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        const targetDate = new Date(parsedInput.date);
        const start = startOfDay(targetDate);
        const end = endOfDay(targetDate);

        const filteredHabits = habits.filter(habit => {
            const rule = rrulestr(habit.rrule);
            const occurrences = rule.between(start, end, true);

            return occurrences.length > 0;
        });

        return filteredHabits;
    });
