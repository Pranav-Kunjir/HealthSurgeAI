import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type SettingsTab = "profile" | "notifications" | "security" | "system";

export const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const user = useQuery(api.myFunctions.getUser);

    // Parse name for display
    const fullName = user?.name || "";
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        inApp: true,
        criticalSurge: true,
        inventoryLow: true,
        staffingIssues: false,
    });

    React.useEffect(() => {
        try {
            const stored = window.localStorage.getItem("healthsurge_notification_settings");
            if (stored) {
                const parsed = JSON.parse(stored) as typeof notifications;
                setNotifications(parsed);
            }
        } catch (error) {
            console.error("Failed to load notification settings", error);
        }
    }, []);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(
                "healthsurge_notification_settings",
                JSON.stringify(notifications),
            );
        } catch (error) {
            console.error("Failed to save notification settings", error);
        }
    }, [notifications]);

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold font-display">Settings</h1>
                    <p className="text-gray-500">
                        Manage your account preferences and system configurations.
                    </p>
                </div>
                <button className="px-4 py-2 bg-black text-white border-2 border-black rounded text-sm font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_#111]">
                    Save Changes
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <nav className="space-y-2">
                        {[
                            { id: "profile", label: "Profile", icon: "ph-user" },
                            { id: "notifications", label: "Notifications", icon: "ph-bell" },
                            { id: "security", label: "Security", icon: "ph-shield" },
                            { id: "system", label: "System", icon: "ph-gear" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as SettingsTab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded font-bold transition-all border-2 ${activeTab === item.id
                                    ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_#111]"
                                    : "bg-white text-gray-500 border-transparent hover:bg-gray-100 hover:text-black"
                                    }`}
                            >
                                <i className={`ph-bold ${item.icon} text-lg`}></i>
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111]">
                        {activeTab === "profile" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold font-display border-b border-gray-100 pb-2">
                                    Profile Settings
                                </h2>

                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-black flex items-center justify-center text-4xl text-gray-400 overflow-hidden">
                                        {user?.image ? (
                                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <i className="ph-fill ph-user"></i>
                                        )}
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 border-2 border-black font-bold text-sm hover:bg-gray-50 mb-2">
                                            Change Avatar
                                        </button>
                                        <p className="text-xs text-gray-500">
                                            JPG, GIF or PNG. Max size of 800K
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={firstName}
                                            key={firstName} // Force re-render when data loads
                                            className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={lastName}
                                            key={lastName} // Force re-render when data loads
                                            className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || ""}
                                            key={user?.email} // Force re-render when data loads
                                            className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Hospital Administrator"
                                            disabled
                                            className="w-full p-2 border-2 border-gray-100 bg-gray-50 rounded text-gray-500 font-bold cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold font-display border-b border-gray-100 pb-2">
                                    Notification Preferences
                                </h2>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase text-gray-500">
                                        Channels
                                    </h3>
                                    {[
                                        { id: "email", label: "Email Notifications", desc: "Receive daily summaries and critical alerts via email." },
                                        { id: "sms", label: "SMS Alerts", desc: "Get urgent alerts directly to your phone." },
                                        { id: "inApp", label: "In-App Notifications", desc: "Show notifications within the dashboard." },
                                    ].map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded hover:bg-gray-50">
                                            <div>
                                                <div className="font-bold text-sm">{item.label}</div>
                                                <div className="text-xs text-gray-500">{item.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications[item.id as keyof typeof notifications] ? "bg-black" : "bg-gray-200"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifications[item.id as keyof typeof notifications] ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                ></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold uppercase text-gray-500">
                                        Alert Types
                                    </h3>
                                    {[
                                        { id: "criticalSurge", label: "Critical Surges", desc: "Notify when patient influx exceeds capacity." },
                                        { id: "inventoryLow", label: "Low Inventory", desc: "Alert when critical supplies drop below 20%." },
                                        { id: "staffingIssues", label: "Staffing Shortages", desc: "Warn when departments are understaffed." },
                                    ].map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded hover:bg-gray-50">
                                            <div>
                                                <div className="font-bold text-sm">{item.label}</div>
                                                <div className="text-xs text-gray-500">{item.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications[item.id as keyof typeof notifications] ? "bg-lime-400" : "bg-gray-200"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifications[item.id as keyof typeof notifications] ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                ></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold font-display border-b border-gray-100 pb-2">
                                    Security Settings
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirm Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button className="px-4 py-2 bg-gray-100 text-black font-bold text-sm border-2 border-transparent hover:border-black rounded">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-sm">Two-Factor Authentication</h3>
                                            <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                                        </div>
                                        <button className="px-4 py-2 border-2 border-black text-black font-bold text-sm rounded hover:bg-lime-400">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "system" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-xl font-bold font-display border-b border-gray-100 pb-2">
                                    System Preferences
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Language</label>
                                        <select className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold">
                                            <option>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Time Zone</label>
                                        <select className="w-full p-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold">
                                            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                            <option>(GMT+00:00) London</option>
                                            <option>(GMT+05:30) Mumbai</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-sm">Dark Mode</h3>
                                            <p className="text-xs text-gray-500">Switch between light and dark themes.</p>
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-400">
                                            Coming Soon
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
