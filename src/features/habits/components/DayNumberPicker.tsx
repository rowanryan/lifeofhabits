"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export type DayNumberPickerProps = {
    value: number;
    onChange: (value: number) => void;
    label: string;
};

export function DayNumberPicker({
    value,
    onChange,
    label,
}: DayNumberPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {value}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-fit">
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <Button
                            key={day}
                            variant={day === value ? "default" : "outline"}
                            size="icon"
                            onClick={() => {
                                onChange(day);
                                setIsOpen(false);
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
