type TranslationFunction = (
    key: string,
    values?: Record<string, unknown>,
) => string;

type ZodIssue = {
    code: string;
    input?: unknown;
    expected?: string;
    origin?: string;
    minimum?: number | bigint;
    maximum?: number | bigint;
    format?: string;
    message?: string;
    divisor?: number;
    keys?: string[];
};

export function createZodErrorMap(t: TranslationFunction) {
    return (issue: ZodIssue): string | undefined => {
        switch (issue.code) {
            case "invalid_type":
                if (issue.input === undefined) {
                    return t("required");
                }
                return t("invalidType", { expected: issue.expected });

            case "too_small":
                if (issue.origin === "string") {
                    return issue.minimum === 1 || issue.minimum === BigInt(1)
                        ? t("stringEmpty")
                        : t("stringMin", { min: Number(issue.minimum) });
                }
                if (
                    issue.origin === "number" ||
                    issue.origin === "bigint" ||
                    issue.origin === "int"
                ) {
                    return t("numberMin", { min: Number(issue.minimum) });
                }
                if (issue.origin === "array") {
                    return t("arrayMin", { min: Number(issue.minimum) });
                }
                if (issue.origin === "set") {
                    return t("setMin", { min: Number(issue.minimum) });
                }
                break;

            case "too_big":
                if (issue.origin === "string") {
                    return t("stringMax", { max: Number(issue.maximum) });
                }
                if (
                    issue.origin === "number" ||
                    issue.origin === "bigint" ||
                    issue.origin === "int"
                ) {
                    return t("numberMax", { max: Number(issue.maximum) });
                }
                if (issue.origin === "array") {
                    return t("arrayMax", { max: Number(issue.maximum) });
                }
                if (issue.origin === "set") {
                    return t("setMax", { max: Number(issue.maximum) });
                }
                break;

            case "invalid_format":
                switch (issue.format) {
                    case "email":
                        return t("invalidEmail");
                    case "url":
                        return t("invalidUrl");
                    case "uuid":
                        return t("invalidUuid");
                    case "cuid":
                    case "cuid2":
                        return t("invalidCuid");
                    case "regex":
                        return t("invalidFormat");
                    default:
                        return t("invalidString");
                }

            case "invalid_value":
                return t("invalidEnumValue");

            case "custom":
                return issue.message;

            case "invalid_union":
                return t("invalidUnion");

            case "not_multiple_of":
                return t("notMultipleOf", { multipleOf: issue.divisor });

            case "invalid_key":
                return t("invalidKey");

            case "invalid_element":
                return t("invalidElement");

            case "unrecognized_keys":
                return t("unrecognizedKeys", {
                    keys: issue.keys?.join(", ") ?? "",
                });
        }

        return undefined;
    };
}
