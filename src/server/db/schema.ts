import * as p from "drizzle-orm/pg-core";

const id = p.uuid("id").primaryKey().notNull().defaultRandom();

const timestamps = {
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p.timestamp().notNull().defaultNow(),
};

export const eventTypeEnum = p.pgEnum("event_type", [
    "custom",
    "habit",
    "meal",
]);
export const eventScheduleTypeEnum = p.pgEnum("event_schedule_type", [
    "once",
    "recurring",
]);

export const polarCustomers = p.pgTable(
    "polar_customers",
    {
        id,
        clerkUserId: p.text().notNull(),
        externalId: p.text().notNull(),
        subscriptionId: p.text(),
        spendLimit: p.doublePrecision(),
        ...timestamps,
    },
    columns => [p.unique().on(columns.clerkUserId)]
);

export const events = p.pgTable("events", {
    id,
    clerkUserId: p.text().notNull(),
    type: eventTypeEnum().notNull(),
    scheduleType: eventScheduleTypeEnum().notNull(),
    name: p.text().notNull(),
    description: p.text(),
    startDate: p.date().notNull(),
    startTime: p.time(),
    rrule: p.text(),
    ...timestamps,
});
