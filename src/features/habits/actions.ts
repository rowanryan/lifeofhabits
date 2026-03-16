"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authAction } from "@/server/actions";
import { db } from "@/server/db";
import { habits } from "@/server/db/schema";

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
