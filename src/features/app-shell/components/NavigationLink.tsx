import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type NavigationLinkProps = {
    label: string;
    href: string;
    isActive?: boolean;
    icon?: LucideIcon;
};

export function NavigationLink({
    label,
    href,
    isActive,
    icon: Icon,
}: NavigationLinkProps) {
    return (
        <Button asChild variant={isActive ? "secondary" : "ghost"}>
            <Link href={href}>
                {Icon && <Icon />}
                {label}
            </Link>
        </Button>
    );
}
