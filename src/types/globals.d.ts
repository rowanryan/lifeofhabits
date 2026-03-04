import type { AVAILABLE_LOCALES } from "@/i18n/utils/locale";
import type messages from "../../messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Messages: typeof messages;
        Locale: (typeof AVAILABLE_LOCALES)[number];
    }
}

interface UserData {
    role?: "admin" | "user";
}

declare global {
    interface CustomJwtSessionClaims extends UserData {}

    interface UserPublicMetadata extends UserData {}

    interface UserPrivateMetadata {
        internalCustomerId?: string;
        stripeCustomerId?: string;
    }
}
