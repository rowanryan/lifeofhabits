import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";
import type { client } from "@/lib/stripe";
import type { Context } from "@/server/shared";
import { getStripeCustomer } from "../queries";

const mockContext = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<Context>();
});
const mockStripe = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof client>();
});

vi.mock("@/server/shared", () => ({
    createContext: vi.fn(() => Promise.resolve(mockContext)),
}));

vi.mock("@/lib/stripe", () => ({
    client: mockStripe,
}));

describe("getStripeCustomer", () => {
    beforeEach(() => {
        mockReset(mockContext);
        vi.clearAllMocks();

        mockContext.clerkAuth.userId = "user_123";
    });

    it("should return the stripe customer if id is found in clerk metadata", async () => {
        mockContext.clerkClient.users.getUser.mockResolvedValue({
            id: "user_123",
            privateMetadata: { stripeCustomerId: "cus_existing" },
        } as never);

        mockStripe.customers.retrieve.mockResolvedValue({
            id: "cus_existing",
            email: "test@example.com",
        } as never);

        const result = await getStripeCustomer();

        expect(mockStripe.customers.retrieve).toHaveBeenCalledWith(
            "cus_existing"
        );
        expect(result).toEqual({
            id: "cus_existing",
            email: "test@example.com",
        });
    });

    it("should create a new stripe customer if id is not found in clerk metadata", async () => {
        mockContext.clerkClient.users.getUser.mockResolvedValue({
            id: "user_123",
            primaryEmailAddress: { emailAddress: "new@example.com" },
            fullName: "New User",
            privateMetadata: {},
        } as never);

        mockContext.clerkClient.users.updateUserMetadata.mockResolvedValue(
            {} as never
        );

        mockStripe.customers.create.mockResolvedValue({
            id: "cus_new",
            email: "new@example.com",
        } as never);

        const result = await getStripeCustomer();

        expect(mockStripe.customers.create).toHaveBeenCalledWith({
            email: "new@example.com",
            name: "New User",
        });
        expect(
            mockContext.clerkClient.users.updateUserMetadata
        ).toHaveBeenCalledWith("user_123", {
            privateMetadata: { stripeCustomerId: "cus_new" },
        });
        expect(result).toEqual({ id: "cus_new", email: "new@example.com" });
    });
});
