"use client";

import { env } from "@/env";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./components/MobileMenu";
import type { NavigationLinkProps } from "./components/NavigationLink";
import { NavigationLink } from "./components/NavigationLink";
import { UserButton } from "./components/UserButton";
import { AppShellProvider, useAppShell } from "./providers/AppShellProvider";

type AppShellProps = React.ComponentProps<"div"> & {
    navigation: NavigationLinkProps[];
};

function AppShell({
    children,
    className,
    navigation,
    ...props
}: AppShellProps) {
    return (
        <AppShellProvider navigationLinks={navigation}>
            <div
                className={cn(
                    "flex flex-col min-h-screen bg-appshell @container/shell",
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </AppShellProvider>
    );
}

type AppShellContentProps = React.ComponentProps<"main">;

function AppShellContent({
    children,
    className,
    ...props
}: AppShellContentProps) {
    return (
        <main
            className={cn(
                "flex flex-1 @xl/shell:pb-2 @xl/shell:px-2 pt-0",
                className,
            )}
            {...props}
        >
            <div className="bg-background flex-1 rounded-t-xl @xl/shell:rounded-xl border @xl/shell:shadow-sm">
                {children}
            </div>
        </main>
    );
}

type AppShellHeaderProps = {
    className?: string;
};

function AppShellHeader({ className }: AppShellHeaderProps) {
    const { navigationLinks } = useAppShell();
    const isScrolled = useIsScrolled();

    return (
        <div
            className={cn(
                "sticky top-0 inset-x-0 z-50 transition-all duration-200 ease-out",
                isScrolled && "px-2 @xl/shell:px-6 pt-2",
            )}
        >
            <header
                className={cn(
                    "flex bg-appshell/50 backdrop-blur-lg items-center px-4 justify-between h-14",
                    isScrolled &&
                        "rounded-full shadow-sm border border-border/50",
                    className,
                )}
            >
                <div className="flex items-center gap-4">
                    <p className="font-semibold">{env.NEXT_PUBLIC_APP_NAME}</p>

                    <nav className="hidden items-center gap-1 @xl/shell:flex">
                        {navigationLinks.map((link) => (
                            <NavigationLink key={link.href} {...link} />
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <UserButton className="hidden @xl/shell:block" />

                    <MobileMenu className="block @xl/shell:hidden -mr-2" />
                </div>
            </header>
        </div>
    );
}

export { AppShell, AppShellHeader, AppShellContent };
