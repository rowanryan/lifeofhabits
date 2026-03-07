import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function Subscription() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                    View and manage your subscription details.
                </CardDescription>
                <CardAction>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/api/polar/portal">
                            Manage <ExternalLinkIcon />
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent></CardContent>

            <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex gap-3">
                    <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />

                    <div>
                        <p className="font-medium">
                            You currently do not have a spend limit.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            A spend limit helps you control your spending and
                            avoid unexpected charges.
                        </p>
                    </div>
                </div>

                <Button size="sm">Set limit</Button>
            </CardFooter>
        </Card>
    );
}
