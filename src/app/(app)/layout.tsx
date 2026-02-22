import {
    AppShell,
    AppShellContent,
    AppShellHeader,
} from "@/components/AppShell";

export default function AppLayout({ children }: React.PropsWithChildren) {
    return (
        <AppShell>
            <AppShellHeader></AppShellHeader>
            <AppShellContent>{children}</AppShellContent>
        </AppShell>
    );
}
