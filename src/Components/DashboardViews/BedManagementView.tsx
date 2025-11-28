import React, { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AddBedModal } from "../AddBedModal"; // <- adjust path if needed

// Types
type BedStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance";
type BedType = "ICU" | "Deluxe" | "Normal" | "General";

interface Patient {
  name?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  admissionDate?: string;
  predictedDischarge?: string;
  condition?: "Stable" | "Critical" | "Recovering";
  vitals?: {
    heartRate?: number;
    spO2?: number;
    bp?: string;
  };
}

interface Bed {
  id: string;
  type: BedType;
  status: BedStatus;
  patient?: Patient;
  // original raw doc kept for debugging
  __raw?: any;
}

export const BedManagementView: React.FC = () => {
  const [showAddBed, setShowAddBed] = useState(false);
  const [activeTab, setActiveTab] = useState<BedType>("ICU");
  const [filterStatus, setFilterStatus] = useState<BedStatus | "All">("All");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Convex query -> returns `undefined` while loading, or array when ready
  const bedsFromServer = useQuery(api.myFunctions.getBedsForUser);

  const isLoading = bedsFromServer === undefined;

  // Helpers for UI colours/icons (kept from your original)
  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case "Available":
        return "bg-lime-400";
      case "Occupied":
        return "bg-red-500";
      case "Cleaning":
        return "bg-yellow-400";
      case "Maintenance":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  const getStatusIcon = (status: BedStatus) => {
    switch (status) {
      case "Available":
        return "ph-check-circle";
      case "Occupied":
        return "ph-user";
      case "Cleaning":
        return "ph-broom";
      case "Maintenance":
        return "ph-wrench";
      default:
        return "ph-question";
    }
  };

  // Normalize Convex docs to UI Bed type
  const normalizedBeds: Bed[] = useMemo(() => {
    if (!bedsFromServer) return [];

    const mapCondition = (raw: any): Patient["condition"] => {
      const c = (raw ?? "").toString().toLowerCase();
      if (c.includes("critical")) return "Critical";
      if (c.includes("recover")) return "Recovering";
      if (c.length > 0) return "Recovering"; // treat unknown text as Recovering
      return "Stable";
    };

    const mapGender = (raw: any): Patient["gender"] => {
      const g = (raw ?? "").toString().toLowerCase();
      if (g === "male") return "Male";
      if (g === "female") return "Female";
      return "Other";
    };

    return bedsFromServer.map((doc: any) => {
      // Build id: prefer _id if present
      let id = "";
      try {
        if (doc._id && typeof doc._id.toString === "function") {
          id = doc._id.toString();
        }
      } catch {
        id = "";
      }
      if (!id) {
        id = `${doc.bedType ?? "Unknown"}-${doc.bedNumber ?? Math.random().toString(36).slice(2, 7)}`;
      }

      // Map patient if any
      const hasPatient =
        typeof doc.patientName !== "undefined" ||
        typeof doc.patientAge !== "undefined" ||
        typeof doc.patientAdmittedAt !== "undefined" ||
        typeof doc.patientVitalBPM !== "undefined" ||
        typeof doc.patientBP !== "undefined";

      const patient: Patient | undefined = hasPatient
        ? {
            name: (doc.patientName ?? "") as string,
            age: Number(doc.patientAge ?? 0),
            gender: mapGender(doc.patientGender),
            admissionDate: doc.patientAdmittedAt
              ? new Date(Number(doc.patientAdmittedAt))
                  .toISOString()
                  .slice(0, 10)
              : "",
            predictedDischarge: doc.patientEstDischargeAt
              ? new Date(Number(doc.patientEstDischargeAt))
                  .toISOString()
                  .slice(0, 10)
              : "",
            condition: mapCondition(doc.pateintConditions),
            vitals: {
              heartRate: Number(doc.patientVitalBPM ?? 0),
              spO2: Number(doc.patientVitalSpO2 ?? 0),
              bp: (doc.patientBP ?? "") as string,
            },
          }
        : undefined;

      const status = (doc.bedStatus as BedStatus) ?? "Available";
      const type = (doc.bedType as BedType) ?? "Normal";

      return {
        id,
        type,
        status,
        patient,
        __raw: doc,
      };
    });
  }, [bedsFromServer]);

  // Apply tab and filter
  const currentBeds = normalizedBeds.filter((b) => b.type === activeTab);
  const filteredBeds =
    filterStatus === "All"
      ? currentBeds
      : currentBeds.filter((bed) => bed.status === filterStatus);

  // Stats
  const totalBeds = normalizedBeds.length;
  const occupiedBeds = normalizedBeds.filter(
    (b) => b.status === "Occupied",
  ).length;
  const occupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Pending admissions = number of Available beds
  const pendingAdmissions = normalizedBeds.filter(
    (b) => b.status === "Available",
  ).length;

  // Discharges Today: compare patientEstDischargeAt (ms timestamp) to today's date
  const dischargesToday = (() => {
    if (!bedsFromServer || bedsFromServer.length === 0) return 0;
    const today = new Date();
    const todayYMD = today.toISOString().slice(0, 10); // YYYY-MM-DD
    let count = 0;
    for (const doc of bedsFromServer) {
      const ts = doc.patientEstDischargeAt;
      if (!ts) continue;
      const d = new Date(ts).toISOString().slice(0, 10);
      if (d === todayYMD) count++;
    }
    return count;
  })();

  const stats = [
    { label: "Total Beds", value: totalBeds },
    { label: "Occupancy Rate", value: `${occupancyRate}%` },
    { label: "Pending Admissions", value: pendingAdmissions },
    { label: "Discharges Today", value: dischargesToday },
  ];

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Bed Management</h1>
          <p className="text-gray-500">
            Real-time tracking of hospital bed occupancy and status.
          </p>
        </div>
        <button
          onClick={() => setShowAddBed(true)}
          className="px-4 py-2 bg-black text-white border-2 border-black rounded text-sm font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_#111]"
        >
          + Add New Bed
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#111] flex flex-col justify-between"
          >
            <div className="text-xs text-gray-500 uppercase font-bold mb-2">
              {stat.label}
            </div>
            <div className="text-3xl font-bold font-mono leading-none">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls: Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-2">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["ICU", "Deluxe", "Normal", "General"] as BedType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 font-bold text-sm transition-colors relative ${
                activeTab === type
                  ? "text-black bg-gray-100 rounded-t"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {type} Ward
              {activeTab === type && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(
            ["All", "Available", "Occupied", "Cleaning", "Maintenance"] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-bold rounded-full border border-black transition-all ${
                filterStatus === status
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Grid */}
      <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-display">
            {activeTab} Ward Status{" "}
            <span className="text-gray-400 text-sm">
              ({filteredBeds.length} Beds)
            </span>
          </h2>

          {/* Legend */}
          <div className="flex gap-4 text-xs font-bold uppercase">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-lime-400 border border-black"></span>{" "}
              Available
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 border border-black"></span>{" "}
              Occupied
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 border border-black"></span>{" "}
              Cleaning
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-200 border border-black"></span>{" "}
              Maintenance
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-gray-500">Loading beds...</div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filteredBeds.map((bed) => (
              <div
                key={bed.id}
                onClick={() => setSelectedBed(bed)}
                className={`aspect-square border border-black relative group cursor-pointer transition-transform hover:scale-105 ${getStatusColor(bed.status)}`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black opacity-60">
                  <i
                    className={`ph-fill ${getStatusIcon(bed.status)} text-lg mb-1`}
                  ></i>
                  <span className="text-[10px] font-bold">
                    {/* try to show short label: if id contains '-', show last segment, else index-ish */}
                    {bed.id.includes("-")
                      ? bed.id.split("-").pop()
                      : bed.id.slice(0, 6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bed Details Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#111] w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div
              className={`p-4 border-b-2 border-black flex justify-between items-center ${getStatusColor(selectedBed.status)}`}
            >
              <div>
                <h3 className="text-xl font-bold font-display">
                  Bed {selectedBed.id}
                </h3>
                <p className="text-xs font-bold uppercase opacity-75">
                  {selectedBed.type} Ward • {selectedBed.status}
                </p>
              </div>
              <button
                onClick={() => setSelectedBed(null)}
                className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {selectedBed.status === "Occupied" && selectedBed.patient ? (
                <>
                  {/* Patient Info */}
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">
                      Patient Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400">Name</div>
                        <div className="font-bold">
                          {selectedBed.patient.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">
                          Age / Gender
                        </div>
                        <div className="font-bold">
                          {selectedBed.patient.age} /{" "}
                          {selectedBed.patient.gender}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Admitted</div>
                        <div className="font-bold">
                          {selectedBed.patient.admissionDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">
                          Est. Discharge
                        </div>
                        <div className="font-bold">
                          {selectedBed.patient.predictedDischarge}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-3">
                      Live Vitals
                    </h4>
                    <div className="flex justify-between text-center">
                      <div>
                        <div className="text-2xl font-mono font-bold text-red-500">
                          {selectedBed.patient.vitals?.heartRate}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          BPM
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-mono font-bold text-blue-500">
                          {selectedBed.patient.vitals?.spO2}%
                        </div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          SpO2
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-mono font-bold text-purple-500">
                          {selectedBed.patient.vitals?.bp}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          BP
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">
                      Condition
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedBed.patient.condition === "Critical" ? "bg-red-100 text-red-600" : selectedBed.patient.condition === "Recovering" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                    >
                      {selectedBed.patient.condition}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="ph-duotone ph-bed text-4xl mb-2"></i>
                  <p>
                    This bed is currently {selectedBed.status.toLowerCase()}.
                  </p>
                  {selectedBed.status === "Available" && (
                    <p className="text-sm">Ready for patient admission.</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                {selectedBed.status === "Occupied" ? (
                  <>
                    <button className="py-2 bg-black text-white font-bold rounded hover:bg-gray-800">
                      Discharge
                    </button>
                    <button className="py-2 border-2 border-black font-bold rounded hover:bg-gray-50">
                      Transfer
                    </button>
                  </>
                ) : selectedBed.status === "Available" ? (
                  <button className="col-span-2 py-2 bg-lime-400 text-black font-bold rounded hover:bg-lime-500 border-2 border-black">
                    Admit Patient
                  </button>
                ) : (
                  <button className="col-span-2 py-2 border-2 border-black font-bold rounded hover:bg-gray-50">
                    Mark as Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AddBed Modal */}
      {showAddBed && <AddBedModal onClose={() => setShowAddBed(false)} />}
    </div>
  );
};

export default BedManagementView;
