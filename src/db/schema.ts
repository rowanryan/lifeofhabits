// Docs: https://www.instantdb.com/docs/modeling-data

import { type InstaQLEntity, i } from "@instantdb/react";

const _schema = i.schema({
    entities: {
        $files: i.entity({
            path: i.string().unique().indexed(),
            url: i.string(),
        }),

        $streams: i.entity({
            abortReason: i.string().optional(),
            clientId: i.string().unique().indexed(),
            done: i.boolean().optional(),
            size: i.number().optional(),
        }),

        $users: i.entity({
            email: i.string().unique().indexed().optional(),
            imageURL: i.string().optional(),
            type: i.string().optional(),
        }),

        habits: i.entity({
            description: i.string().optional(),
            name: i.string(),
            rrule: i.string(),
            userId: i.string().indexed(),
        }),
    },
    links: {
        $streams$files: {
            forward: {
                on: "$streams",
                has: "many",
                label: "$files",
            },
            reverse: {
                on: "$files",
                has: "one",
                label: "$stream",
                onDelete: "cascade",
            },
        },

        $usersLinkedPrimaryUser: {
            forward: {
                on: "$users",
                has: "one",
                label: "linkedPrimaryUser",
                onDelete: "cascade",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "linkedGuestUsers",
            },
        },

        habitsUser: {
            forward: {
                on: "habits",
                has: "one",
                label: "user",
                onDelete: "cascade",
            },
            reverse: {
                on: "$users",
                has: "many",
                label: "habits",
            },
        },
    },
    rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

// Types
type Habit = InstaQLEntity<_AppSchema, "habits", object, undefined, true>;

export type { AppSchema, Habit };
export default schema;
