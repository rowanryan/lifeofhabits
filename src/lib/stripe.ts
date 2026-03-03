import Stripe from "stripe";
import { env } from "@/env";

export const client = new Stripe(env.STRIPE_SECRET_KEY);
