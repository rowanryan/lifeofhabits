import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { FieldValues, Resolver, ResolverResult } from "react-hook-form";
import type z from "zod";
import { createZodErrorMap } from "@/lib/zod-error-map";

export function useZodResolver<TFieldValues extends FieldValues>(
    schema: z.ZodType,
): Resolver<TFieldValues> {
    const t = useTranslations("Validation");

    const resolver = useCallback(
        async (values: TFieldValues): Promise<ResolverResult<TFieldValues>> => {
            const errorMap = createZodErrorMap((key, params) =>
                t(
                    key as Parameters<typeof t>[0],
                    params as Parameters<typeof t>[1],
                ),
            );

            const result = await schema.safeParseAsync(values, {
                error: errorMap as never,
            });

            if (result.success) {
                return {
                    values: result.data as TFieldValues,
                    errors: {},
                };
            }

            const errors: Record<string, { type: string; message: string }> =
                {};

            for (const issue of result.error.issues) {
                const path = issue.path.join(".");
                if (path && !(path in errors)) {
                    errors[path] = {
                        type: issue.code,
                        message: issue.message,
                    };
                }
            }

            return {
                values: {},
                errors,
            } as ResolverResult<TFieldValues>;
        },
        [schema, t],
    );

    return resolver as Resolver<TFieldValues>;
}
