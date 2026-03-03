import { env } from "@/env";
import { client } from "@/lib/stripe";

export async function POST(request: Request) {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return new Response("Missing stripe signature", { status: 400 });
    }

    client.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET
    );

    return new Response("OK", { status: 200 });
}
