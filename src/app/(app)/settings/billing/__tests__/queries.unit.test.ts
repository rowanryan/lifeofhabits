import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";
import type { api } from "@/lib/polar";
import type { Context } from "@/server/shared";
import { getInternalCustomer } from "../queries";
import "@/env";

const mockContext = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<Context>();
});
const mockPolar = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof api>();
});

vi.mock("@/server/shared", () => ({
    createContext: vi.fn(() => Promise.resolve(mockContext)),
}));

vi.mock("@/lib/polar", () => ({
    api: mockPolar,
}));

describe("getInternalCustomer", () => {
    beforeEach(() => {
        mockReset(mockContext);
        vi.clearAllMocks();

        mockContext.clerkAuth.userId = "user_123";
    });

    it("should return the internal customer if found in the database", async () => {
        const existingCustomer = {
            id: "internal_123",
            clerkUserId: "user_123",
            externalId: "polar_cus_existing",
        };

        mockContext.db.query.polarCustomers.findFirst.mockResolvedValue(
            existingCustomer as never
        );

        const result = await getInternalCustomer();

        expect(
            mockContext.db.query.polarCustomers.findFirst
        ).toHaveBeenCalled();
        expect(result).toEqual(existingCustomer);
    });

    it("should create a new polar customer if not found in the database", async () => {
        mockContext.db.query.polarCustomers.findFirst.mockResolvedValue(
            undefined
        );

        mockContext.clerkClient.users.getUser.mockResolvedValue({
            primaryEmailAddress: { emailAddress: "new@example.com" },
            fullName: "New User",
        } as never);

        mockPolar.customers.create.mockResolvedValue({
            id: "polar_cus_new",
            email: "new@example.com",
        } as never);

        const newInternalCustomer = {
            id: "internal_123",
            clerkUserId: "user_123",
            externalId: "polar_cus_new",
        };

        const mockReturning = vi.fn().mockResolvedValue([newInternalCustomer]);
        const mockValues = vi
            .fn()
            .mockReturnValue({ returning: mockReturning });
        const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
        mockContext.db.insert.mockImplementation(mockInsert);

        mockContext.clerkClient.users.updateUserMetadata.mockResolvedValue(
            {} as never
        );

        const result = await getInternalCustomer();

        expect(mockContext.clerkClient.users.getUser).toHaveBeenCalledWith(
            "user_123"
        );
        expect(mockPolar.customers.create).toHaveBeenCalledWith({
            type: "individual",
            email: "new@example.com",
            name: "New User",
            metadata: {
                clerkUserId: "user_123",
            },
        });
        expect(
            mockContext.clerkClient.users.updateUserMetadata
        ).toHaveBeenCalledWith("user_123", {
            privateMetadata: {
                internalCustomerId: "internal_123",
                polarCustomerId: "polar_cus_new",
            },
        });
        expect(result).toEqual(newInternalCustomer);
    });

    it("should throw an error if primary email address is not found", async () => {
        mockContext.db.query.polarCustomers.findFirst.mockResolvedValue(
            undefined
        );

        mockContext.clerkClient.users.getUser.mockResolvedValue({
            primaryEmailAddress: undefined,
        } as never);

        await expect(getInternalCustomer()).rejects.toThrow(
            "Primary email address not found."
        );
    });
});
