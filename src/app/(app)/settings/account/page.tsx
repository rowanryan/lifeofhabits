import { OAUTH_PROVIDERS } from "@/config/clerk";
import { UserConnectedAccounts } from "@/features/user-connected-accounts";
import { UserEmailAddresses } from "@/features/user-email-addresses";
import { Profile } from "./components/Profile";

export default function Page() {
    const hasOAuthProviders = OAUTH_PROVIDERS.length > 0;

    return (
        <div className="space-y-4">
            <Profile />
            <UserEmailAddresses />

            {hasOAuthProviders && <UserConnectedAccounts />}
        </div>
    );
}
