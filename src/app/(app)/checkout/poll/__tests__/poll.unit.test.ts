import { beforeEach, describe, expect, it, vi } from "vitest";
import type { api } from "@/lib/polar";
import type { Context } from "@/server/shared";
import { getCheckoutPollResult } from "../poll";

const mockPolar = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof api>();
});

const mockContext = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<Context>();
});

vi.mock("@/lib/polar", () => ({
    api: mockPolar,
}));

describe("getCheckoutPollResult", () => {
    beforeEach(() => {
        vi.resetAllMocks();

        mockContext.db.query.polarCustomers.findFirst.mockResolvedValue({
            externalId: "cus_123",
            subscriptionId: null,
        } as never);
    });

    it("returns invalid when the checkout does not belong to the current user", async () => {
        mockPolar.checkouts.get.mockResolvedValue({
            customerId: "cus_other",
            status: "succeeded",
        } as never);

        const result = await getCheckoutPollResult({
            checkoutId: "chk_123",
            userId: "user_123",
            db: mockContext.db,
        });

        expect(result).toEqual({
            status: "invalid",
            checkoutValid: false,
            hasSubscription: false,
        });
    });

    it("returns invalid when the checkout status is not succeeded", async () => {
        mockPolar.checkouts.get.mockResolvedValue({
            customerId: "cus_123",
            status: "open",
        } as never);

        const result = await getCheckoutPollResult({
            checkoutId: "chk_123",
            userId: "user_123",
            db: mockContext.db,
        });

        expect(result).toEqual({
            status: "invalid",
            checkoutValid: false,
            hasSubscription: false,
        });
    });

    it("returns pending when the checkout is valid but the subscription is not ready", async () => {
        mockPolar.checkouts.get.mockResolvedValue({
            customerId: "cus_123",
            status: "succeeded",
        } as never);

        const result = await getCheckoutPollResult({
            checkoutId: "chk_123",
            userId: "user_123",
            db: mockContext.db,
        });

        expect(result).toEqual({
            status: "pending",
            checkoutValid: true,
            hasSubscription: false,
        });
    });

    it("returns ready when the checkout is valid and the subscription is ready", async () => {
        mockContext.db.query.polarCustomers.findFirst.mockResolvedValue({
            externalId: "cus_123",
            subscriptionId: "sub_123",
        } as never);

        mockPolar.checkouts.get.mockResolvedValue({
            customerId: "cus_123",
            status: "succeeded",
        } as never);

        const result = await getCheckoutPollResult({
            checkoutId: "chk_123",
            userId: "user_123",
            db: mockContext.db,
        });

        expect(result).toEqual({
            status: "ready",
            checkoutValid: true,
            hasSubscription: true,
        });
    });
});
