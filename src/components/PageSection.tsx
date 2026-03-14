import { cn } from "@/lib/utils";

type PageSectionTitleProps = {
    title: string;
    description?: string;
};

function PageSectionTitle({
    title,
    description,
    ...props
}: PageSectionTitleProps & React.ComponentProps<"div">) {
    return (
        <div {...props}>
            <h2 className="font-semibold text-sm">{title}</h2>
            {description && (
                <p className="text-sm text-muted-foreground text-pretty">
                    {description}
                </p>
            )}
        </div>
    );
}

type PageSectionProps = Partial<PageSectionTitleProps> &
    React.ComponentProps<"div"> & {
        horizontal?: boolean;
        toolbar?: React.ReactNode;
    };

function PageSection({
    title,
    description,
    children,
    className,
    horizontal = false,
    toolbar,
    ...props
}: React.PropsWithChildren<PageSectionProps>) {
    return (
        <div className={cn("@container/page-section", className)} {...props}>
            <div
                className={cn(
                    horizontal &&
                        "flex flex-col gap-4 @2xl/page-section:flex-row @2xl/page-section:gap-8",
                )}
            >
                {title && (
                    <div
                        className={cn(
                            "flex flex-col justify-between gap-x-4 gap-y-2 @xl/page-section:flex-row @xl/page-section:items-center",
                            horizontal
                                ? "shrink-0 @2xl/page-section:w-96 @2xl/page-section:flex-col @2xl/page-section:items-start"
                                : "mb-2",
                        )}
                    >
                        <PageSectionTitle
                            title={title}
                            description={description}
                            className="px-1"
                        />

                        {toolbar}
                    </div>
                )}

                <div className={cn(horizontal && "flex-1")}>{children}</div>
            </div>
        </div>
    );
}

export { PageSection, PageSectionTitle };
