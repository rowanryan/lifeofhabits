import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";
import type { client } from "@/lib/stripe";
import type { Context } from "@/server/shared";
import { getStripeCustomer } from "../queries";
import "@/env";

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

    it("should return the stripe customer if found in the database", async () => {
        mockContext.db.query.stripeCustomers.findFirst.mockResolvedValue({
            externalId: "cus_existing",
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

    it("should create a new stripe customer if not found in the database", async () => {
        mockContext.db.query.stripeCustomers.findFirst.mockResolvedValue(
            undefined
        );

        mockContext.clerkClient.users.getUser.mockResolvedValue({
            primaryEmailAddress: { emailAddress: "new@example.com" },
            fullName: "New User",
        } as never);

        mockStripe.customers.create.mockResolvedValue({
            id: "cus_new",
            email: "new@example.com",
        } as never);

        const mockReturning = vi.fn().mockResolvedValue([
            { id: "internal_123", clerkUserId: "user_123", externalId: "cus_new" },
        ]);
        const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
        const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
        mockContext.db.insert.mockImplementation(mockInsert);

        mockContext.clerkClient.users.updateUserMetadata.mockResolvedValue(
            {} as never
        );

        const result = await getStripeCustomer();

        expect(mockContext.clerkClient.users.getUser).toHaveBeenCalledWith(
            "user_123"
        );
        expect(mockStripe.customers.create).toHaveBeenCalledWith({
            email: "new@example.com",
            name: "New User",
        });
        expect(
            mockContext.clerkClient.users.updateUserMetadata
        ).toHaveBeenCalledWith("user_123", {
            privateMetadata: {
                internalCustomerId: "internal_123",
                stripeCustomerId: "cus_new",
            },
        });
        expect(result).toEqual({ id: "cus_new", email: "new@example.com" });
    });
});
