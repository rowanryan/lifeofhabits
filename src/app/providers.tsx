import { enUS } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { type Locale, NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const LOCALIZATIONS: Record<Locale, typeof enUS> = {
    en: enUS,
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextIntlClientProvider>
            <LocalizedProviders>{children}</LocalizedProviders>
        </NextIntlClientProvider>
    );
}

async function LocalizedProviders({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();

    return (
        <ClerkProvider
            localization={LOCALIZATIONS[locale]}
            appearance={{
                theme: shadcn,
                variables: {
                    colorBackground: "var(--background)",
                },
                elements: {
                    cardBox: {
                        boxShadow: "none",
                    },
                    footer: {
                        backgroundColor: "var(--background)",
                    },
                    footerActionLink: {
                        color: "var(--foreground)",
                        "&:hover": {
                            color: "var(--foreground)",
                        },
                    },
                },
            }}
        >
            <ThemeProvider
                enableSystem
                disableTransitionOnChange
                attribute="class"
                defaultTheme="system"
            >
                <QueryProvider>{children}</QueryProvider>
            </ThemeProvider>
        </ClerkProvider>
    );
}
