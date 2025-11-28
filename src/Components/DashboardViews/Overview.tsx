import React, { useState, useEffect } from "react";
import { StatCard } from "../StatCard";
import DepartmentCard from "../DepartmentCard";
import { useQuery } from "convex/react"; // <-- added
import { api } from "../../../convex/_generated/api";
type Staffing = "Optimal" | "Understaffed" | "Critical";

interface Dept {
  name: string;
  occupancy: number;
  staffing: Staffing;
  patients: number;
}

const INITIAL_DEPARTMENTS: Dept[] = [
  { name: "Emergency (ER)", occupancy: 95, staffing: "Critical", patients: 42 },
  {
    name: "Pulmonology",
    occupancy: 88,
    staffing: "Understaffed",
    patients: 28,
  },
  { name: "Cardiology", occupancy: 65, staffing: "Optimal", patients: 15 },
  { name: "General Ward", occupancy: 72, staffing: "Critical", patients: 56 },
];

interface OverviewProps {
  alerts: any[];
  onNavigate: (tab: string) => void;
  insight: string | null;
  actions?: string[];
  hospitalName?: string; // <-- optional prop to allow parent override
}

export const Overview: React.FC<OverviewProps> = ({
  alerts,
  onNavigate,
  insight,
  actions,
  hospitalName,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [forecastData, setForecastData] = useState<number[]>([
    40, 45, 55, 65, 95, 85, 60,
  ]);
  const [departments, setDepartments] = useState<Dept[]>(INITIAL_DEPARTMENTS);

  // Convex hook to fetch hospitals for the authenticated user.
  // Returns an array of hospital documents or null while loading.
  const hospitals = useQuery(api.myFunctions.getHospitalsForUser) as Array<{
    name?: string;
  }> | null;

  // Decide which name to display:
  const hospitalDisplayName =
    hospitalName ??
    (hospitals && hospitals.length > 0 && hospitals[0].name) ??
    "Apollo Navi Mumbai";

  const criticalDeps = departments.filter((d) => d.staffing === "Critical");
  const nonCriticalDeps = departments.filter((d) => d.staffing !== "Critical");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8002/historical");
        const data = await response.json();

        const raw = data.slice(-7).map((d: any) => {
          const val = (d.Patients ??
            d.patients ??
            d.predicted_patients) as number;
          const num = Number(val);
          return Number.isFinite(num) && num >= 0 ? num : 0;
        });

        if (!raw.length) {
          // Keep default demo data if backend returns nothing
          return;
        }

        const maxVal = Math.max(...raw);
        if (!Number.isFinite(maxVal) || maxVal <= 0) {
          // Avoid NaNs / invisible bars
          return;
        }

        const normalizedData = raw.map((v: number) =>
          Math.max(5, Math.round((v / (maxVal * 1.1)) * 100)),
        );

        setForecastData(normalizedData);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        // On error, keep existing fallback values
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8002/predict", {
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
        const factor = data.predicted_patients / 850; // scale around baseline

        setDepartments(
          INITIAL_DEPARTMENTS.map((dep) => {
            const occupancy = Math.min(100, Math.round(dep.occupancy * factor));
            const patients = Math.max(1, Math.round(dep.patients * factor));

            let staffing: Staffing = "Optimal";
            if (occupancy > 90) {
              staffing = "Critical";
            } else if (occupancy > 80) {
              staffing = "Understaffed";
            }

            return {
              ...dep,
              occupancy,
              patients,
              staffing,
            };
          }),
        );
      } catch (error) {
        console.error("Failed to update departments", error);
      }
    };

    updateDepartments();
  }, []);

  const erDept = departments.find((d) => d.name.includes("Emergency"));
  const erBaseTarget = 30;
  const erWaitMinutes = erDept
    ? Math.min(
        120,
        Math.max(10, Math.round(20 + (erDept.occupancy - 60) * 0.7)),
      )
    : erBaseTarget;
  const erDelta = erWaitMinutes - erBaseTarget;
  const erTrendDirection: "up" | "down" | "neutral" =
    erDelta > 2 ? "up" : erDelta < -2 ? "down" : "neutral";
  const erTrendLabel = `${Math.abs(erDelta)}m`;
  const erWaitingCount = erDept
    ? Math.max(5, Math.round(erDept.patients * 0.25))
    : 0;
  const erProgress = Math.min(
    100,
    Math.max(0, Math.round((erWaitMinutes / 60) * 100)),
  );
  const erSubtext =
    erDelta >= 0
      ? `Exceeds target by ${erDelta}m`
      : `Better than target by ${Math.abs(erDelta)}m`;

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Hospital Command Center
          </div>
          <h1 className="text-3xl font-bold font-display leading-none">
            {hospitalDisplayName}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Predicting Healthcare Surges, Powering Smarter Hospitals
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-bold font-display tabular-nums">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase">
              {currentTime.toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-black text-white border-2 border-lime-400 shadow-[4px_4px_0px_0px_#bef264]">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <div className="text-[10px] font-bold text-lime-400 uppercase leading-none">
                Status Level
              </div>
              <div className="text-sm font-bold leading-none">
                CRITICAL SURGE
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Live Alert Ticker */}
      <div className="bg-black text-lime-400 text-xs font-mono py-2 px-4 mb-6 overflow-hidden whitespace-nowrap relative flex items-center">
        <span className="font-bold text-white mr-4 uppercase tracking-wider">
          System Log:
        </span>

        {/* Scroll container */}
        <div
          className="inline-flex overflow-x-scroll no-scrollbar scrollbar-hide element-with-overflow"
          onWheel={(e) => {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY; // convert wheel → horizontal scroll
          }}
          style={{ scrollBehavior: "smooth" }}
        >
          <span className="mr-8">[14:32] ICU Bed #4 Occupied</span>
          <span className="mr-8 text-red-500">
            [14:30] CRITICAL: Oxygen Pressure Drop in Ward A
          </span>
          <span className="mr-8">[14:28] Ambulance #102 Arrived (Trauma)</span>
          <span className="mr-8">[14:25] Shift B Staffing Check Complete</span>
          <span className="mr-8 text-orange-400">
            [14:20] WARNING: AQI Spike Detected (312)
          </span>
          <span className="mr-8 text-lime-400">
            [14:15] Patient Advisory Sent: "High Pollution - Avoid Outdoor
            Activities"
          </span>
        </div>
      </div>

      {/* Agentic Insight Panel */}
      {insight && (
        <div
          className={`mb-6 p-6 rounded-xl border-2 border-black relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700 shadow-[8px_8px_0px_0px_#bef264] bg-white text-black`}
        >
          {/* Decorative Pattern */}
          <div
            className={`absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full blur-3xl ${actions && actions.length > 0 ? "bg-red-500/10" : "bg-lime-400/20"}`}
          ></div>

          <div className="relative z-10 flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] ${actions && actions.length > 0 ? "bg-red-100 text-red-600" : "bg-black text-lime-400"}`}
            >
              <i
                className={`text-xl ph-fill ${actions && actions.length > 0 ? "ph-siren animate-pulse" : "ph-sparkle"}`}
              ></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold font-display mb-2 flex items-center gap-3">
                {actions && actions.length > 0
                  ? "EMERGENCY ACTION PROTOCOL"
                  : "AI Strategic Insight"}
                <span
                  className={`text-[10px] px-2 py-1 rounded border-2 border-black font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] ${actions && actions.length > 0 ? "bg-red-600 text-white" : "bg-lime-400 text-black"}`}
                >
                  {actions && actions.length > 0 ? "CRITICAL" : "BETA"}
                </span>
              </h3>
              <p className="font-medium text-base leading-relaxed mb-4 text-gray-600">
                {insight}
              </p>

              {actions && actions.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5 border-2 border-red-100">
                  <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <i className="ph-bold ph-lightning"></i>
                    Immediate Actions Required:
                  </div>
                  <ul className="space-y-3 mb-5">
                    {actions.map((action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-bold text-gray-800"
                      >
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 mt-0.5">
                          <i className="ph-bold ph-check text-xs"></i>
                        </div>
                        {action}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-red-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-red-800">
                      Confidence:{" "}
                      <span className="text-white bg-black px-2 py-1 rounded ml-1">
                        High
                      </span>
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            "http://localhost:8002/execute_emergency",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ actions: actions }),
                            },
                          );
                          const data = await res.json();
                          if (data.status === "success") {
                            alert(
                              `Emergency Protocols Executed! ${data.sent_count} SMS alerts sent.`,
                            );
                          } else {
                            alert(`Execution Failed: ${data.message}`);
                          }
                        } catch (e) {
                          alert("Failed to connect to server.");
                        }
                      }}
                      className="bg-red-600 text-white border-2 border-black text-xs font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide hover:bg-red-500"
                    >
                      <i className="ph-bold ph-paper-plane-right"></i>
                      Execute All Actions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="ER Wait Time"
          value={`${erWaitMinutes}m`}
          subtext={erSubtext}
          icon="ph-clock-countdown"
          trend={erTrendDirection}
          trendValue={erTrendLabel}
          alert={true}
          progress={erProgress}
          secondaryValue={String(erWaitingCount)}
          secondaryLabel="Waiting"
          sparklineData={[erBaseTarget - 5, erBaseTarget, erWaitMinutes]}
        />
        <StatCard
          title="ICU Capacity"
          value="92%"
          subtext="2 Beds Available"
          icon="ph-bed"
          trend="up"
          trendValue="5%"
          progress={92}
          secondaryValue="24/26"
          secondaryLabel="Occupied"
          sparklineData={[80, 82, 85, 88, 90, 92, 92]}
        />
        <StatCard
          title="Ambulance Status"
          value="4"
          subtext="Inbound (ETA < 10m)"
          icon="ph-ambulance"
          trend="neutral"
          trendValue="-"
          secondaryValue="2"
          secondaryLabel="Available"
          sparklineData={[2, 3, 1, 4, 2, 3, 4]}
        />
        <StatCard
          title="Oxygen Supply"
          value="98%"
          subtext="Refill scheduled tomorrow"
          icon="ph-cylinder"
          trend="down"
          trendValue="2%"
          progress={98}
          sparklineData={[100, 99, 99, 98, 98, 98, 98]}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Forecast & Departments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Forecast Chart */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold font-display">
                  Patient Influx Forecast
                </h2>
                <p className="text-xs text-gray-500">
                  AI Prediction vs Capacity
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                  <span className="w-2 h-2 bg-lime-400 rounded-full"></span>{" "}
                  Normal
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>{" "}
                  Critical
                </span>
              </div>
            </div>

            <div className="h-48 flex items-end gap-4 px-2 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-gray-100 h-full w-full"></div>
                <div className="border-b border-gray-100 h-full w-full"></div>
                <div className="border-b border-gray-100 h-full w-full"></div>
                <div className="border-b border-gray-100 h-full w-full"></div>
              </div>

              {forecastData.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end group relative z-10 h-full"
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {h} Patients
                  </div>

                  <div
                    className="w-full bg-gray-100 rounded-t relative overflow-hidden transition-all group-hover:bg-gray-200"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className={`absolute bottom-0 w-full transition-all duration-1000 ${
                        h > 80 ? "bg-red-500" : "bg-lime-400"
                      }`}
                      style={{ height: `${h * 0.8}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-[10px] text-gray-500 mt-2 font-bold uppercase">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Load */}
          <div>
            <h3 className="text-sm font-bold font-display uppercase mb-3 text-gray-500">
              Department Load
            </h3>

            {criticalDeps.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">
                  Critical Departments
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criticalDeps.map((dep) => (
                    <div key={dep.name} className="h-full">
                      <DepartmentCard {...dep} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Other Departments
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nonCriticalDeps.map((dep) => (
                  <div key={dep.name} className="h-full">
                    <DepartmentCard {...dep} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Recent Admissions */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white border-2 border-black p-0 shadow-[6px_6px_0px_0px_#111] overflow-hidden">
            <div className="bg-black text-white p-3 flex justify-between items-center">
              <h2 className="text-sm font-bold font-display flex items-center gap-2">
                <i className="ph-fill ph-warning text-lime-400"></i>
                Active Alerts
              </h2>
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {alerts.length} New
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {alerts.slice(0, 3).map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${alert.type === "Critical" ? "bg-red-50/50" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-[10px] font-bold border px-1 rounded uppercase ${alert.type === "Critical" ? "text-red-600 border-red-200 bg-red-100" : "text-orange-600 border-orange-200 bg-orange-100"}`}
                    >
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {alert.time}
                    </span>
                  </div>
                  <div className="text-sm font-bold mb-1">{alert.title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {alert.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => onNavigate("alerts")}
                className="text-xs font-bold text-gray-500 hover:text-black"
              >
                View All Alerts
              </button>
            </div>
          </div>

          {/* Recent Critical Admissions */}
          <div className="bg-white border-2 border-black p-4 shadow-[6px_6px_0px_0px_#111]">
            <h3 className="text-sm font-bold font-display uppercase mb-3 text-gray-500">
              Recent Critical Admissions
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Triage</th>
                  <th className="pb-2 font-medium">Dept</th>
                  <th className="pb-2 font-medium text-right">LOS (Est)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { id: "#P-902", triage: "Red", dept: "ER", los: "4d" },
                  { id: "#P-901", triage: "Yellow", dept: "Pulmo", los: "2d" },
                  { id: "#P-899", triage: "Red", dept: "ICU", los: "7d" },
                  { id: "#P-898", triage: "Yellow", dept: "Ortho", los: "1d" },
                ].map((p, i) => (
                  <tr key={i} className="group hover:bg-gray-50">
                    <td className="py-2 font-bold font-mono">{p.id}</td>
                    <td className="py-2">
                      <span
                        className={`w-2 h-2 rounded-full inline-block mr-1 ${
                          p.triage === "Red" ? "bg-red-500" : "bg-yellow-400"
                        }`}
                      ></span>
                      {p.triage}
                    </td>
                    <td className="py-2 text-gray-600">{p.dept}</td>
                    <td className="py-2 text-right font-medium">{p.los}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
