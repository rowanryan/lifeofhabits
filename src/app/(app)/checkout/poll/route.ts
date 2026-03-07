import { NextResponse } from "next/server";
import z from "zod";
import { createContext } from "@/server/shared";
import { getCheckoutPollResult } from "./poll";

const checkoutIdSchema = z.string().trim().min(1);

export async function GET(request: Request) {
    try {
        const ctx = await createContext();

        if (!ctx.clerkAuth.userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const parseResult = checkoutIdSchema.safeParse(
            new URL(request.url).searchParams.get("checkoutId")
        );

        if (!parseResult.success) {
            return NextResponse.json(
                { message: "Missing or invalid checkout_id" },
                { status: 400 }
            );
        }

        const result = await getCheckoutPollResult({
            checkoutId: parseResult.data,
            userId: ctx.clerkAuth.userId,
            db: ctx.db,
        });

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            {
                message: "Something went wrong while confirming the checkout.",
            },
            { status: 500 }
        );
    }
}
