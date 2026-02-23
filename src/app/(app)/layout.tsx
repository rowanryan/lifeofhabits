"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import {
    AppShell,
    AppShellContent,
    AppShellHeader,
} from "@/features/app-shell";

export default function AppLayout({ children }: React.PropsWithChildren) {
    const segments = useSelectedLayoutSegments();

    return (
        <AppShell
            navigation={[
                {
                    label: "Home",
                    href: "/",
                    isActive: segments.length === 0,
                },
                {
                    label: "Settings",
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
