"use server";

import { and, eq, lte, or } from "drizzle-orm";
import { RRule } from "rrule";
import z from "zod";
import { authAction } from "@/server/actions";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";

export const getEvents = authAction
    .inputSchema(
        z.object({
            dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
    )
    .action(async ({ ctx, parsedInput }) => {
        const { dateString } = parsedInput;

        const candidates = await db
            .select()
            .from(events)
            .where(
                and(
                    eq(events.clerkUserId, ctx.clerkAuth.userId),
                    or(
                        and(
                            eq(events.scheduleType, "once"),
                            eq(events.startDate, dateString)
                        ),
                        and(
                            eq(events.scheduleType, "recurring"),
                            lte(events.startDate, dateString)
                        )
                    )
                )
            );

        const filteredEvents = candidates.filter(event => {
            if (event.scheduleType === "once") return true;
            if (!event.rrule) return false;

            const dtstart = new Date(`${event.startDate}T00:00:00Z`);
            const rule = new RRule({
                ...RRule.parseString(event.rrule),
                dtstart,
            });

            const dayStart = new Date(`${dateString}T00:00:00Z`);
            const dayEnd = new Date(`${dateString}T23:59:59Z`);
            return rule.between(dayStart, dayEnd, true).length > 0;
        });

        return filteredEvents.sort((a, b) => {
            if (a.startTime && b.startTime) {
                return a.startTime.localeCompare(b.startTime);
            }
            if (a.startTime && !b.startTime) return -1;
            if (!a.startTime && b.startTime) return 1;
            return 0;
        });
    });
