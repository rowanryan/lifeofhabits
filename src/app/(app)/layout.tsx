"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    AppShell,
    AppShellContent,
    AppShellHeader,
} from "@/features/app-shell";

export default function AppLayout({ children }: React.PropsWithChildren) {
    const t = useTranslations("AppShell.Navigation");
    const segments = useSelectedLayoutSegments();

    return (
        <AppShell
            navigation={[
                {
                    label: t("Home"),
                    href: "/",
                    isActive: segments.length === 0,
                },
                {
                    label: t("Settings"),
                    href: "/settings",
                    isActive: segments.at(0) === "settings",
                },
            ]}
        >
            <AppShellHeader />
            <AppShellContent>{children}</AppShellContent>
        </AppShell>
    );
}
