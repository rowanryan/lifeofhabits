"use client";

import {
    type DateTimeFormatOptions,
    useFormatter,
    useTranslations,
} from "next-intl";

export function useRelativeDate() {
    const t = useTranslations("Common.RelativeDate");
    const localizedFormatter = useFormatter();

    const format = (date: Date, options?: DateTimeFormatOptions) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return t("Today");
        } else if (diffDays === 1) {
            return t("Yesterday");
        } else if (diffDays === -1) {
            return t("Tomorrow");
        } else {
            return localizedFormatter.dateTime(date, options);
        }
    };

    return format;
}
