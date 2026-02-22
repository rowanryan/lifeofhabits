"use client";

import { createContext, useContext } from "react";
import type { NavigationLinkProps } from "../components/NavigationLink";

export type AppShellContextType = {
    navigationLinks: NavigationLinkProps[];
};

export const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
    const context = useContext(AppShellContext);
    if (!context) {
        throw new Error("useAppShell must be used within a AppShellProvider");
    }
    return context;
}

export type AppShellProviderProps =
    React.PropsWithChildren<AppShellContextType>;

export function AppShellProvider({
    children,
    navigationLinks,
}: AppShellProviderProps) {
    return (
        <AppShellContext.Provider value={{ navigationLinks }}>
            {children}
        </AppShellContext.Provider>
    );
}
