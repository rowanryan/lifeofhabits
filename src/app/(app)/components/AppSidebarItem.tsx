"use client";

import Link from "next/link";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

export type AppSidebarLink = {
    type: "link";
    label: string;
    icon: React.ReactNode;
    href: string;
};

export type AppSidebarDropdown = {
    type: "dropdown";
    label: string;
    icon: React.ReactNode;
    links: Omit<AppSidebarLink, "type" | "icon">[];
};

export type AppSidebarItemProps = AppSidebarLink | AppSidebarDropdown;

export function AppSidebarItem(props: AppSidebarItemProps) {
    if (props.type === "dropdown") {
        return (
            <Collapsible asChild className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={props.label}>
                            {props.icon}
                            <span>{props.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {props.links.map((subItem, index) => (
                                <SidebarMenuSubItem key={index}>
                                    <SidebarMenuSubButton asChild>
                                        <Link href={subItem.href}>
                                            <span>{subItem.label}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link href={props.href}>
                    {props.icon}
                    <span>{props.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
