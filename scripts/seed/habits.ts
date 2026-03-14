import "dotenv/config";

import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import prompts from "prompts";
import { habits } from "../../src/server/db/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql });

const habitTypes = ["habit", "meal"] as const;

const habitNames = [
    "Morning workout",
    "Daily standup",
    "Weekly review",
    "Team sync",
    "Meditation",
    "Read for 30 minutes",
    "Take vitamins",
    "Water plants",
    "Check emails",
    "Plan tomorrow",
];

const rrulePatterns = [
    "FREQ=DAILY",
    "FREQ=DAILY;INTERVAL=2",
    "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    "FREQ=WEEKLY;BYDAY=TU,TH",
    "FREQ=WEEKLY;BYDAY=SA,SU",
    "FREQ=WEEKLY",
    "FREQ=MONTHLY;BYMONTHDAY=1",
    "FREQ=MONTHLY;BYMONTHDAY=15",
];

async function main() {
    const response = await prompts({
        type: "text",
        name: "clerkUserId",
        message: "Enter the Clerk user ID to seed events for:",
        validate: (value: string) =>
            value.length > 0 ? true : "User ID is required",
    });

    if (!response.clerkUserId) {
        console.log("Cancelled.");
        process.exit(0);
    }

    const clerkUserId = response.clerkUserId as string;
    const today = new Date();
    const habitsToInsert: (typeof habits.$inferInsert)[] = [];

    console.log("\nGenerating habits...\n");

    for (let i = 0; i < 10; i++) {
        const daysOffset = faker.number.int({ min: -30, max: 0 });
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + daysOffset);

        habitsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(habitTypes),
            name: faker.helpers.arrayElement(habitNames),
            description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
            rrule: faker.helpers.arrayElement(rrulePatterns),
        });
    }

    console.log(`Inserting ${habitsToInsert.length} habits...`);

    await db.insert(habits).values(habitsToInsert);

    console.log("\nDone! Habits seeded successfully.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
