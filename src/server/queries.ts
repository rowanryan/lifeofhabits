import type z from "zod";
import { type Context, createContext } from "./shared";

type QueryFn<TInput, TOutput, TContext extends Context> = (params: {
    input: TInput;
    ctx: TContext;
}) => Promise<TOutput> | TOutput;

type MiddlewareFn<
    TBaseContext extends Context,
    TExtendedContext extends Context,
> = (ctx: TBaseContext) => Promise<TExtendedContext> | TExtendedContext;

type QueryClientOptions<TContext extends Context = Context> = {
    context?: () => Promise<TContext>;
};

type QueryClient<TContext extends Context = Context> = {
    query: {
        <TInput = void, TOutput = unknown>(
            fn: QueryFn<TInput, TOutput, TContext>,
        ): TInput extends void
            ? (input?: TInput) => Promise<TOutput>
            : (input: TInput) => Promise<TOutput>;
        <TSchema extends z.ZodTypeAny, TOutput = unknown>(
            schema: TSchema,
            fn: QueryFn<z.infer<TSchema>, TOutput, TContext>,
        ): (input: z.input<TSchema>) => Promise<TOutput>;
    };
    use: <TExtendedContext extends Context>(
        middleware: MiddlewareFn<TContext, TExtendedContext>,
    ) => QueryClient<TExtendedContext>;
};

export const createQueryClient = <TContext extends Context = Context>(
    options?: QueryClientOptions<TContext>,
): QueryClient<TContext> => {
    const getContext =
        options?.context ?? (createContext as () => Promise<TContext>);

    function query<TInput = void, TOutput = unknown>(
        fn: QueryFn<TInput, TOutput, TContext>,
    ): TInput extends void
        ? (input?: TInput) => Promise<TOutput>
        : (input: TInput) => Promise<TOutput>;
    function query<TSchema extends z.ZodTypeAny, TOutput = unknown>(
        schema: TSchema,
        fn: QueryFn<z.infer<TSchema>, TOutput, TContext>,
    ): (input: z.input<TSchema>) => Promise<TOutput>;
    function query<TInputOrSchema = void, TOutput = unknown>(
        fnOrSchema: QueryFn<TInputOrSchema, TOutput, TContext> | z.ZodTypeAny,
        fn?: QueryFn<unknown, TOutput, TContext>,
    ): unknown {
        // If two parameters provided, first is schema, second is function
        if (fn !== undefined) {
            const schema = fnOrSchema as z.ZodTypeAny;
            return async (input: z.input<typeof schema>) => {
                const validatedInput = schema.parse(input);
                const ctx = await getContext();
                return fn({ input: validatedInput, ctx });
            };
        }
        // Otherwise, single parameter is the function
        const fnOnly = fnOrSchema as QueryFn<TInputOrSchema, TOutput, TContext>;
        return async (input?: TInputOrSchema) => {
            const ctx = await getContext();
            return fnOnly({ input: input as TInputOrSchema, ctx });
        };
    }

    const client: QueryClient<TContext> = {
        query,
        use: <TExtendedContext extends Context>(
            middleware: MiddlewareFn<TContext, TExtendedContext>,
        ) => {
            return createQueryClient<TExtendedContext>({
                context: async () => {
                    const baseCtx = await getContext();
                    return middleware(baseCtx);
                },
            });
        },
    };

    return client;
};

// Create a default query client instance
export const queryClient = createQueryClient();

// Auth query client - checks if user is signed in
export const authQuery = queryClient.use(async (ctx) => {
    if (!ctx.clerkAuth.userId) {
        throw new Error("Unauthorized");
    }

    return {
        ...ctx,
        clerkAuth: ctx.clerkAuth,
    };
});

export const orgQuery = authQuery.use(async (ctx) => {
    if (!ctx.clerkAuth.orgId) {
        throw new Error("Forbidden");
    }

    return {
        ...ctx,
        orgId: ctx.clerkAuth.orgId,
        permissions: ctx.clerkAuth.orgPermissions,
    };
});

export const adminQuery = authQuery.use(async (ctx) => {
    if (ctx.clerkAuth.sessionClaims?.role !== "admin") {
        throw new Error("Forbidden");
    }

    return {
        ...ctx,
        clerkAuth: ctx.clerkAuth,
    };
});

// Utility types to infer input and output from any query
export type QueryInput<T extends (...args: unknown[]) => unknown> =
    Parameters<T>[0];
export type QueryOutput<T extends (...args: unknown[]) => unknown> = Awaited<
    ReturnType<T>
>;
