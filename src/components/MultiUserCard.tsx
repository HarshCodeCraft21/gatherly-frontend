import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const avatarColors = [
  "bg-avatar-primary",
  "bg-avatar-secondary",
  "bg-avatar-tertiary",
  "bg-avatar-quaternary",
];

interface User {
  _id: string;
  name: string;
}

interface MultiUserCardProps {
  users: User[];
  title?: string;
}

export function MultiUserCard({ users, title = "Registered Users" }: MultiUserCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {users.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No registered users
          </div>
        )}
        {users.map((user, index) => {
          const firstLetter = user.name.charAt(0).toUpperCase();
          const colorIndex =
            user.name
              .split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
            avatarColors.length;
          const avatarColor = avatarColors[colorIndex];

          return (
            <div key={user._id}>
              <div className="flex items-center space-x-3 py-3">
                <div className={`flex items-center justify-center rounded-full font-semibold text-white shadow-sm w-10 h-10 ${avatarColor}`}>
                  {firstLetter}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">Active member</p>
                </div>
              </div>
              {index < users.length - 1 && <div className="border-t border-gray-200" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
