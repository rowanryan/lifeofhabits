"use client";

import { useUser } from "@clerk/nextjs";
import { AppSidebarItem } from "./AppSidebarItem";
import { NavUser } from "./NavUser";
import { OrgSwitcher } from "./OrgSwitcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrgSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <AppSidebarItem
                            type="link"
                            label="Dashboard"
                            href="/"
                            icon={<LayoutDashboardIcon />}
                        />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {user && (
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <NavUser
                                user={{
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    emailAddress:
                                        user.primaryEmailAddress?.emailAddress,
                                    imageUrl: user.imageUrl,
                                }}
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}

            <SidebarRail />
        </Sidebar>
    );
}
