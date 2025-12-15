import { PageLayout } from "@/components/PageLayout";

export default function SettingsLayout({ children }: React.PropsWithChildren) {
    return (
        <PageLayout
            title="Settings"
            breadcrumbs={[{ label: "Settings", href: "/settings" }]}
        >
            {children}
        </PageLayout>
    );
}
