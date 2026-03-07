import { generateText, streamText } from "ai";
import { env } from "@/env";
import { api } from "./polar";

export type AIParams = {
    polarCustomerId: string;
};

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

export class AI {
    constructor(private readonly params: AIParams) {}

    private async _canConsume() {
        const customerState = await api.customers.getState({
            id: this.params.polarCustomerId,
        });

        const subscription = customerState.activeSubscriptions.at(0);

        if (!subscription) {
            throw new AIError("Subscription not found");
        }

        const meter = subscription.meters.find(
            meter => meter.id === env.POLAR_CREDITS_METER_ID
        );
        if (!meter) {
            throw new AIError("Credits meter not found");
        }

        return meter.consumedUnits < meter.creditedUnits;
    }

    private async _consumeCredits({ amount }: { amount: number }) {
        await api.events.ingest({
            events: [
                {
                    name: "credit_usage",
                    customerId: this.params.polarCustomerId,
                    metadata: {
                        credits: amount,
                    },
                },
            ],
        });
    }

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
