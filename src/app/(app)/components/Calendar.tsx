"use client";

import { isSameDay } from "date-fns";
import { type Locale as DateFnsLocale, enUS } from "date-fns/locale";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useLogStore } from "@/stores/useLogStore";

export type CalendarProps = {
    children: React.ReactNode;
};

const LOCALIZATIONS: Record<Locale, DateFnsLocale> = {
    en: enUS,
};

export function Calendar({ children }: CalendarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const locale = useLocale();

    const t = useTranslations();
    const currentDate = useLogStore((state) => state.currentDate);
    const setCurrentDate = useLogStore((state) => state.setCurrentDate);

    const today = new Date();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-fit">
                <DialogHeader>
                    <DialogTitle>
                        {t("Events.Actions.Calendar.Title")}
                    </DialogTitle>
                </DialogHeader>

                <Button
                    disabled={isSameDay(currentDate, today)}
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                        setCurrentDate(today);
                        setIsOpen(false);
                    }}
                >
                    {t("Common.RelativeDate.Today")}
                </Button>

                <CalendarComponent
                    locale={LOCALIZATIONS[locale]}
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => {
                        if (date) {
                            setCurrentDate(date);
                            setIsOpen(false);
                        }
                    }}
                    captionLayout="dropdown"
                    className="border rounded-lg"
                />
            </DialogContent>
        </Dialog>
    );
}
