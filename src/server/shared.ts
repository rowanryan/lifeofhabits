import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies, headers } from "next/headers";
import { db } from "./db";

export const createContext = async () => {
    const header = await headers();
    const cookie = await cookies();
    const clerkAuth = await auth();
    const clerk = await clerkClient();

    return {
        headers: header,
        cookies: cookie,
        clerkAuth: clerkAuth,
        clerkClient: clerk,
        db: db,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
