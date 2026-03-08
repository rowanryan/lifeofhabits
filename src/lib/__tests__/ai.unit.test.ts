import { beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "@/env";
import { AI, AIError } from "../ai";
import type { api } from "../polar";

const mockPolar = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof api>();
});

const mockGenerateText = vi.fn();

const mockStreamText = vi.fn();

vi.mock("../polar", () => ({
    api: mockPolar,
}));

vi.mock("ai", async () => {
    const actual = await vi.importActual("ai");
    return {
        ...actual,
        generateText: (...args: unknown[]) => mockGenerateText(...args),
        streamText: (...args: unknown[]) => mockStreamText(...args),
    };
});

describe("AI", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("_canConsume", () => {
        it("should return true if the customer has no spend limit", async () => {
            mockPolar.customers.getState.mockResolvedValue({
                activeSubscriptions: [
                    {
                        meters: [
                            {
                                id: env.POLAR_CREDITS_METER_ID,
                                consumedUnits: 0,
                            },
                        ],
                    },
                ],
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: null,
            });

            const result = await (
                ai as unknown as { _canConsume: () => Promise<boolean> }
            )._canConsume();

            expect(result).toBe(true);
            expect(mockPolar.customers.getState).toHaveBeenCalled();
        });

        it("should return false if the consumed units are equal or greater than the spend limit", async () => {
            mockPolar.customers.getState.mockResolvedValue({
                activeSubscriptions: [
                    {
                        meters: [
                            {
                                id: env.POLAR_CREDITS_METER_ID,
                                consumedUnits: 20,
                            },
                        ],
                    },
                ],
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: 20,
            });

            const result = await (
                ai as unknown as { _canConsume: () => Promise<boolean> }
            )._canConsume();

            expect(result).toBe(false);
            expect(mockPolar.customers.getState).toHaveBeenCalled();
        });

        it("should throw an error if the customer has no subscription", async () => {
            mockPolar.customers.getState.mockResolvedValue({
                activeSubscriptions: [],
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: 20,
            });

            const result = (
                ai as unknown as { _canConsume: () => Promise<boolean> }
            )._canConsume();

            await expect(result).rejects.toThrow(AIError);
        });

        it("should throw an error if the meter is not found", async () => {
            mockPolar.customers.getState.mockResolvedValue({
                activeSubscriptions: [
                    {
                        meters: [],
                    },
                ],
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: 20,
            });

            const result = (
                ai as unknown as { _canConsume: () => Promise<boolean> }
            )._canConsume();

            await expect(result).rejects.toThrow(AIError);
        });
    });

    describe("_consumeCredits", () => {
        it("should ingest a credit usage event", async () => {
            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: null,
            });

            await (
                ai as unknown as {
                    _consumeCredits: ({
                        amount,
                    }: {
                        amount: number;
                    }) => Promise<boolean>;
                }
            )._consumeCredits({ amount: 100 });

            expect(mockPolar.events.ingest).toHaveBeenCalledWith({
                events: [
                    {
                        name: "credit_usage",
                        customerId: "123",
                        metadata: { credits: 100 },
                    },
                ],
            });
        });
    });

    describe("generateText", () => {
        const mockCanConsume = () => {
            mockPolar.customers.getState.mockResolvedValue({
                activeSubscriptions: [
                    {
                        meters: [
                            {
                                id: env.POLAR_CREDITS_METER_ID,
                                consumedUnits: 0,
                            },
                        ],
                    },
                ],
            } as never);
        };

        it("should check if the customer can consume credits before generating text", async () => {
            mockCanConsume();

            mockGenerateText.mockResolvedValue({
                providerMetadata: {
                    gateway: {
                        marketCost: "0.03",
                    },
                },
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: null,
            });

            await ai.generateText({
                model: "openai/gpt-5-mini",
                defaultMarketCost: 0.1,
            } as never);

            expect(mockPolar.customers.getState).toHaveBeenCalled();
        });

        it("should call the generateText function and consume credits", async () => {
            mockCanConsume();

            mockGenerateText.mockResolvedValue({
                providerMetadata: {
                    gateway: {
                        marketCost: "0.03",
                    },
                },
            } as never);

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: null,
            });

            const result = await ai.generateText({
                model: "openai/gpt-5-mini",
                defaultMarketCost: 0.1,
            } as never);

            expect(result).toBeDefined();
            expect(mockPolar.events.ingest).toHaveBeenCalledWith({
                events: [
                    {
                        name: "credit_usage",
                        customerId: "123",
                        metadata: { credits: 0.03 },
                    },
                ],
            });
        });

        it("should throw an error if the generation fails", async () => {
            mockCanConsume();

            mockGenerateText.mockRejectedValue(new Error("Generation error"));

            const ai = new AI({
                polarCustomerId: "123",
                spendLimit: null,
            });

            const result = ai.generateText({
                model: "openai/gpt-5-mini",
                defaultMarketCost: 0.1,
            } as never);

            await expect(result).rejects.toThrow("Failed to generate text");
        });
    });
});
