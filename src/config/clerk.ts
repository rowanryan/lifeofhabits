import type { OAuthStrategy } from "@clerk/types";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";
import { FaMicrosoft } from "react-icons/fa";

export const OAUTH_PROVIDER_IDS = ["google", "microsoft"] as const;

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
    {
        id: "microsoft",
        strategy: "oauth_microsoft",
        name: "Microsoft",
        icon: FaMicrosoft,
    },
];

export function getOAuthProvider(
    id: OAuthProviderId
): OAuthProvider | undefined {
    return OAUTH_PROVIDERS.find(provider => provider.id === id);
}
