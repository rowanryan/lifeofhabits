"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function ThemeSelector() {
    const t = useTranslations("Settings.General.ThemeSelector");
    const { setTheme, theme } = useTheme();

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>{t("Title")}</CardTitle>
                <CardDescription>{t("Description")}</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={theme === "system" ? "default" : "outline"}
                        onClick={() => setTheme("system")}
                    >
                        <MonitorIcon /> {t("Options.System")}
                    </Button>
                    <Button
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                    >
                        <SunIcon /> {t("Options.Light")}
                    </Button>
                    <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                    >
                        <MoonIcon /> {t("Options.Dark")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
