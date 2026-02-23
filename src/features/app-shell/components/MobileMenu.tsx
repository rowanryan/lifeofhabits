"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ChevronRightIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { getFullName, getInitials } from "@/lib/utils";
import { useAppShell } from "../providers/AppShellProvider";

export type MobileMenuProps = {
    className?: string;
};

export function MobileMenu({ className }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const previousPathnameRef = useRef(pathname);
    const { navigationLinks } = useAppShell();
    const { user } = useUser();
    const { signOut } = useAuth();

    useEffect(() => {
        if (previousPathnameRef.current !== pathname) {
            setIsOpen(false);
            previousPathnameRef.current = pathname;
        }
    }, [pathname]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={className}>
                    <MenuIcon />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="bottom"
                className="h-full! max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 px-3">
                    {navigationLinks.map((link) => (
                        <Button
                            key={link.href}
                            asChild
                            variant={link.isActive ? "secondary" : "ghost"}
                            className="w-full justify-start"
                        >
                            <Link href={link.href}>
                                {link.icon}
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </nav>

                <Separator className="my-4" />

                {user && (
                    <div className="px-4 space-y-4">
                        <Link
                            href="/settings/account"
                            className="flex items-center group gap-2 text-left text-sm"
                        >
                            <Avatar className="size-8 rounded-lg">
                                <AvatarImage
                                    src={user.imageUrl}
                                    alt={
                                        getFullName(
                                            user.firstName,
                                            user.lastName,
                                        ) ?? "Unknown"
                                    }
                                />
                                <AvatarFallback className="rounded-lg">
                                    {getInitials(
                                        user.firstName,
                                        user.lastName,
                                    ) ?? "?"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {getFullName(
                                        user.firstName,
                                        user.lastName,
                                    ) ?? "Unknown"}
                                </span>
                                {user.primaryEmailAddress?.emailAddress && (
                                    <span className="truncate text-xs">
                                        {user.primaryEmailAddress.emailAddress}
                                    </span>
                                )}
                            </div>

                            <ChevronRightIcon className="shrink-0 size-5" />
                        </Link>

                        <Button
                            variant="destructive"
                            className="w-full justify-start"
                            onClick={() => signOut({ redirectUrl: "/" })}
                        >
                            <LogOutIcon />
                            Sign out
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
