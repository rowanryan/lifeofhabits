import { UserConnectedAccounts } from "@/features/user-connected-accounts";
import { UserEmailAddresses } from "@/features/user-email-addresses";
import { Profile } from "./components/Profile";

export default function Page() {
    return (
        <div className="space-y-4">
            <Profile />
            <UserEmailAddresses />
            <UserConnectedAccounts />
        </div>
    );
}
