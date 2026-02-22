import { cn } from "@/lib/utils";

type AppShellProps = React.ComponentProps<"div">;

function AppShell({ children, className, ...props }: AppShellProps) {
    return (
        <div
            className={cn(
                "flex flex-col min-h-screen bg-appshell @container/shell",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

type AppShellHeaderProps = React.ComponentProps<"header">;

function AppShellHeader({
    children,
    className,
    ...props
}: AppShellHeaderProps) {
    return (
        <header
            className={cn("flex items-center justify-between h-14", className)}
            {...props}
        >
            {children}
        </header>
    );
}

type AppShellContentProps = React.ComponentProps<"main">;

function AppShellContent({
    children,
    className,
    ...props
}: AppShellContentProps) {
    return (
        <main
            className={cn("flex flex-1 @xl/shell:p-2 pt-0", className)}
            {...props}
        >
            <div className="bg-background flex-1 rounded-t-xl @xl/shell:rounded-xl border @xl/shell:shadow-sm">
                {children}
            </div>
        </main>
    );
}

export { AppShell, AppShellHeader, AppShellContent };
