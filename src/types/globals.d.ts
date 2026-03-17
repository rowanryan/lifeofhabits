import type { AVAILABLE_LOCALES } from "@/i18n/request";
import type messages from "../../messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Messages: typeof messages;
        Locale: (typeof AVAILABLE_LOCALES)[number];
    }
}

declare global {
    interface CustomJwtSessionClaims {
        role?: "admin" | "user";
        firstName?: string;
        lastName?: string;
        priamryEmailAddress?: string;
    }
}
