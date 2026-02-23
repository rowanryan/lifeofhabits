import { cookies, headers } from "next/headers";

export const AVAILABLE_LOCALES = ["en"] as const;

export type Locale = (typeof AVAILABLE_LOCALES)[number];

function isValidLocale(locale: string): locale is Locale {
    return AVAILABLE_LOCALES.includes(locale as Locale);
}

export function getBrowserLocale(
    acceptLanguage: string | null | undefined
): string | null {
    if (!acceptLanguage) return null;

    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,nl;q=0.8")
    const languages = acceptLanguage
        .split(",")
        .map(lang => {
            const parts = lang.trim().split(";");
            const locale = parts[0];
            const q = parts[1] || "q=1";
            if (!locale) return null;
            const quality = parseFloat(q.replace("q=", ""));
            return { locale: locale.toLowerCase().split("-")[0], quality };
        })
        .filter(
            (item): item is { locale: string; quality: number } => item !== null
        )
        .sort((a, b) => b.quality - a.quality);

    // Find the first matching locale
    for (const { locale } of languages) {
        if (isValidLocale(locale)) {
            return locale;
        }
    }

    return null;
}

export async function getPreferredLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const headersList = await headers();

    // Priority: cookie > browser locale > default
    const cookieLocale = cookieStore.get("locale")?.value;
    const acceptLanguage = headersList.get("accept-language");
    const browserLocale = getBrowserLocale(acceptLanguage ?? null);

    if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale;
    }

    if (browserLocale && isValidLocale(browserLocale)) {
        return browserLocale;
    }

    return "en";
}
