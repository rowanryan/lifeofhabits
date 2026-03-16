"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { ScheduleSchema, scheduleToRRule } from "@/lib/schedule";
import { ActionError, authAction } from "@/server/actions";
import { db } from "@/server/db";
import { habits } from "@/server/db/schema";

export const createHabit = authAction
    .inputSchema(
        z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            schedule: ScheduleSchema,
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const rrule = scheduleToRRule(parsedInput.schedule);

        const [newHabit] = await db
            .insert(habits)
            .values({
                clerkUserId: ctx.clerkAuth.userId,
                name: parsedInput.name,
                description: parsedInput.description,
                rrule,
            })
            .returning();

        if (!newHabit) {
            throw new ActionError("Failed to create habit");
        }

        return newHabit;
    });

export const updateHabit = authAction
    .inputSchema(
        z.object({
            id: z.string(),
            name: z.string().min(1),
            description: z.string().nullable(),
            schedule: ScheduleSchema,
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const habit = await db.query.habits.findFirst({
            where: {
                id: parsedInput.id,
                clerkUserId: ctx.clerkAuth.userId,
            },
        });

        if (!habit) {
            throw new ActionError("Habit not found");
        }

        const rrule = scheduleToRRule(parsedInput.schedule);

        const [updatedHabit] = await db
            .update(habits)
            .set({
                name: parsedInput.name,
                description: parsedInput.description,
                rrule,
            })
            .where(eq(habits.id, habit.id))
            .returning();

        if (!updatedHabit) {
            throw new ActionError("Failed to update habit");
        }

        return updatedHabit;
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
