import React from "react";

interface AlertsViewProps {
    alerts: any[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts }) => {

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold font-display">System Alerts</h1>
                    <p className="text-gray-500">
                        Manage and broadcast critical notifications.
                    </p>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white border-2 border-black rounded text-sm font-bold hover:bg-red-600 shadow-[4px_4px_0px_0px_#000]">
                    <i className="ph-bold ph-megaphone mr-2"></i> Broadcast SMS/Email Alert
                </button>
            </header>

            <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#111]">
                {/* Filter Tabs */}
                <div className="flex border-b-2 border-black bg-gray-50">
                    <button className="px-6 py-3 font-bold text-sm bg-white border-r border-gray-200">
                        Active ({alerts.length})
                    </button>
                    <button className="px-6 py-3 font-bold text-sm text-gray-500 hover:bg-gray-100 border-r border-gray-200">
                        Resolved
                    </button>
                    <button className="px-6 py-3 font-bold text-sm text-gray-500 hover:bg-gray-100">
                        All History
                    </button>
                </div>

                {/* Alert List */}
                <div className="divide-y divide-gray-100">
                    {alerts.map((alert, i) => (
                        <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div
                                        className={`w-10 h-10 rounded flex items-center justify-center text-xl ${alert.type === "Critical"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-orange-100 text-orange-600"
                                            }`}
                                    >
                                        <i className="ph-fill ph-warning"></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{alert.title}</h3>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${alert.type === "Critical"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-orange-400 text-white"
                                                    }`}
                                            >
                                                {alert.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{alert.desc}</p>
                                        <div className="text-xs text-gray-400 font-mono">
                                            {alert.time} • ID: #ALT-{202500 + i}
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded text-xs font-bold hover:bg-black hover:text-white transition-colors">
                                    {alert.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
