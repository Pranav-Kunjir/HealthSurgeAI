import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    alert?: boolean;
    progress?: number; // 0 to 100
    secondaryValue?: string;
    secondaryLabel?: string;
    sparklineData?: number[]; // Array of values for the sparkline
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtext,
    icon,
    trend,
    trendValue,
    alert,
    progress,
    secondaryValue,
    secondaryLabel,
    sparklineData,
}) => {
    // Helper to generate SVG path for sparkline
    const getSparklinePath = (data: number[]) => {
        if (!data || data.length === 0) return "";
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 30;

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d - min) / range) * height;
            return `${x},${y}`;
        }).join(" ");

        return `M ${points}`;
    };

    return (
        <div
            className={`bg-white border-2 border-black p-5 relative group hover:-translate-y-1 transition-transform overflow-hidden ${alert ? "shadow-[6px_6px_0px_0px_#ef4444]" : "shadow-[6px_6px_0px_0px_#111]"
                }`}
        >
            {/* Sparkline Background */}
            {sparklineData && (
                <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d={getSparklinePath(sparklineData)} fill="none" stroke="currentColor" strokeWidth="2" className={alert ? "text-red-600" : "text-lime-600"} />
                        <path d={`${getSparklinePath(sparklineData)} V 30 H 0 Z`} fill="currentColor" className={alert ? "text-red-600" : "text-lime-600"} opacity="0.2" />
                    </svg>
                </div>
            )}

            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-8 h-8 rounded flex items-center justify-center text-lg border-2 border-black ${alert ? "bg-red-100 text-red-600" : "bg-lime-100 text-lime-600"
                            }`}
                    >
                        <i className={`ph-fill ${icon}`}></i>
                    </div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                        {title}
                    </h3>
                </div>
                {trend && (
                    <div
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-black ${trend === "up"
                            ? "bg-red-100 text-red-600"
                            : trend === "down"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between mb-2 relative z-10">
                <div className="text-3xl font-bold font-display leading-none">{value}</div>
                {secondaryValue && (
                    <div className="text-right">
                        <div className="text-sm font-bold">{secondaryValue}</div>
                        <div className="text-[10px] text-gray-500 uppercase">{secondaryLabel}</div>
                    </div>
                )}
            </div>

            {progress !== undefined && (
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2 relative z-10">
                    <div
                        className={`h-full ${progress > 80 ? "bg-red-500" : "bg-lime-500"
                            }`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}

            {subtext && <div className="text-xs text-gray-500 font-medium relative z-10">{subtext}</div>}
        </div>
    );
};
