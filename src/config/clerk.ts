import type { OAuthStrategy } from "@clerk/types";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";

export const OAUTH_PROVIDER_IDS = ["google"] as const;

export type OAuthProviderId = (typeof OAUTH_PROVIDER_IDS)[number];

export type OAuthProviderIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type OAuthProvider = {
    id: OAuthProviderId;
    strategy: OAuthStrategy;
    name: string;
    icon: OAuthProviderIcon;
};

export const OAUTH_PROVIDERS: OAuthProvider[] = [
    {
        id: "google",
        strategy: "oauth_google",
        name: "Google",
        icon: SiGoogle,
    },
];

export function getOAuthProvider(
    id: OAuthProviderId
): OAuthProvider | undefined {
    return OAUTH_PROVIDERS.find(provider => provider.id === id);
}
