import { ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Subscription } from "./components/Subscription";
import { getInternalCustomer } from "./queries";

export default async function Page() {
    const internalCustomer = await getInternalCustomer();

    if (!internalCustomer.subscriptionId) {
        return (
            <Empty>
                <EmptyMedia variant="icon">
                    <ZapIcon className="size-5" />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>
                        You don&apos;t have a subscription yet
                    </EmptyTitle>
                    <EmptyDescription>
                        Subscribe to get access to our features and tools.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button>Subscribe</Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="space-y-4">
            <Subscription />
        </div>
    );
}
