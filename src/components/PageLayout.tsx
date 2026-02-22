"use client";

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
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

type PageTitleProps = {
    title: string;
    description?: string;
};

function PageTitle({
    title,
    description,
    className,
    ...props
}: PageTitleProps & React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col", className)} {...props}>
            <h2 className="text-xl @xl/layout:text-2xl font-semibold tracking-tight">
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

type PageBreadcrumbProps = {
    breadcrumbs: {
        label: string;
        href: string;
        isHidden?: boolean;
    }[];
};

function PageBreadcrumb({
    breadcrumbs,
    ...props
}: PageBreadcrumbProps & React.ComponentProps<typeof Breadcrumb>) {
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
                                <BreadcrumbPage>
                                    {lastBreadcrumb.label}
                                </BreadcrumbPage>
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
                        router.push(value);
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

            <div className="hidden @xl/sidemenu:block @xl/sidemenu:col-span-2 space-y-1">
                {sideMenuLinks.map((link) => (
                    <Button
                        asChild
                        key={link.href}
                        variant={link.isActive ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link
                            href={link.href}
                            className={cn(
                                !link.isActive && "text-muted-foreground",
                            )}
                        >
                            {link.label}
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
    PageTitleProps & PageBreadcrumbProps & PageSideMenuProps
> &
    React.ComponentProps<"div">;

function PageLayout({
    children,
    className,
    title,
    description,
    breadcrumbs,
    sideMenuLinks,
    ...props
}: React.PropsWithChildren<PageLayoutProps>) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />

                    <Separator orientation="vertical" className="mr-2" />

                    {breadcrumbs && (
                        <PageBreadcrumb breadcrumbs={breadcrumbs} />
                    )}
                </div>
            </header>

            <div
                className={cn(
                    "@container/layout flex flex-1 flex-col p-4 pt-0 container mx-auto",
                    className,
                )}
                {...props}
            >
                {title && (
                    <PageTitle
                        title={title}
                        description={description}
                        className="@xl/layout:mt-4 mb-4"
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
        </>
    );
}

export { PageTitle, PageBreadcrumb, PageSideMenu, PageLayout };
