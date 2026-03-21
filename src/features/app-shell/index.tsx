"use client";

import { EllipsisIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { useIsMobile } from "@/hooks/use-mobile";
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
                    "flex flex-col min-h-svh bg-appshell @container/shell",
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
            className={cn("flex flex-1 md:pb-2 md:px-2 pt-0", className)}
            {...props}
        >
            <div className="bg-background pb-16 flex-1 md:rounded-xl md:border-t md:border-x md:shadow-sm">
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
    const isMobile = useIsMobile();

    if (isMobile) {
        const maxFirstThreeLinks = navigationLinks.slice(0, 3);

        return (
            <div className="fixed bottom-4 z-50 inset-x-0 w-fit gap-0 mx-auto rounded-full backdrop-blur-lg bg-appshell/50 flex items-center justify-between py-1 px-1 shadow-sm border border-border/50">
                {maxFirstThreeLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center rounded-4xl py-2 px-6 gap-1",
                            link.isActive &&
                                "bg-foreground/5 border-2 border-border/50",
                        )}
                    >
                        {link.icon && <link.icon className="size-5" />}
                    </Link>
                ))}
                <MobileMenu>
                    <div className="flex flex-col items-center rounded-4xl py-2 px-6 gap-1">
                        <EllipsisIcon className="size-5" />
                    </div>
                </MobileMenu>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "sticky max-md:hidden top-0 inset-x-0 z-50 transition-all duration-200 ease-out",
                isScrolled && "px-2 md:px-6 pt-2",
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

                    <nav className="hidden items-center gap-1 md:flex">
                        {navigationLinks.map((link) => (
                            <NavigationLink key={link.href} {...link} />
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <UserButton className="hidden md:block" />

                    <MobileMenu>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="block md:hidden -mr-2"
                        >
                            <MenuIcon />
                        </Button>
                    </MobileMenu>
                </div>
            </header>
        </div>
    );
}

export { AppShell, AppShellHeader, AppShellContent };
