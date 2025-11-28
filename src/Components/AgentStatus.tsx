import React from "react";

export type AgentState = "IDLE" | "THINKING" | "ACTING" | "CRITICAL";

interface AgentStatusProps {
    state: AgentState;
    message?: string;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ state, message }) => {
    const getColor = () => {
        switch (state) {
            case "IDLE":
                return "bg-gray-500";
            case "THINKING":
                return "bg-blue-500";
            case "ACTING":
                return "bg-lime-400";
            case "CRITICAL":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getIcon = () => {
        switch (state) {
            case "IDLE":
                return "ph-moon";
            case "THINKING":
                return "ph-brain";
            case "ACTING":
                return "ph-lightning";
            case "CRITICAL":
                return "ph-warning";
            default:
                return "ph-circle";
        }
    };

    return (
        <div className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full border-2 border-gray-800 shadow-lg">
            <div className={`w-3 h-3 rounded-full ${getColor()} animate-pulse`}></div>
            <div className="flex items-center gap-2">
                <i className={`ph-fill ${getIcon()} text-gray-400`}></i>
                <span className="text-xs font-bold font-mono tracking-wider uppercase">
                    {state}
                </span>
            </div>
            {message && (
                <>
                    <div className="w-px h-4 bg-gray-700"></div>
                    <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">
                        {message}
                    </span>
                </>
            )}
        </div>
    );
};
