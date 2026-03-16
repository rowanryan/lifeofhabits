"use server";

import { authAction } from "@/server/actions";
import { db } from "@/server/db";

export const getHabits = authAction.action(async ({ ctx }) => {
    const habits = await db.query.habits.findMany({
        where: {
            clerkUserId: ctx.clerkAuth.userId,
        },
    });

    return habits;
});
