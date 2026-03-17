import { generateText, streamText } from "ai";

export class AIError extends Error {
    constructor(
        message: string,
        options: {
            cause?: unknown;
        } = {}
    ) {
        super(message);
        this.name = "AIError";
        this.cause = options.cause;
    }
}

// TODO: Implement the AI class with Autumn
export class AI {
    // Helpers
    private async _canConsume() {
        return true;
    }

    // biome-ignore lint/correctness/noUnusedFunctionParameters: We need this for the private methods
    private async _consumeCredits({ amount }: { amount: number }) {
        return;
    }

    // Methods
    public async streamText({
        defaultMarketCost,
        ...params
    }: Parameters<typeof streamText>[0] & { defaultMarketCost: number }) {
        try {
            await this._canConsume();

            return streamText({
                ...params,
                onFinish: async data => {
                    const gatewayMarketCost = data.providerMetadata?.gateway
                        ?.marketCost
                        ? Number(data.providerMetadata.gateway.marketCost)
                        : undefined;

                    await this._consumeCredits({
                        amount: gatewayMarketCost ?? defaultMarketCost,
                    });
                },
            });
        } catch (error) {
            if (error instanceof AIError) {
                throw error;
            }

            throw new AIError("Failed to stream text", {
                cause: error,
            });
        }
    }

    public async generateText({
        defaultMarketCost,
        ...params
    }: Parameters<typeof generateText>[0] & { defaultMarketCost: number }) {
        try {
            await this._canConsume();

            const result = await generateText(params);

            const gatewayMarketCost = result.providerMetadata?.gateway
                ?.marketCost
                ? Number(result.providerMetadata.gateway.marketCost)
                : undefined;

            await this._consumeCredits({
                amount: gatewayMarketCost ?? defaultMarketCost,
            });

            return result;
        } catch (error) {
            if (error instanceof AIError) {
                throw error;
            }

            throw new AIError("Failed to generate text", {
                cause: error,
            });
        }
    }
}
