"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import {
    AppShell,
    AppShellContent,
    AppShellHeader,
} from "@/features/app-shell";

export default function AppLayout({ children }: React.PropsWithChildren) {
    const segment = useSelectedLayoutSegment();

    return (
        <AppShell
            navigation={[
                {
                    label: "Home",
                    href: "/",
                    isActive: segment === null,
                },
            ]}
        >
            <AppShellHeader />
            <AppShellContent>{children}</AppShellContent>
        </AppShell>
    );
}
