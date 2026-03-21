// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
    habits: {
        allow: {
            $default: "auth.id != null && auth.id == data.userId",
        },
    },
} satisfies InstantRules;

export default rules;
