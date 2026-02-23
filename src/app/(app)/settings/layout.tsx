"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";

export default function SettingsLayout({ children }: React.PropsWithChildren) {
    const segment = useSelectedLayoutSegment();

    return (
        <PageLayout
            title="Settings"
            sideMenuLinks={[
                {
                    label: "General",
                    href: "/settings",
                    isActive: segment === null,
                },
                {
                    label: "Account",
                    href: "/settings/account",
                    isActive: segment === "account",
                },
            ]}
        >
            {children}
        </PageLayout>
    );
}
