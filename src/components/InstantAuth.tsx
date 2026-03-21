"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect } from "react";
import { db } from "@/db";
import { env } from "@/env";

export function InstantAuth() {
    const { getToken, isSignedIn } = useAuth();

    const signInToInstantWithClerkToken = useCallback(async () => {
        const idToken = await getToken();

        if (idToken) {
            db.auth.signInWithIdToken({
                idToken,
                clientName: env.NEXT_PUBLIC_INSTANT_CLERK_CLIENT_NAME,
            });
        }
    }, [getToken]);

    useEffect(() => {
        if (isSignedIn) {
            signInToInstantWithClerkToken();
        }
    }, [isSignedIn, signInToInstantWithClerkToken]);

    return null;
}
