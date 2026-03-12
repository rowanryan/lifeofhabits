"use server";

import { endOfDay, startOfDay } from "date-fns";
import z from "zod";
import { authAction } from "@/server/actions";
import { db } from "@/server/db";

export const getEvents = authAction
    .inputSchema(
        z.object({
            date: z.date(),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const dayStart = startOfDay(parsedInput.date);
        const dayEnd = endOfDay(parsedInput.date);

        const events = await db.query.events.findMany({
            where: {
                clerkUserId: ctx.clerkAuth.userId,
                startDate: {
                    gte: dayStart.toISOString(),
                    lte: dayEnd.toISOString(),
                },
            },
            orderBy: {
                startDate: "asc",
            },
        });

        return events;
    });
