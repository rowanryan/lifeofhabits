"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageLayout } from "@/components/PageLayout";

export default function SettingsLayout({ children }: React.PropsWithChildren) {
    const t = useTranslations("Settings");
    const segment = useSelectedLayoutSegment();

    return (
        <PageLayout
            title={t("Title")}
            sideMenuLinks={[
                {
                    label: t("SideMenu.General"),
                    href: "/settings",
                    isActive: segment === null,
                },
                {
                    label: t("SideMenu.Account"),
                    href: "/settings/account",
                    isActive: segment === "account",
                },
                {
                    label: t("SideMenu.Billing"),
                    href: "/settings/billing",
                    target: "_blank",
                    isActive: false,
                    suffix: <ExternalLinkIcon className="size-4" />,
                },
            ]}
        >
            {children}
        </PageLayout>
    );
}
