import Link from "next/link";
import { Button } from "@/components/ui/button";

export type NavigationLinkProps = {
    label: string;
    href: string;
    isActive?: boolean;
    icon?: React.ReactNode;
};

export function NavigationLink({
    label,
    href,
    isActive,
    icon,
}: NavigationLinkProps) {
    return (
        <Button asChild variant={isActive ? "secondary" : "ghost"}>
            <Link href={href}>
                {icon}
                {label}
            </Link>
        </Button>
    );
}
