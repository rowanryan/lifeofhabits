import * as p from "drizzle-orm/pg-core";

const id = p.uuid("id").primaryKey().notNull().defaultRandom();

const timestamps = {
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p.timestamp().notNull().defaultNow(),
};

export const stripeCustomers = p.pgTable("stripe_customers", {
    id,
    clerkUserId: p.text().notNull(),
    externalId: p.text().notNull(),
    ...timestamps,
});

export const polarCustomers = p.pgTable("polar_customers", {
    id,
    clerkUserId: p.text().notNull(),
    externalId: p.text().notNull(),
    ...timestamps,
});
