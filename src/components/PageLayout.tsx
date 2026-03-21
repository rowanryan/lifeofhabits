"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

type PageTitleProps = {
    title: string;
    prefix?: string;
    description?: string;
};

function PageTitle({
    title,
    prefix,
    description,
    className,
    ...props
}: PageTitleProps & React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col", className)} {...props}>
            {prefix && (
                <p className="text-muted-foreground font-semibold text-sm mb-1">
                    {prefix}
                </p>
            )}

            <h2 className="text-2xl @xl/layout:text-3xl font-semibold tracking-tight">
                {title}
            </h2>

            {description && (
                <p className="text-muted-foreground text-pretty">
                    {description}
                </p>
            )}
        </div>
    );
}

type PageBreadcrumbsProps = {
    breadcrumbs: {
        label: string;
        href: string;
        isHidden?: boolean;
    }[];
};

function PageBreadcrumbs({
    breadcrumbs,
    ...props
}: PageBreadcrumbsProps & React.ComponentProps<typeof Breadcrumb>) {
    const isMobile = useIsMobile();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const visibleBreadcrumbs = breadcrumbs.filter((bc) => !bc.isHidden);
    const lastBreadcrumb = visibleBreadcrumbs[visibleBreadcrumbs.length - 1];

    if (isMobile && lastBreadcrumb) {
        return (
            <Breadcrumb {...props}>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <DropdownMenu
                            open={isDropdownOpen}
                            onOpenChange={setIsDropdownOpen}
                        >
                            <DropdownMenuTrigger
                                asChild
                                disabled={visibleBreadcrumbs.length === 1}
                            >
                                <Button variant="secondary" size="sm">
                                    {lastBreadcrumb.label}
                                    <ChevronDownIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {visibleBreadcrumbs.map((bc) => (
                                    <DropdownMenuItem key={bc.href}>
                                        <BreadcrumbLink
                                            asChild
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            <Link href={bc.href}>
                                                {bc.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb {...props}>
            <BreadcrumbList>
                {visibleBreadcrumbs.map((bc, index) => (
                    <React.Fragment key={bc.href}>
                        <BreadcrumbItem>
                            {index < visibleBreadcrumbs.length - 1 ? (
                                <BreadcrumbLink asChild>
                                    <Link href={bc.href}>{bc.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < visibleBreadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

type PageSideMenuProps = {
    sideMenuLinks: {
        label: string;
        href: string;
        isActive: boolean;
        target?: "_blank" | "_self" | "_parent" | "_top";
        suffix?: React.ReactNode;
    }[];
};

function PageSideMenu({
    sideMenuLinks,
    className,
    children,
    ...props
}: PageSideMenuProps & React.ComponentProps<"div">) {
    const router = useRouter();
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);

    const activeLinkHref = React.useMemo(() => {
        return sideMenuLinks.find((link) => link.isActive)?.href;
    }, [sideMenuLinks]);

    return (
        <div
            className={cn(
                "@container/sidemenu grid grid-cols-12 gap-4",
                className,
            )}
            {...props}
        >
            <div className="col-span-12 @xl/sidemenu:hidden">
                <Select
                    open={isSelectOpen}
                    onOpenChange={setIsSelectOpen}
                    value={activeLinkHref}
                    onValueChange={(value) => {
                        setIsSelectOpen(false);
                        const link = sideMenuLinks.find(
                            (link) => link.href === value,
                        );

                        if (link) {
                            if (link.target === "_blank") {
                                window.open(link.href, "_blank");
                            } else {
                                router.push(link.href);
                            }
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sections</SelectLabel>
                            {sideMenuLinks.map((link) => (
                                <SelectItem key={link.href} value={link.href}>
                                    {link.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="hidden sticky top-20 self-start @xl/sidemenu:block @xl/sidemenu:col-span-2 space-y-1">
                {sideMenuLinks.map((link) => (
                    <Button
                        asChild
                        key={link.href}
                        variant={link.isActive ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link
                            href={link.href}
                            target={link.target}
                            className={cn(
                                !link.isActive && "text-muted-foreground",
                            )}
                        >
                            <span>{link.label}</span>
                            {link.suffix && (
                                <span className="ml-auto">{link.suffix}</span>
                            )}
                        </Link>
                    </Button>
                ))}
            </div>

            <div className="col-span-12 @xl/sidemenu:col-span-10">
                {children}
            </div>
        </div>
    );
}

type PageLayoutProps = Partial<
    PageTitleProps & PageBreadcrumbsProps & PageSideMenuProps
> &
    React.ComponentProps<"div">;

function PageLayout({
    children,
    className,
    title,
    prefix,
    description,
    breadcrumbs,
    sideMenuLinks,
    ...props
}: React.PropsWithChildren<PageLayoutProps>) {
    return (
        <div
            className={cn(
                "@container/layout flex flex-1 flex-col p-4 md:pt-6 container mx-auto",
                className,
            )}
            {...props}
        >
            {breadcrumbs && (
                <PageBreadcrumbs breadcrumbs={breadcrumbs} className="mb-3" />
            )}

            {title && (
                <PageTitle
                    title={title}
                    prefix={prefix}
                    description={description}
                    className="mb-4 @xl/layout:mt-2"
                />
            )}

            {sideMenuLinks ? (
                <PageSideMenu sideMenuLinks={sideMenuLinks}>
                    {children}
                </PageSideMenu>
            ) : (
                children
            )}
        </div>
    );
}

export { PageTitle, PageBreadcrumbs, PageSideMenu, PageLayout };
