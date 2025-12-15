import { createSafeActionClient } from "next-safe-action";
import { createContext } from "./shared";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
    handleServerError: error => {
        console.error(error);
        if (error instanceof ActionError) {
            return error.message;
        }

        return "Oops! Something went wrong.";
    },
}).use(async ({ next }) => {
    const ctx = await createContext();

    return await next({
        ctx,
    });
});

export const authAction = actionClient.use(async ({ next, ctx }) => {
    if (!ctx.clerkAuth.userId) {
        throw new Error("Unauthorized");
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
        throw new Error("Forbidden");
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
        throw new Error("Forbidden");
    }

    return await next({
        ctx: {
            ...ctx,
        },
    });
});
