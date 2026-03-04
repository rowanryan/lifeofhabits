import { QueryClient } from "@/lib/query-client";

export type {
    MiddlewareFn,
    QueryClientOptions,
    QueryFn,
} from "@/lib/query-client";
export { QueryClient } from "@/lib/query-client";

// Create a default query client instance
export const queryClient = new QueryClient();

// Auth query client - checks if user is signed in
export const authQuery = queryClient.use(async ctx => {
    if (!ctx.clerkAuth.userId) {
        throw new Error("Unauthorized");
    }

    return {
        ...ctx,
        clerkAuth: ctx.clerkAuth,
    };
});

export const orgQuery = authQuery.use(async ctx => {
    if (!ctx.clerkAuth.orgId) {
        throw new Error("Forbidden");
    }

    return {
        ...ctx,
        orgId: ctx.clerkAuth.orgId,
        permissions: ctx.clerkAuth.orgPermissions,
    };
});

export const adminQuery = authQuery.use(async ctx => {
    if (ctx.clerkAuth.sessionClaims?.role !== "admin") {
        throw new Error("Forbidden");
    }

    return {
        ...ctx,
        clerkAuth: ctx.clerkAuth,
    };
});

// Utility types to infer input and output from any query
// biome-ignore lint/suspicious/noExplicitAny: Required for generic function inference
export type QueryInput<T extends (...args: any[]) => any> = Parameters<T>[0];
// biome-ignore lint/suspicious/noExplicitAny: Required for generic function inference
export type QueryOutput<T extends (...args: any[]) => any> = Awaited<
    ReturnType<T>
>;
