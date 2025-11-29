import React, { useState } from "react";
import { API_BASE_URL } from "../../config";

type NotificationType = "Order" | "Admission" | "Transport" | "General";

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    dateGroup: "Today" | "Yesterday" | "Older";
    read: boolean;
}

export const NotificationsView: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<NotificationType | "All">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: "Order",
            title: "Order Confirmed",
            message: "Order #ORD-2024-001 for 50 Oxygen Cylinders has been confirmed by AirLiquide.",
            time: "10:30 AM",
            dateGroup: "Today",
            read: false,
        },
        {
            id: 2,
            type: "Admission",
            title: "Bed Booked",
            message: "Bed ICU-04 has been successfully booked for Patient #P-9023 (Rahul Sharma).",
            time: "09:15 AM",
            dateGroup: "Today",
            read: false,
        },
        {
            id: 3,
            type: "Transport",
            title: "Ambulance Dispatched",
            message: "Ambulance #AMB-05 is en route to Sector 4 for emergency pickup.",
            time: "08:45 AM",
            dateGroup: "Today",
            read: true,
        },
        {
            id: 4,
            type: "Order",
            title: "Stock Low Alert",
            message: "Surgical Masks inventory is below 20%. Auto-reorder suggestion generated.",
            time: "Yesterday",
            dateGroup: "Yesterday",
            read: true,
        },
        {
            id: 5,
            type: "Admission",
            title: "Discharge Processed",
            message: "Patient #P-8900 has been discharged from General Ward Bed G-12.",
            time: "Yesterday",
            dateGroup: "Yesterday",
            read: true,
        },
        {
            id: 6,
            type: "General",
            title: "System Maintenance",
            message: "Scheduled maintenance for 25th Oct from 2:00 AM to 4:00 AM.",
            time: "23 Oct",
            dateGroup: "Older",
            read: true,
        },
    ]);

    React.useEffect(() => {
        const injectAiNotification = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: new Date().toISOString().split("T")[0],
                        aqi: 150,
                        temp: 32,
                        humidity: 70,
                        is_festival: 0,
                    }),
                });

                const data = await response.json();

                setNotifications(prev => [
                    {
                        id: Date.now(),
                        type: "Admission",
                        title: "AI Surge Forecast Ready",
                        message: `Model predicts ${data.predicted_patients} patients and ${data.predicted_bed_occupancy}% bed occupancy for tomorrow. Beds and staff plan updated in Overview & Bed Management.`,
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        dateGroup: "Today",
                        read: false,
                    },
                    ...prev,
                ]);
            } catch (error) {
                console.error("Failed to fetch AI notification", error);
            }
        };

        injectAiNotification();
    }, []);

    const filteredNotifications = notifications.filter((n) => {
        const matchesFilter = activeFilter === "All" || n.type === activeFilter;
        const matchesSearch =
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const groupedNotifications = {
        Today: filteredNotifications.filter((n) => n.dateGroup === "Today"),
        Yesterday: filteredNotifications.filter((n) => n.dateGroup === "Yesterday"),
        Older: filteredNotifications.filter((n) => n.dateGroup === "Older"),
    };

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleAction = (type: NotificationType) => {
        switch (type) {
            case "Transport":
                alert("Opening live tracking map...");
                break;
            case "Order":
                alert("Downloading invoice...");
                break;
            case "Admission":
                alert("Opening patient profile...");
                break;
            default:
                break;
        }
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "Order":
                return "ph-shopping-cart";
            case "Admission":
                return "ph-bed";
            case "Transport":
                return "ph-ambulance";
            default:
                return "ph-bell";
        }
    };

    const getColor = (type: NotificationType) => {
        switch (type) {
            case "Order":
                return "bg-blue-100 text-blue-600";
            case "Admission":
                return "bg-lime-100 text-lime-600";
            case "Transport":
                return "bg-orange-100 text-orange-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold font-display">Notifications</h1>
                    <p className="text-gray-500">
                        Operational updates, order confirmations, and activity logs.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <i className="ph-bold ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none font-bold w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="px-4 py-2 bg-gray-100 text-black border-2 border-transparent hover:border-black rounded text-sm font-bold whitespace-nowrap"
                    >
                        Mark all as read
                    </button>
                </div>
            </header>

            <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#111]">
                {/* Filters */}
                <div className="flex border-b-2 border-black bg-gray-50 overflow-x-auto">
                    {(["All", "Order", "Admission", "Transport"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-3 font-bold text-sm border-r border-gray-200 transition-colors whitespace-nowrap ${activeFilter === filter
                                ? "bg-white text-black"
                                : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="divide-y divide-gray-100">
                    {Object.entries(groupedNotifications).map(([group, items]) => (
                        items.length > 0 && (
                            <div key={group}>
                                <div className="bg-gray-50 px-6 py-2 text-xs font-bold uppercase text-gray-500 border-b border-gray-100">
                                    {group}
                                </div>
                                {items.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-6 flex gap-4 transition-colors hover:bg-gray-50 ${!notification.read ? "bg-blue-50/30" : ""
                                            }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded flex items-center justify-center text-2xl shrink-0 ${getColor(
                                                notification.type
                                            )}`}
                                        >
                                            <i className={`ph-fill ${getIcon(notification.type)}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-lg ${!notification.read ? "font-bold" : "font-semibold text-gray-700"}`}>
                                                    {notification.title}
                                                    {!notification.read && (
                                                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block align-middle"></span>
                                                    )}
                                                </h3>
                                                <span className="text-xs text-gray-400 font-mono whitespace-nowrap ml-2">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{notification.message}</p>

                                            <div className="flex gap-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs font-bold text-black border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}
                                                {notification.type === "Transport" && (
                                                    <button onClick={() => handleAction("Transport")} className="text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 px-3 py-1 rounded hover:bg-orange-100 transition-colors flex items-center gap-1">
                                                        <i className="ph-bold ph-map-pin"></i> Track Live
                                                    </button>
                                                )}
                                                {notification.type === "Order" && (
                                                    <button onClick={() => handleAction("Order")} className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1">
                                                        <i className="ph-bold ph-file-text"></i> View Invoice
                                                    </button>
                                                )}
                                                {notification.type === "Admission" && (
                                                    <button onClick={() => handleAction("Admission")} className="text-xs font-bold text-lime-700 border border-lime-200 bg-lime-50 px-3 py-1 rounded hover:bg-lime-100 transition-colors flex items-center gap-1">
                                                        <i className="ph-bold ph-user"></i> Patient Profile
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ))}

                    {filteredNotifications.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <i className="ph-duotone ph-magnifying-glass text-4xl mb-2"></i>
                            <p>No notifications found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
