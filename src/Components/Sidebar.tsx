import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useQuery(api.myFunctions.getUser);
  const { signOut } = useAuthActions();

  const menuItems = [
    { id: "overview", label: "Overview", icon: "ph-squares-four" },
    { id: "beds", label: "Bed Management", icon: "ph-bed" },
    { id: "predictions", label: "Predictions", icon: "ph-chart-line-up" },
    { id: "resources", label: "Hospital Inventory", icon: "ph-package" },
    { id: "alerts", label: "System Alerts", icon: "ph-warning" },
    { id: "notifications", label: "Notifications", icon: "ph-chat-teardrop-text" },
    { id: "settings", label: "Settings", icon: "ph-gear" },
    { id: "contacts", label: "Emergency Contacts", icon: "ph-address-book" },
  ];

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-64"
        } bg-black text-white border-r-2 border-lime-400 flex flex-col h-screen sticky top-0 transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-lime-400 border-2 border-black rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform z-20 shadow-md"
      >
        <i
          className={`ph-bold ${isCollapsed ? "ph-list" : "ph-caret-left"
            }`}
        ></i>
      </button>

      {/* Header */}
      <div
        className={`p-6 border-b-2 border-gray-800 flex items-center ${isCollapsed ? "justify-center" : "gap-2"
          } h-20`}
      >
        <div className="w-8 h-8 rounded flex items-center justify-center text-black shrink-0 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <span className="font-bold font-display text-xl tracking-tight whitespace-nowrap overflow-hidden">
            HealthSurgeAI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"
              } py-3 rounded transition-all font-medium group relative ${activeTab === item.id
                ? "bg-lime-400 text-black font-bold shadow-[4px_4px_0px_0px_#fff]"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
          >
            <i className={`ph-fill ${item.icon} text-xl`}></i>
            {!isCollapsed && <span>{item.label}</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-lime-400">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t-2 border-gray-800">
        <div
          className={`bg-gray-900 rounded border border-gray-800 ${isCollapsed ? "p-2 flex justify-center" : "p-4"
            }`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold truncate">{user?.name || "User"}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email || "No Email"}</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => signOut()}
              className="w-full text-xs text-red-400 hover:text-red-300 text-left mt-2 pl-11"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
