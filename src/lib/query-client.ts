import type z from "zod";
import { type Context, createContext } from "@/server/shared";

export type QueryFn<TInput, TOutput, TContext extends Context> = (params: {
    input: TInput;
    ctx: TContext;
}) => Promise<TOutput> | TOutput;

export type MiddlewareFn<
    TBaseContext extends Context,
    TExtendedContext extends Context,
> = (ctx: TBaseContext) => Promise<TExtendedContext> | TExtendedContext;

export type QueryClientOptions<TContext extends Context = Context> = {
    context?: () => Promise<TContext>;
};

export class QueryClient<TContext extends Context = Context> {
    private getContext: () => Promise<TContext>;

    constructor(options?: QueryClientOptions<TContext>) {
        this.getContext =
            options?.context ?? (createContext as () => Promise<TContext>);
    }

    query<TInput = void, TOutput = unknown>(
        fn: QueryFn<TInput, TOutput, TContext>,
    ): TInput extends void
        ? (input?: TInput) => Promise<TOutput>
        : (input: TInput) => Promise<TOutput>;
    query<TSchema extends z.ZodTypeAny, TOutput = unknown>(
        schema: TSchema,
        fn: QueryFn<z.infer<TSchema>, TOutput, TContext>,
    ): (input: z.input<TSchema>) => Promise<TOutput>;
    query<TInputOrSchema = void, TOutput = unknown>(
        fnOrSchema: QueryFn<TInputOrSchema, TOutput, TContext> | z.ZodTypeAny,
        fn?: QueryFn<unknown, TOutput, TContext>,
    ): unknown {
        if (fn !== undefined) {
            const schema = fnOrSchema as z.ZodTypeAny;
            return async (input: z.input<typeof schema>) => {
                const validatedInput = schema.parse(input);
                const ctx = await this.getContext();
                return fn({ input: validatedInput, ctx });
            };
        }
        const fnOnly = fnOrSchema as QueryFn<TInputOrSchema, TOutput, TContext>;
        return async (input?: TInputOrSchema) => {
            const ctx = await this.getContext();
            return fnOnly({ input: input as TInputOrSchema, ctx });
        };
    }

    use<TExtendedContext extends Context>(
        middleware: MiddlewareFn<TContext, TExtendedContext>,
    ): QueryClient<TExtendedContext> {
        return new QueryClient<TExtendedContext>({
            context: async () => {
                const baseCtx = await this.getContext();
                return middleware(baseCtx);
            },
        });
    }
}
