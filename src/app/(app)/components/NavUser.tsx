"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { getFullName, getInitials } from "@/lib/utils";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
    ChevronsUpDownIcon,
    LogOutIcon,
    MonitorIcon,
    MoonIcon,
    SunIcon,
    Settings2Icon,
} from "lucide-react";

export type NavUserProps = {
    user: {
        id: string;
        firstName: string | null | undefined;
        lastName: string | null | undefined;
        emailAddress: string | null | undefined;
        imageUrl: string;
    };
};

export function NavUser({ user }: NavUserProps) {
    const { isMobile } = useSidebar();
    const { signOut } = useAuth();
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
                >
                    <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                            src={user.imageUrl}
                            alt={
                                getFullName(user.firstName, user.lastName) ??
                                "Unknown"
                            }
                        />
                        <AvatarFallback className="rounded-lg">
                            {getInitials(user.firstName, user.lastName) ?? "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                            {getFullName(user.firstName, user.lastName) ??
                                "Unknown"}
                        </span>
                        {user.emailAddress && (
                            <span className="truncate text-xs">
                                {user.emailAddress}
                            </span>
                        )}
                    </div>

                    <ChevronsUpDownIcon className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={user.imageUrl}
                                alt={
                                    getFullName(
                                        user.firstName,
                                        user.lastName
                                    ) ?? "Unknown"
                                }
                            />
                            <AvatarFallback className="rounded-lg">
                                {getInitials(user.firstName, user.lastName) ??
                                    "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {getFullName(user.firstName, user.lastName) ??
                                    "Unknown"}
                            </span>
                            {user.emailAddress && (
                                <span className="truncate text-xs">
                                    {user.emailAddress}
                                </span>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/settings">
                            <Settings2Icon />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        <MonitorIcon />
                        System
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        <SunIcon />
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <MoonIcon />
                        Dark
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
