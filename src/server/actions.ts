import { getTranslations } from "next-intl/server";
import { createSafeActionClient } from "next-safe-action";
import { createContext } from "./shared";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
    handleServerError: async error => {
        if (error instanceof ActionError) {
            return error.message;
        }

        const t = await getTranslations("Common.Errors.ServerAction");

        return t("Unknown");
    },
}).use(async ({ next }) => {
    const ctx = await createContext();

    return await next({
        ctx,
    });
});

export const authAction = actionClient.use(async ({ next, ctx }) => {
    if (!ctx.clerkAuth.userId) {
        const t = await getTranslations("Common.Errors.ServerAction");

        throw new ActionError(t("Unauthorized"));
    }

    return await next({
        ctx: {
            ...ctx,
            clerkAuth: ctx.clerkAuth,
        },
    });
});

export const orgAction = authAction.use(async ({ next, ctx }) => {
    if (!ctx.clerkAuth.orgId) {
        const t = await getTranslations("Common.Errors.ServerAction");

        throw new ActionError(t("Forbidden"));
    }

    return await next({
        ctx: {
            ...ctx,
            orgId: ctx.clerkAuth.orgId,
            permissions: ctx.clerkAuth.orgPermissions,
        },
    });
});

export const adminAction = orgAction.use(async ({ next, ctx }) => {
    if (ctx.clerkAuth.sessionClaims?.role !== "admin") {
        const t = await getTranslations("Common.Errors.ServerAction");

        throw new ActionError(t("Forbidden"));
    }

    return await next({
        ctx: {
            ...ctx,
        },
    });
});
