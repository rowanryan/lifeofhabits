import { beforeEach, describe, expect, it, vi } from "vitest";
import type { api } from "@/lib/polar";
import type { Context } from "@/server/shared";
import { getInternalCustomer } from "../queries";

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

vi.mock("@/server/shared", () => ({
    createContext: vi.fn(() => Promise.resolve(mockContext)),
}));

describe("Queries", () => {
    beforeEach(() => {
        vi.resetAllMocks();

        mockContext.clerkAuth.userId = "user_123";
    });

    describe("getInternalCustomer", () => {
        it("should return the internal customer", async () => {
            mockContext.db.query.polarCustomers.findFirst.mockResolvedValue({
                id: "123",
            } as never);

            const result = await getInternalCustomer();

            expect(result).toBeDefined();
            expect(result.id).toBe("123");
        });

        it("should create a new internal customer if it doesn't exist", async () => {
            mockContext.db.query.polarCustomers.findFirst.mockResolvedValueOnce(
                undefined,
            );

            mockContext.clerkClient.users.getUser.mockResolvedValueOnce({
                fullName: "John Doe",
                primaryEmailAddress: {
                    emailAddress: "john.doe@example.com",
                },
            } as never);

            mockPolar.customers.create.mockResolvedValueOnce({
                id: "123",
            } as never);

            const mockInsert = vi.fn().mockReturnValue({
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([
                        {
                            id: "123",
                        },
                    ]),
                }),
            });

            mockContext.db.insert.mockImplementation(mockInsert);

            const result = await getInternalCustomer();

            expect(mockPolar.customers.create).toHaveBeenCalled();
            expect(mockContext.db.insert).toHaveBeenCalled();
            expect(
                mockContext.clerkClient.users.updateUserMetadata,
            ).toHaveBeenCalled();

            expect(result).toBeDefined();
            expect(result.id).toBe("123");
        });
    });
});
