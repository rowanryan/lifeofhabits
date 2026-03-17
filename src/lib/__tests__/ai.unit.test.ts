import { beforeEach, describe, expect, it, vi } from "vitest";
import { AI } from "../ai";

const mockGenerateText = vi.fn();

const mockStreamText = vi.fn();

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

    describe("generateText", () => {
        it("should call the generateText function and consume credits", async () => {
            mockGenerateText.mockResolvedValue({
                providerMetadata: {
                    gateway: {
                        marketCost: "0.03",
                    },
                },
            } as never);

            const ai = new AI();

            const result = await ai.generateText({
                model: "openai/gpt-5-mini",
                defaultMarketCost: 0.1,
            } as never);

            expect(result).toBeDefined();
        });

        it("should throw an error if the generation fails", async () => {
            mockGenerateText.mockRejectedValue(new Error("Generation error"));

            const ai = new AI();

            const result = ai.generateText({
                model: "openai/gpt-5-mini",
                defaultMarketCost: 0.1,
            } as never);

            await expect(result).rejects.toThrow("Failed to generate text");
        });
    });
});
