import * as p from "drizzle-orm/pg-core";

const id = p.uuid("id").primaryKey().notNull().defaultRandom();

const timestamps = {
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p.timestamp().notNull().defaultNow(),
};

export const habits = p.pgTable("habits", {
    id,
    clerkUserId: p.text().notNull(),
    name: p.text().notNull(),
    description: p.text(),
    rrule: p.text().notNull(),
    ...timestamps,
});
