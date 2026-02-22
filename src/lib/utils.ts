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
