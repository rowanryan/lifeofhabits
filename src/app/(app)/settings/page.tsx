"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Page() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="space-y-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                        Choose your preferred theme for the application.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                        >
                            <MonitorIcon /> System
                        </Button>
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                        >
                            <SunIcon /> Light
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                        >
                            <MoonIcon /> Dark
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
