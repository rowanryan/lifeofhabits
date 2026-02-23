import { getRequestConfig } from "next-intl/server";
import { getPreferredLocale } from "./utils/locale";

export default getRequestConfig(async () => {
    const locale = await getPreferredLocale();

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
