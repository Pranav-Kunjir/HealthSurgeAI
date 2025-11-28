import React from "react";
import { UserSidebar } from "./UserSidebar";

interface UserLayoutProps {
    children: React.ReactNode;
    activePage: "hospitals" | "profile";
    onNavigate: (page: "hospitals" | "profile" | "landing") => void;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
    children,
    activePage,
    onNavigate,
}) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <UserSidebar activePage={activePage} onNavigate={onNavigate} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* We can add a top navbar here if needed, or just let the content fill */}
                {/* For now, let's just render children in a scrollable area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
