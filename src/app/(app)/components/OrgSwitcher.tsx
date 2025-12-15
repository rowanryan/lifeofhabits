"use client";

import * as React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    AudioWaveformIcon,
    ChevronsUpDown,
    CommandIcon,
    GalleryVerticalEndIcon,
    Plus,
} from "lucide-react";

const dummyOrgs = [
    {
        name: "Acme Inc",
        logo: GalleryVerticalEndIcon,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveformIcon,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: CommandIcon,
        plan: "Free",
    },
];

export function OrgSwitcher() {
    const { isMobile } = useSidebar();
    const [activeOrg, setActiveOrg] = React.useState(dummyOrgs[0]);

    if (!activeOrg) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full">
                                <activeOrg.logo className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {activeOrg.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeOrg.plan}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Organizations
                        </DropdownMenuLabel>
                        {dummyOrgs.map((org, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => setActiveOrg(org)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <org.logo className="size-3.5 shrink-0" />
                                </div>
                                {org.name}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">
                                Add organization
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
