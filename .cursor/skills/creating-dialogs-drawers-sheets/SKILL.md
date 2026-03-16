---
name: creating-dialogs-drawers-sheets
description: Create modal components using Dialog, Drawer, Sheet, or AlertDialog with proper structure, controlled state, and TypeScript props. Use when building popups, modals, side panels, confirmation dialogs, or overlay components.
---

# Creating Dialogs, Drawers, and Sheets

This project uses shadcn/ui-style modal components built on Radix UI (Dialog, Sheet) and Vaul (Drawer).

## Component Selection

| Component | Use Case |
|-----------|----------|
| **Dialog** | Centered modal for forms, confirmations, focused interactions |
| **AlertDialog** | Confirmation dialogs with cancel/confirm actions |
| **Drawer** | Mobile-friendly sliding panel (supports swipe gestures via Vaul) |
| **Sheet** | Side panel for navigation, settings, or supplementary content |

## Props Type Pattern

Always extend the base component's props and use `React.PropsWithChildren` for trigger children:

```tsx
export type MyComponentProps = React.PropsWithChildren<{
    id: string;
    name: string;
    description: string | null;
}> & React.ComponentProps<typeof Drawer>;
```

This pattern:
- Accepts `children` for the trigger element
- Spreads remaining props to the root component (enables `open`, `onOpenChange` from parent)

## Controlled State Pattern

Use `useState` for internal open/close control:

```tsx
const [isOpen, setIsOpen] = useState(false);

return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {/* ... */}
    </Drawer>
);
```

## Component Structure

### Drawer Example

```tsx
import { useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type MyDrawerProps = React.PropsWithChildren<{
    title: string;
    description?: string;
}> & React.ComponentProps<typeof Drawer>;

export function MyDrawer({
    title,
    description,
    children,
    ...props
}: MyDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction={isMobile ? "bottom" : "right"}
            {...props}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className={cn(isMobile && "h-full")}>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription>{description}</DrawerDescription>
                    )}
                </DrawerHeader>

                {/* Content must be wrapped with px-4 padding */}
                <div className={cn("px-4", isMobile && "px-6")}>
                    {/* Your content here */}
                </div>

                <DrawerFooter>
                    <Button>Primary Action</Button>
                    <DrawerClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
```

### Dialog Example

```tsx
import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type MyDialogProps = React.PropsWithChildren<{
    title: string;
    description?: string;
}> & React.ComponentProps<typeof Dialog>;

export function MyDialog({
    title,
    description,
    children,
    ...props
}: MyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                {/* Dialog content goes here */}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

### AlertDialog Example (Confirmation)

```tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ConfirmActionProps = {
    onConfirm: () => void;
    children: React.ReactNode;
} & React.ComponentProps<typeof AlertDialog>;

export function ConfirmAction({
    children,
    onConfirm,
    ...props
}: ConfirmActionProps) {
    return (
        <AlertDialog {...props}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onConfirm}>
                            Confirm
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
```

## Key Rules

1. **Trigger**: Always use `asChild` prop on `*Trigger` components to render children directly
2. **Drawer content padding**: Wrap content in `<div className={cn("px-4", isMobile && "px-6")}>` 
3. **Close buttons**: Use `*Close` with `asChild` to make any button close the modal
4. **Responsive drawers**: Use `useIsMobile()` hook to set `direction="bottom"` on mobile, `"right"` on desktop
5. **Props spreading**: Always spread `...props` to the root component for external control

## Import Paths

```tsx
import { Dialog, ... } from "@/components/ui/dialog";
import { Drawer, ... } from "@/components/ui/drawer";
import { Sheet, ... } from "@/components/ui/sheet";
import { AlertDialog, ... } from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
```
