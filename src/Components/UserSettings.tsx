// components/UserSettings.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PatientDoc {
  _id?: string;
  userId?: any;
  name?: string;
  contact?: string;
  location?: string;
  createdAt?: number;
}

// Try to detect whether the generated API has getPatientForUser
const hasGetPatient = Boolean((api.myFunctions as any).getPatientForUser);

const UserSettings: React.FC = () => {
  // If the query exists, use it normally (typed cast to any to avoid compile errors if missing).
  const patientFromQuery = hasGetPatient
    ? (useQuery(
        (api.myFunctions as any).getPatientForUser,
      ) as PatientDoc | null)
    : null;

  // Fallback: createPatientUser mutation (exists in your earlier server file)
  const createPatient = useMutation(
    (api.myFunctions as any).createPatientUser as any,
  );
  // update mutation (you said you added updatePatientForUser)
  const updatePatient = useMutation(
    (api.myFunctions as any).updatePatientForUser as any,
  );

  // Local state to support the fallback when query doesn't exist
  const [localPatient, setLocalPatient] = useState<PatientDoc | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Use whichever patient source is available (query wins)
  const patient = patientFromQuery ?? localPatient;

  // form state
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // If there's no getPatientForUser query available, call createPatientUser once to ensure a patient doc exists,
  // then keep it in localPatient.
  useEffect(() => {
    if (!hasGetPatient && !localPatient && !loadingCreate) {
      setLoadingCreate(true);
      createPatient()
        .then((res: any) => {
          // createPatient returns the patient doc or null (based on your server implementation).
          if (res) setLocalPatient(res as PatientDoc);
        })
        .catch((err: any) => {
          console.error("createPatientUser failed:", err);
        })
        .finally(() => setLoadingCreate(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // populate local form state when patient loads (from query or fallback)
  useEffect(() => {
    if (patient) {
      setName(patient.name ?? "");
      setContact(patient.contact ?? "");
      setLocation(patient.location ?? "");
    }
  }, [patient]);

  const handleSave = async () => {
    setStatusMsg(null);
    setSaving(true);
    try {
      const patch: Record<string, any> = {};
      if (name !== (patient?.name ?? "")) patch.name = name;
      if (contact !== (patient?.contact ?? "")) patch.contact = contact;
      if (location !== (patient?.location ?? "")) patch.location = location;

      if (Object.keys(patch).length === 0) {
        setStatusMsg("No changes to save.");
        setSaving(false);
        return;
      }

      // call updatePatientForUser (cast to any to avoid compile-time mismatch)
      const updated = await updatePatient({ patch } as any);
      setStatusMsg("Saved successfully.");

      // update local copy if fallback path is used
      if (!hasGetPatient) {
        setLocalPatient(updated as PatientDoc);
      }

      // sync form values with returned document (if any)
      setName((updated as any)?.name ?? patient?.name ?? "");
      setContact((updated as any)?.contact ?? patient?.contact ?? "");
      setLocation((updated as any)?.location ?? patient?.location ?? "");
    } catch (err: any) {
      console.error("Failed to save patient:", err);
      setStatusMsg(err?.message ?? "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  // Loading states
  if (!patient) {
    // Either waiting for query or createPatientUser
    return (
      <div className="p-6 bg-white border-2 border-black rounded-lg max-w-3xl">
        <h3 className="text-xl font-bold mb-2">Profile</h3>
        <p className="text-sm text-gray-500">
          {hasGetPatient
            ? "Loading your profile..."
            : loadingCreate
              ? "Setting up profile..."
              : "Initializing..."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-2 border-black rounded-lg max-w-3xl">
      <h3 className="text-2xl font-bold mb-4">Account Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-xs font-bold text-gray-600 mb-1">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded focus:outline-none focus:border-black"
            placeholder="Your name"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-xs font-bold text-gray-600 mb-1">Contact</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded focus:outline-none focus:border-black"
            placeholder="+91 98xxxx..."
          />
        </label>

        <label className="flex flex-col col-span-2">
          <span className="text-xs font-bold text-gray-600 mb-1">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded focus:outline-none focus:border-black"
            placeholder="City, State"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {statusMsg && <span>{statusMsg}</span>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              // reset to last saved values
              setName(patient.name ?? "");
              setContact(patient.contact ?? "");
              setLocation(patient.location ?? "");
              setStatusMsg("Reverted changes.");
              setTimeout(() => setStatusMsg(null), 2000);
            }}
            className="px-4 py-2 border-2 border-black rounded font-bold hover:bg-gray-50 transition"
            disabled={saving}
          >
            Revert
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white font-bold rounded shadow-[4px_4px_0px_0px_#bef264] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
