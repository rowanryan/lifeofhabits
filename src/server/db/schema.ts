import * as p from "drizzle-orm/pg-core";

const id = p.uuid("id").primaryKey().notNull().defaultRandom();

const timestamps = {
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p.timestamp().notNull().defaultNow(),
};

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

export const habits = p.pgTable("habits", {
    id,
    clerkUserId: p.text().notNull(),
    name: p.text().notNull(),
    description: p.text(),
    rrule: p.text().notNull(),
    ...timestamps,
});
