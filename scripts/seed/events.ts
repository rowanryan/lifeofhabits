import "dotenv/config";

import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import prompts from "prompts";
import { events } from "../../src/server/db/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql });

function formatDate(date: Date): string {
    const [dateString] = date.toISOString().split("T");
    if (!dateString) {
        throw new Error("Invalid date");
    }
    return dateString;
}

function formatTime(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

function randomTime(): string {
    const hour = faker.number.int({ min: 6, max: 22 });
    const minute = faker.helpers.arrayElement([0, 15, 30, 45]);
    return formatTime(hour, minute);
}

const eventTypes = ["custom", "habit", "meal"] as const;

const oneOffEventNames = [
    "Doctor appointment",
    "Dentist visit",
    "Car service",
    "Birthday party",
    "Wedding",
    "Job interview",
    "House viewing",
    "Passport renewal",
    "Tax meeting",
    "Parent-teacher conference",
];

const recurringEventNames = [
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

const mealNames = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Coffee break",
    "Brunch",
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
    const eventsToInsert: (typeof events.$inferInsert)[] = [];

    console.log("\nGenerating events...\n");

    for (let i = 0; i < 5; i++) {
        const daysOffset = faker.number.int({ min: -7, max: 30 });
        const eventDate = new Date(today);
        eventDate.setDate(eventDate.getDate() + daysOffset);

        eventsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(["custom", "habit"]),
            scheduleType: "once",
            name: faker.helpers.arrayElement(oneOffEventNames),
            description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
            startDate: formatDate(eventDate),
            startTime: null,
            rrule: null,
        });
    }

    for (let i = 0; i < 5; i++) {
        const daysOffset = faker.number.int({ min: -7, max: 30 });
        const eventDate = new Date(today);
        eventDate.setDate(eventDate.getDate() + daysOffset);

        eventsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(eventTypes),
            scheduleType: "once",
            name: faker.helpers.arrayElement([
                ...oneOffEventNames,
                ...mealNames,
            ]),
            description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
            startDate: formatDate(eventDate),
            startTime: randomTime(),
            rrule: null,
        });
    }

    for (let i = 0; i < 4; i++) {
        const daysOffset = faker.number.int({ min: -30, max: 0 });
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + daysOffset);

        eventsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(["custom", "habit"]),
            scheduleType: "recurring",
            name: faker.helpers.arrayElement(recurringEventNames),
            description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
            startDate: formatDate(startDate),
            startTime: null,
            rrule: faker.helpers.arrayElement(rrulePatterns),
        });
    }

    for (let i = 0; i < 6; i++) {
        const daysOffset = faker.number.int({ min: -30, max: 0 });
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + daysOffset);

        eventsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(eventTypes),
            scheduleType: "recurring",
            name: faker.helpers.arrayElement([
                ...recurringEventNames,
                ...mealNames,
            ]),
            description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
            startDate: formatDate(startDate),
            startTime: randomTime(),
            rrule: faker.helpers.arrayElement(rrulePatterns),
        });
    }

    console.log(`Inserting ${eventsToInsert.length} events...`);
    console.log("\nEvent breakdown:");
    console.log(
        `  - One-off without time: ${eventsToInsert.filter((e) => e.scheduleType === "once" && !e.startTime).length}`
    );
    console.log(
        `  - One-off with time: ${eventsToInsert.filter((e) => e.scheduleType === "once" && e.startTime).length}`
    );
    console.log(
        `  - Recurring without time: ${eventsToInsert.filter((e) => e.scheduleType === "recurring" && !e.startTime).length}`
    );
    console.log(
        `  - Recurring with time: ${eventsToInsert.filter((e) => e.scheduleType === "recurring" && e.startTime).length}`
    );

    await db.insert(events).values(eventsToInsert);

    console.log("\nDone! Events seeded successfully.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
