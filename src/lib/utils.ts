import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFullName(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
) {
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    } else if (firstName) {
        return firstName;
    } else if (lastName) {
        return lastName;
    }

    return undefined;
}

export function getInitials(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
) {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
        return firstName[0];
    } else if (lastName) {
        return lastName[0];
    }

    return undefined;
}

export function getBaseUrl(options?: {
    useFullUrl?: boolean;
    useVercelBranchUrl?: boolean;
}) {
    // If we're in the browser and don't need full URL, return empty string
    if (typeof window !== "undefined" && !options?.useFullUrl) return "";

    // If we're in the browser, detect the current URL
    if (typeof window !== "undefined") {
        const currentUrl = window.location;

        // If it's localhost with a port, use that
        if (
            currentUrl.hostname === "localhost" ||
            currentUrl.hostname === "127.0.0.1"
        ) {
            return `${currentUrl.protocol}//${currentUrl.host}`;
        }

        // Otherwise, use the apex domain and any subdomains
        return `${currentUrl.protocol}//${currentUrl.host}`;
    }

    // Server-side fallback to environment variables
    if (options?.useVercelBranchUrl && process.env.VERCEL_BRANCH_URL) {
        return `https://${process.env.VERCEL_BRANCH_URL}`;
    }

    // Handle BASE_URL - skip if it's just "/" or empty string (invalid for server-side URL construction)
    if (process.env.BASE_URL && process.env.BASE_URL !== "/") {
        return process.env.BASE_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Default fallback for server-side
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function parseNumberOrNull(value: string): number | null {
    if (value === "") return null;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
}
