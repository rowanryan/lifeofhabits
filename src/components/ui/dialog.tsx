"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NestedDialogContextValue = {
    depth: number;
    registerChild: () => void;
    unregisterChild: () => void;
    hasNestedOpen: boolean;
};

const NestedDialogContext = React.createContext<NestedDialogContextValue>({
    depth: 0,
    registerChild: () => {},
    unregisterChild: () => {},
    hasNestedOpen: false,
});

function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    const parent = React.useContext(NestedDialogContext);
    const [childCount, setChildCount] = React.useState(0);

    React.useEffect(() => {
        if (props.open) {
            parent.registerChild();
            return () => parent.unregisterChild();
        }
    }, [props.open, parent]);

    const value = React.useMemo(
        () => ({
            depth: parent.depth + 1,
            registerChild: () => setChildCount((c) => c + 1),
            unregisterChild: () => setChildCount((c) => c - 1),
            hasNestedOpen: childCount > 0,
        }),
        [parent.depth, childCount],
    );

    return (
        <NestedDialogContext.Provider value={value}>
            <DialogPrimitive.Root data-slot="dialog" {...props} />
        </NestedDialogContext.Provider>
    );
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50",
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    style,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}) {
    const { depth, hasNestedOpen } = React.useContext(NestedDialogContext);
    const isNested = depth > 1;

    return (
        <DialogPortal>
            {!isNested && <DialogOverlay />}
            <DialogPrimitive.Content
                data-slot="dialog-content"
                data-nested-dialog-open={hasNestedOpen ? "" : undefined}
                style={
                    {
                        "--nested-dialogs": hasNestedOpen ? 1 : 0,
                        ...style,
                    } as React.CSSProperties
                }
                className={cn(
                    "bg-background ring-foreground/5 grid max-w-[calc(100%-2rem)] gap-6 rounded-4xl p-6 text-sm ring-1 sm:max-w-md fixed left-1/2 z-50 w-full -translate-x-1/2",
                    "top-[calc(50%-1.25rem*var(--nested-dialogs))] -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))]",
                    "transition-all duration-150",
                    "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 duration-100",
                    "data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:rounded-[inherit] data-nested-dialog-open:after:bg-black/5",
                    className,
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close data-slot="dialog-close" asChild>
                        <Button
                            variant="ghost"
                            className="absolute top-4 right-4"
                            size="icon-sm"
                        >
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("gap-2 flex flex-col", className)}
            {...props}
        />
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "gap-2 flex flex-col-reverse sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close asChild>
                    <Button variant="outline">Close</Button>
                </DialogPrimitive.Close>
            )}
        </div>
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-base leading-none font-medium", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
                className,
            )}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
