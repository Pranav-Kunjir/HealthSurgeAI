import { useState } from "react";
import { API_BASE_URL } from "../config";

interface DepartmentCardProps {
  name: string;
  occupancy: number; // 0-100
  staffing: "Optimal" | "Understaffed" | "Critical";
  patients: number;
  className?: string;
}



import { useToast } from "./Toaster";

// ... (existing imports)

export default function DepartmentCard({
  name,
  occupancy,
  staffing,
  patients,
  className = "",
}: DepartmentCardProps) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);
  const { toast } = useToast();

  const handleAgenticAction = async () => {
    if (actionInProgress) return;
    setActionCompleted(false);
    setActionInProgress(true);
    setProgress(0);

    try {
      // Simulate progress visually while request happens
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const actions = [
        "Trigger emergency staff reallocation from nearby departments.",
        "Open overflow beds and notify charge nurse by SMS/alert.",
        "Delay non-urgent admissions and reroute ambulances if needed."
      ];

      const res = await fetch(`${API_BASE_URL}/execute_emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: actions })
      });
      const data = await res.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.status === "success") {
        toast(`Emergency Protocols Executed! ${data.sent_count} SMS alerts sent.`, "success");
        setActionCompleted(true);
      } else {
        toast(`Execution Failed: ${data.message}`, "error");
      }
    } catch (e) {
      console.error("Agentic action failed", e);
      toast("Failed to connect to server.", "error");
    } finally {
      setActionInProgress(false);
    }
  };

  const aiOverview = (
    <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-md">
      <div className="font-semibold text-sm mb-1">AI Overview</div>
      <p className="mb-2">
        Automated analysis indicates staffing is{" "}
        <span className="font-bold">CRITICAL</span>. Immediate actions to reduce
        risk:
      </p>
      <ul className="list-disc list-inside text-xs space-y-1 mb-2">
        <li>Trigger emergency staff reallocation from nearby departments.</li>
        <li>Open overflow beds and notify charge nurse by SMS/alert.</li>
        <li>Delay non-urgent admissions and reroute ambulances if needed.</li>
      </ul>
      <div className="text-[10px] text-gray-500">
        Action confidence: <span className="font-bold">High</span>
      </div>
    </div>
  );

  return (
    // `h-full flex flex-col` makes the card stretch and lay out vertically
    <div
      className={`bg-white border-2 border-black p-4 shadow-[6px_6px_0px_0px_#111] transition-colors w-full h-full flex flex-col ${className}`}
    >
      {/* Top (title + badge) */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm">{name}</h4>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${staffing === "Optimal"
            ? "bg-green-100 text-green-700"
            : staffing === "Understaffed"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {staffing}
        </span>
      </div>

      {/* Middle — make this expand to fill available space so actions sit at bottom */}
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Occupancy</span>
          <span className="font-bold text-black">{occupancy}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full ${occupancy > 90 ? "bg-red-500" : occupancy > 75 ? "bg-orange-400" : "bg-lime-400"}`}
            style={{ width: `${occupancy}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <i className="ph-fill ph-users" aria-hidden />
          <span>{patients} Active Patients</span>
        </div>

        {staffing === "Critical" && (
          <div className="space-y-3 mb-3">{aiOverview}</div>
        )}

        {staffing !== "Critical" && (
          <div className="text-[11px] text-gray-500 mb-3">
            No automated emergency actions recommended.
          </div>
        )}
      </div>

      {/* Footer — actions and progress sit at the bottom */}
      <div className="mt-3">
        {staffing === "Critical" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleAgenticAction}
                disabled={actionInProgress}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition disabled:opacity-60 ${actionInProgress
                  ? "bg-gray-300 text-gray-700"
                  : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                aria-disabled={actionInProgress}
                aria-label={
                  actionInProgress
                    ? "Action in progress"
                    : "Execute emergency agentic action"
                }
              >
                {actionInProgress
                  ? "Executing..."
                  : actionCompleted
                    ? "Action Completed"
                    : "Execute Emergency Action"}
              </button>

              {actionInProgress && (
                <button
                  onClick={() => {
                    setActionInProgress(false);
                    setProgress(0);
                  }}
                  className="px-2 py-1 text-xs rounded-md border border-gray-300 text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="w-full">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${progress}%`,
                    transition: "width 300ms linear",
                  }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  aria-label="Agentic action progress"
                />
              </div>

              <div className="flex justify-between text-[11px] mt-1 text-gray-500">
                <span>
                  {actionInProgress
                    ? "In progress"
                    : actionCompleted
                      ? "Completed"
                      : "Idle"}
                </span>
                <span>{progress}%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
