import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"; // adjust the path if your project places the generated api elsewhere

type BedStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance";
type BedType = "ICU" | "Deluxe" | "Normal" | "General";

interface AddBedFormProps {
  onSuccess?: () => void;
}

export const AddBedForm: React.FC<AddBedFormProps> = ({ onSuccess }) => {
  // Required bed fields
  const [bedType, setBedType] = useState<BedType>("ICU");
  const [bedNumber, setBedNumber] = useState<number | "">("");
  const [bedStatus, setBedStatus] = useState<BedStatus>("Available");
  const [hospitalName, setHospitalName] = useState<string>("");

  // Optional patient fields
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [patientAdmittedAt, setPatientAdmittedAt] = useState<string>(""); // yyyy-mm-dd
  const [patientEstDischargeAt, setPatientEstDischargeAt] =
    useState<string>(""); // yyyy-mm-dd
  const [patientVitalBPM, setPatientVitalBPM] = useState<number | "">("");
  const [patientVitalSpO2, setPatientVitalSpO2] = useState<number | "">("");
  const [patientBP, setPatientBP] = useState<string>("");
  const [pateintConditions, setPateintConditions] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // THE FIX: use your generated API client
  const createBedMutation = useMutation(api.myFunctions.createBed);

  const toTimestampOrNull = (dateStr: string) =>
    dateStr ? new Date(dateStr).getTime() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    // Basic validation
    if (!bedType || bedNumber === "" || bedNumber === null) {
      setErrorMsg("Please provide bed type and bed number.");
      return;
    }

    const args: any = {
      bedType,
      bedNumber: Number(bedNumber),
      bedStatus,
      hospitalName: hospitalName || undefined, // server handles optional
      // patient fields (only include if provided)
    };

    // Include patient fields only if a patient name is provided or status is Occupied
    const shouldIncludePatient =
      patientName.trim() !== "" || bedStatus === "Occupied";

    if (shouldIncludePatient) {
      args.patientName = patientName || undefined;
      args.patientAge = patientAge === "" ? undefined : Number(patientAge);
      args.patientAdmittedAt =
        toTimestampOrNull(patientAdmittedAt) ?? undefined;
      args.patientEstDischargeAt =
        toTimestampOrNull(patientEstDischargeAt) ?? undefined;
      args.patientVitalBPM =
        patientVitalBPM === "" ? undefined : Number(patientVitalBPM);
      args.patientVitalSpO2 =
        patientVitalSpO2 === "" ? undefined : Number(patientVitalSpO2);
      args.patientBP = patientBP || undefined;
      args.pateintConditions = pateintConditions || undefined;
    }

    setLoading(true);
    try {
      // Call the generated API-backed mutation
      await createBedMutation(args);

      setSuccessMsg("Bed created successfully.");

      // reset form
      setBedNumber("");
      setPatientName("");
      setPatientAge("");
      setPatientAdmittedAt("");
      setPatientEstDischargeAt("");
      setPatientVitalBPM("");
      setPatientVitalSpO2("");
      setPatientBP("");
      setPateintConditions("");
      setHospitalName("");

      // notify parent (e.g., to close modal and/or refresh bed list)
      onSuccess?.();
    } catch (err: any) {
      console.error("Create bed failed", err);
      // Convex will typically surface an Error with message
      setErrorMsg(err?.message ?? "Failed to create bed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_#111] space-y-4 max-w-2xl"
    >
      <h3 className="text-xl font-bold mb-2">Add New Bed</h3>

      {/* Basic bed info */}
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Bed Type</span>
          <select
            value={bedType}
            onChange={(e) => setBedType(e.target.value as BedType)}
            className="mt-1 p-2 border border-black"
          >
            <option value="ICU">ICU</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Normal">Normal</option>
            <option value="General">General</option>
          </select>
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Bed Number</span>
          <input
            type="number"
            min={1}
            value={bedNumber}
            onChange={(e) =>
              setBedNumber(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 p-2 border border-black"
            required
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Status</span>
          <select
            value={bedStatus}
            onChange={(e) => setBedStatus(e.target.value as BedStatus)}
            className="mt-1 p-2 border border-black"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col text-xs">
        <span className="font-bold text-gray-600">
          Hospital Name (optional)
        </span>
        <input
          type="text"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          className="mt-1 p-2 border border-black"
          placeholder="e.g., Ruby Hall Clinic"
        />
      </label>

      <hr />

      <h4 className="font-bold">Patient (optional)</h4>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Patient Name</span>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="mt-1 p-2 border border-black"
            placeholder="If occupied"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Age</span>
          <input
            type="number"
            min={0}
            value={patientAge}
            onChange={(e) =>
              setPatientAge(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Admitted At</span>
          <input
            type="date"
            value={patientAdmittedAt}
            onChange={(e) => setPatientAdmittedAt(e.target.value)}
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Est. Discharge</span>
          <input
            type="date"
            value={patientEstDischargeAt}
            onChange={(e) => setPatientEstDischargeAt(e.target.value)}
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">Heart Rate (BPM)</span>
          <input
            type="number"
            min={0}
            value={patientVitalBPM}
            onChange={(e) =>
              setPatientVitalBPM(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="font-bold text-gray-600">SpO2 (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            value={patientVitalSpO2}
            onChange={(e) =>
              setPatientVitalSpO2(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs col-span-2">
          <span className="font-bold text-gray-600">BP (e.g., 120/80)</span>
          <input
            type="text"
            value={patientBP}
            onChange={(e) => setPatientBP(e.target.value)}
            className="mt-1 p-2 border border-black"
          />
        </label>

        <label className="flex flex-col text-xs col-span-2">
          <span className="font-bold text-gray-600">Conditions / Notes</span>
          <input
            type="text"
            value={pateintConditions}
            onChange={(e) => setPateintConditions(e.target.value)}
            className="mt-1 p-2 border border-black"
          />
        </label>
      </div>

      {/* Feedback */}
      {errorMsg && (
        <div className="text-sm text-red-600 font-bold">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="text-sm text-green-700 font-bold">{successMsg}</div>
      )}

      {/* Submit */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white font-bold rounded border-2 border-black hover:bg-gray-800"
        >
          {loading ? "Creating..." : "Create Bed"}
        </button>

        <button
          type="button"
          className="px-4 py-2 border-2 border-black font-bold rounded hover:bg-gray-50"
          onClick={() => {
            // quick reset
            setBedType("ICU");
            setBedNumber("");
            setBedStatus("Available");
            setHospitalName("");
            setPatientName("");
            setPatientAge("");
            setPatientAdmittedAt("");
            setPatientEstDischargeAt("");
            setPatientVitalBPM("");
            setPatientVitalSpO2("");
            setPatientBP("");
            setPateintConditions("");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddBedForm;
