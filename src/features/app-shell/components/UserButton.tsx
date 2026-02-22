"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
    LogOutIcon,
    MonitorIcon,
    MoonIcon,
    Settings2Icon,
    SunIcon,
} from "lucide-react";
import Link from "next/link";
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
import { cn, getFullName, getInitials } from "@/lib/utils";

export type UserButtonProps = {
    className?: string;
};

export function UserButton({ className }: UserButtonProps) {
    const { signOut } = useAuth();
    const { setTheme } = useTheme();
    const { user } = useUser();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className={cn("size-8 rounded-lg", className)}>
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
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
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
                                {getInitials(user.firstName, user.lastName) ??
                                    "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {getFullName(user.firstName, user.lastName) ??
                                    "Unknown"}
                            </span>
                            {user.primaryEmailAddress?.emailAddress && (
                                <span className="truncate text-xs">
                                    {user.primaryEmailAddress.emailAddress}
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
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
