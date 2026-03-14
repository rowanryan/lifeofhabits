import { useTranslations } from "next-intl";
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

export type DeleteHabitProps = {
    id: string;
    onDelete: () => void;
    children: React.ReactNode;
} & React.ComponentProps<typeof AlertDialog>;

export function DeleteHabit({
    id,
    children,
    onDelete,
    ...props
}: DeleteHabitProps) {
    const t = useTranslations("Habits");

    return (
        <AlertDialog {...props}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("Details.Delete.Title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("Details.Delete.Description")}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {t("Details.Delete.Cancel")}
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onDelete}>
                            {t("Details.Delete.Delete")}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
