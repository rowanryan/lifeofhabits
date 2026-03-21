"use client";

import { CalendarSyncIcon, HomeIcon, Settings2Icon } from "lucide-react";
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
                    icon: HomeIcon,
                },
                {
                    label: t("Habits"),
                    href: "/habits",
                    isActive: segments.at(0) === "habits",
                    icon: CalendarSyncIcon,
                },
                {
                    label: t("Settings"),
                    href: "/settings",
                    isActive: segments.at(0) === "settings",
                    icon: Settings2Icon,
                },
            ]}
        >
            <AppShellHeader />
            <AppShellContent>{children}</AppShellContent>
        </AppShell>
    );
}
