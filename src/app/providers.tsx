import { enUS } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getPreferredLocale } from "@/i18n/utils/locale";

const LOCALIZATIONS = {
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
    const locale = await getPreferredLocale();

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
                {children}
            </ThemeProvider>
        </ClerkProvider>
    );
}
