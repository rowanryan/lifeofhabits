import type { auth, clerkClient } from "@clerk/nextjs/server";
import type { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { api } from "@/lib/polar";
import type { db } from "@/server/db";
import { GET } from "../route";

const mockDb = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof db>();
});

const mockPolar = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof api>();
});

const mockClerkAuth = await vi.hoisted(async () => {
    const { mockFn } = await import("vitest-mock-extended");
    return mockFn<typeof auth>();
});

const mockClerkClientInstance = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<Awaited<ReturnType<typeof clerkClient>>>();
});

const mockClerkClient = await vi.hoisted(async () => {
    const { mockFn } = await import("vitest-mock-extended");
    return mockFn<typeof clerkClient>();
});

const mockNextResponse = await vi.hoisted(async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    return mockDeep<typeof NextResponse>();
});

vi.mock("@clerk/nextjs/server", () => ({
    auth: mockClerkAuth,
    clerkClient: mockClerkClient,
}));

vi.mock("@/lib/polar", () => ({
    api: mockPolar,
}));

vi.mock("@/server/db", () => ({
    db: mockDb,
}));

vi.mock("next/server", () => ({
    NextResponse: mockNextResponse,
}));

function setupClerkMocks() {
    mockClerkAuth.mockResolvedValue({
        userId: "user_123",
    } as never);
    mockClerkClient.mockResolvedValue(mockClerkClientInstance);
}

describe("GET", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should throw an error if userId is not defined", async () => {
        mockClerkAuth.mockResolvedValue({
            userId: undefined,
        } as never);

        await expect(GET()).rejects.toThrow("Unauthorized");
    });

    it("should create a new checkout session if subscriptionId is not defined", async () => {
        setupClerkMocks();

        mockDb.query.polarCustomers.findFirst.mockResolvedValue({
            subscriptionId: undefined,
            externalId: "external_123",
        } as never);

        mockPolar.checkouts.create.mockResolvedValue({
            url: "https://checkout.polar.sh/123",
        } as never);

        await GET();

        expect(mockPolar.checkouts.create).toHaveBeenCalledWith({
            customerId: expect.any(String),
            products: expect.arrayContaining([expect.any(String)]),
            successUrl: expect.stringContaining("checkout_id={CHECKOUT_ID}"),
            returnUrl: expect.any(String),
        });

        expect(mockNextResponse.redirect).toHaveBeenCalledWith(
            "https://checkout.polar.sh/123"
        );
    });

    it("should create a new portal session if subscriptionId is defined", async () => {
        setupClerkMocks();

        mockDb.query.polarCustomers.findFirst.mockResolvedValue({
            subscriptionId: "subscription_123",
            externalId: "external_123",
        } as never);

        mockPolar.customerSessions.create.mockResolvedValue({
            customerPortalUrl: "https://portal.polar.sh/123",
        } as never);

        await GET();

        expect(mockPolar.customerSessions.create).toHaveBeenCalled();

        expect(mockNextResponse.redirect).toHaveBeenCalledWith(
            "https://portal.polar.sh/123"
        );
    });

    describe("Internal customer not found", () => {
        it("should throw an error if email is not defined", async () => {
            setupClerkMocks();

            mockClerkClientInstance.users.getUser.mockResolvedValue({
                fullName: "John Doe",
                primaryEmailAddress: undefined,
            } as never);

            await expect(GET()).rejects.toThrow("Email not found");
        });

        it("should throw an error if failed to create internal customer", async () => {
            setupClerkMocks();

            mockClerkClientInstance.users.getUser.mockResolvedValue({
                fullName: "John Doe",
                primaryEmailAddress: {
                    emailAddress: "john.doe@example.com",
                },
            } as never);

            mockPolar.customers.create.mockResolvedValue({
                id: "customer_123",
            } as never);

            const mockReturning = vi.fn().mockResolvedValue([]);
            const mockValues = vi
                .fn()
                .mockReturnValue({ returning: mockReturning });
            const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
            mockDb.insert.mockImplementation(mockInsert);

            await expect(GET()).rejects.toThrow(
                "Failed to create internal customer"
            );
        });

        it("should create a new internal customer", async () => {
            setupClerkMocks();

            mockClerkClientInstance.users.getUser.mockResolvedValue({
                fullName: "John Doe",
                primaryEmailAddress: {
                    emailAddress: "john.doe@example.com",
                },
            } as never);

            mockPolar.customers.create.mockResolvedValue({
                id: "customer_123",
            } as never);

            const newInternalCustomer = {
                id: "internal_123",
                clerkUserId: "user_123",
                externalId: "polar_cus_new",
            };

            const mockReturning = vi
                .fn()
                .mockResolvedValue([newInternalCustomer]);
            const mockValues = vi
                .fn()
                .mockReturnValue({ returning: mockReturning });
            const mockInsert = vi.fn().mockReturnValue({
                values: mockValues,
                returning: mockReturning,
            });
            mockDb.insert.mockImplementation(mockInsert);

            mockPolar.checkouts.create.mockResolvedValue({
                url: "https://checkout.polar.sh/123",
            } as never);

            await GET();

            expect(
                mockClerkClientInstance.users.updateUserMetadata
            ).toHaveBeenCalledWith("user_123", {
                privateMetadata: {
                    polarCustomerId: "customer_123",
                    internalCustomerId: "internal_123",
                },
            });

            expect(mockDb.insert).toHaveBeenCalled();

            expect(mockPolar.customers.create).toHaveBeenCalled();

            expect(mockPolar.checkouts.create).toHaveBeenCalled();

            expect(mockNextResponse.redirect).toHaveBeenCalledWith(
                "https://checkout.polar.sh/123"
            );
        });
    });
});
