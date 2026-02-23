import type { AVAILABLE_LOCALES } from "@/i18n/utils/locale";
import type messages from "../../messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Messages: typeof messages;
        Locale: (typeof AVAILABLE_LOCALES)[number];
    }
}
