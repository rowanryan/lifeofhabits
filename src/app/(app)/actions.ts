"use server";

import { endOfDay, startOfDay } from "date-fns";
import { and, eq } from "drizzle-orm";
import { rrulestr } from "rrule";
import { z } from "zod";
import { authAction } from "@/server/actions";
import { db } from "@/server/db";
import { habits } from "@/server/db/schema";

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

        const filteredHabits: typeof habits = [];
        for (const habit of habits) {
            try {
                const rule = rrulestr(habit.rrule);
                const occurrences = rule.between(start, end, true);

                if (occurrences.length > 0) {
                    filteredHabits.push(habit);
                }
            } catch {
                // Skip habits with invalid rrule
            }
        }

        return filteredHabits;
    });

export const deleteHabit = authAction
    .inputSchema(
        z.object({
            id: z.string(),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const habit = await db.query.habits.findFirst({
            where: {
                id: parsedInput.id,
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        if (habit) {
            await db
                .delete(habits)
                .where(
                    and(
                        eq(habits.clerkUserId, ctx.clerkAuth.userId),
                        eq(habits.id, habit.id)
                    )
                );
        }
    });
