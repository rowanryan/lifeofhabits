"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useAppShell } from "../providers/AppShellProvider";

export type MobileMenuProps = React.ComponentProps<typeof Sheet>;

export function MobileMenu(props: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { navigationLinks } = useAppShell();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen} {...props}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
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

                <nav className="flex flex-col gap-2 px-3">
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
            </SheetContent>
        </Sheet>
    );
}
