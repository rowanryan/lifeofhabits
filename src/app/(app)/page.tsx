import { PageLayout } from "@/components/PageLayout";

export default function Page() {
    return (
        <PageLayout
            title="Dashboard"
            description="Welcome to the dashboard"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
        ></PageLayout>
    );
}
