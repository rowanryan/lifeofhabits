import "dotenv/config";

import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import prompts from "prompts";
import { type Schedule, scheduleToRRule } from "../../src/lib/schedule";
import { habits } from "../../src/server/db/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql });

const habitTypes = ["habit", "meal"] as const;

const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
] as const;

const dailyHabits = [
    { name: "Morning workout", description: "Start the day with exercise" },
    { name: "Meditation", description: "10 minutes of mindfulness" },
    { name: "Take vitamins", description: null },
    { name: "Drink 8 glasses of water", description: "Stay hydrated" },
    { name: "Read for 30 minutes", description: null },
    { name: "Journal", description: "Write down thoughts and reflections" },
    { name: "Stretch routine", description: "5 minute morning stretch" },
    { name: "Walk 10,000 steps", description: null },
];

const weeklyHabits = [
    { name: "Weekly review", description: "Review goals and progress" },
    { name: "Team sync", description: "Weekly team meeting" },
    { name: "Meal prep", description: "Prepare meals for the week" },
    { name: "Deep clean", description: "Thorough house cleaning" },
    { name: "Call family", description: "Stay connected with loved ones" },
    { name: "Grocery shopping", description: null },
    { name: "Laundry day", description: null },
    { name: "Water plants", description: null },
];

const monthlyHabits = [
    { name: "Budget review", description: "Review monthly expenses" },
    { name: "Car maintenance check", description: null },
    { name: "Backup important files", description: "Cloud and local backup" },
    { name: "Review subscriptions", description: "Cancel unused services" },
    { name: "Deep clean fridge", description: null },
    { name: "Update passwords", description: "Security maintenance" },
];

const yearlyHabits = [
    { name: "Annual health checkup", description: "Schedule doctor visit" },
    { name: "Tax preparation", description: "Gather documents for taxes" },
    { name: "Birthday celebration", description: null },
    { name: "Anniversary", description: null },
    { name: "Renew insurance", description: "Review and renew policies" },
    { name: "Spring cleaning", description: "Deep clean entire home" },
    { name: "Holiday planning", description: "Plan family gatherings" },
    { name: "Year in review", description: "Reflect on the past year" },
];

function generateRandomTime(): string {
    const hour = faker.number.int({ min: 0, max: 23 });
    const minute = faker.helpers.arrayElement([0, 15, 30, 45]);
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function generateSchedule(): Schedule {
    const scheduleType = faker.helpers.weightedArrayElement([
        { value: "minute", weight: 5 },
        { value: "hourly", weight: 15 },
        { value: "daily", weight: 25 },
        { value: "weekday", weight: 20 },
        { value: "monthly", weight: 25 },
        { value: "yearly", weight: 10 },
    ]);

    switch (scheduleType) {
        case "minute":
            return {
                interval: "minute",
                count: faker.helpers.weightedArrayElement([
                    { value: 15, weight: 30 },
                    { value: 30, weight: 40 },
                    { value: 45, weight: 20 },
                    { value: 60, weight: 10 },
                ]),
            };
        case "hourly":
            return {
                interval: "hour",
                count: faker.helpers.weightedArrayElement([
                    { value: 1, weight: 40 },
                    { value: 2, weight: 30 },
                    { value: 3, weight: 15 },
                    { value: 4, weight: 10 },
                    { value: 6, weight: 5 },
                ]),
                startTime: generateRandomTime(),
            };
        case "daily":
            return {
                interval: "day",
                count: faker.helpers.weightedArrayElement([
                    { value: 1, weight: 50 },
                    { value: 2, weight: 25 },
                    { value: 3, weight: 15 },
                    { value: 7, weight: 10 },
                ]),
                startDay: faker.helpers.arrayElement(days),
            };
        case "weekday":
            return {
                interval: "weekday",
                day: faker.helpers.arrayElement(days),
            };
        case "monthly":
            return {
                interval: "month",
                count: faker.helpers.weightedArrayElement([
                    { value: 1, weight: 60 },
                    { value: 2, weight: 25 },
                    { value: 3, weight: 10 },
                    { value: 6, weight: 5 },
                ]),
                startMonth: faker.helpers.arrayElement(months),
            };
        case "yearly":
            return {
                interval: "year",
                month: faker.helpers.arrayElement(months),
            };
        default:
            return { interval: "minute", count: 30 };
    }
}

function getHabitForSchedule(schedule: Schedule): {
    name: string;
    description: string | null;
} {
    if (schedule.interval === "weekday") {
        return faker.helpers.arrayElement(weeklyHabits);
    }
    if (schedule.interval === "year") {
        return faker.helpers.arrayElement(yearlyHabits);
    }
    if (schedule.interval === "month") {
        return faker.helpers.arrayElement(monthlyHabits);
    }
    if (schedule.interval === "minute" || schedule.interval === "hour") {
        return faker.helpers.arrayElement(dailyHabits);
    }
    return faker.helpers.arrayElement(dailyHabits);
}

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
    const habitsToInsert: (typeof habits.$inferInsert)[] = [];

    console.log("\nGenerating habits...\n");

    for (let i = 0; i < 15; i++) {
        const schedule = generateSchedule();
        const habit = getHabitForSchedule(schedule);

        habitsToInsert.push({
            clerkUserId,
            type: faker.helpers.arrayElement(habitTypes),
            name: habit.name,
            description: habit.description,
            rrule: scheduleToRRule(schedule),
        });
    }

    console.log(`Inserting ${habitsToInsert.length} habits...`);
    console.log("\nSample habits:");
    habitsToInsert.slice(0, 5).forEach(h => {
        console.log(`  - ${h.name} (${h.rrule})`);
    });

    await db.insert(habits).values(habitsToInsert);

    console.log("\nDone! Habits seeded successfully.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
