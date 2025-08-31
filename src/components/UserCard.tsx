import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "./AvatarSelector";

interface UserCardProps {
    username: string;
}

export function UserCard({ username }: UserCardProps) {
    return (
        <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Registered User
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <UserAvatar username={username} size="md" />
                    <div className="flex-1">
                        <h3 className="font-medium text-foreground">{username}</h3>
                        <p className="text-sm text-muted-foreground">Active member</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}