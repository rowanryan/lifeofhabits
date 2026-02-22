"use client";

import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
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
    const { user } = useUser();

    return (
        <header
            className={cn(
                "flex items-center pt-1 px-4 justify-between h-14",
                className,
            )}
        >
            <nav className="flex -ml-2 items-center gap-1">
                {navigationLinks.map((link) => (
                    <NavigationLink key={link.href} {...link} />
                ))}
            </nav>

            {user ? (
                <UserButton
                    user={{
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        emailAddress: user.primaryEmailAddress?.emailAddress,
                        imageUrl: user.imageUrl,
                    }}
                />
            ) : (
                <UserButton
                    user={{
                        id: "",
                        firstName: "John",
                        lastName: "Doe",
                        emailAddress: "john.doe@example.com",
                        imageUrl: "https://avatar.vercel.sh/johndoe?rounded=60",
                    }}
                />
            )}
        </header>
    );
}

export { AppShell, AppShellHeader, AppShellContent };
