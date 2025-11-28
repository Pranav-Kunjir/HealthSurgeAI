// components/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PatientPatch {
  name?: string;
  contact?: string;
  location?: string;
}

const UserProfile: React.FC = () => {
  // Convex query to get the authenticated user doc (from your myFunctions.getUser)
  const user = useQuery(api.myFunctions.getUser);

  // Mutation to update (or create) the patient record for the authenticated user
  const updatePatient = useMutation(api.myFunctions.updatePatientForUser);

  // Local form state (init from patient/user when available)
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form fields from user doc when loaded
  useEffect(() => {
    if (user) {
      // user doc may have name/email etc. If you also want to populate from a 'patients' doc,
      // consider fetching it similarly; here we default to user fields.
      setName(user.name ?? "");
      setContact(user.email ?? "");
      // instead of setLocation((user.location as string) ?? "");
      setLocation(((user as any).location as string) ?? "");
    }
  }, [user]);

  const onCancel = () => {
    setError(null);
    setSuccess(null);
    // reset to current user snapshot
    setName(user?.name ?? "");
    setContact(user?.email ?? "");
    // instead of setLocation((user.location as string) ?? "");
    setLocation(((user as any).location as string) ?? "");

    setEditing(false);
  };

  const onSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const patch: PatientPatch = {
      name: name.trim() || undefined,
      contact: contact.trim() || undefined,
      location: location.trim() || undefined,
    };

    try {
      const res = await updatePatient({ patch });
      // res should be the updated/created patient doc (based on your backend)
      setSuccess("Profile updated");
      // update local UI with server truth (if server returned fields differently)
      if (res?.name) setName(res.name);
      if (res?.contact) setContact(res.contact);
      if (res?.location) setLocation(res.location ?? "");
      setEditing(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err?.message ?? "Failed to save. Try again.");
    } finally {
      setSaving(false);
      // clear success after a short time
      setTimeout(() => setSuccess(null), 3500);
    }
  };

  // Mock Data (kept from your original component)
  const medicalHistory = [
    {
      date: "2024-10-15",
      diagnosis: "Viral Fever",
      doctor: "Dr. Sharma",
      hospital: "Apollo Hospitals",
    },
    {
      date: "2024-08-20",
      diagnosis: "Routine Checkup",
      doctor: "Dr. Patel",
      hospital: "Lilavati Hospital",
    },
    {
      date: "2024-05-10",
      diagnosis: "Sprained Ankle",
      doctor: "Dr. Singh",
      hospital: "Max Healthcare",
    },
  ];

  const upcomingAppointments = [
    {
      date: "2024-11-30",
      time: "10:00 AM",
      type: "Follow-up",
      doctor: "Dr. Sharma",
      hospital: "Apollo Hospitals",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header / Profile Card */}
        <div className="bg-white border-2 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_#bef264] flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full border-4 border-lime-400 overflow-hidden shrink-0">
            {user?.image ? (
              // If your user doc uses `image`, show it
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold font-display mb-2">
              {user?.name || name || "Guest User"}
            </h1>
            <p className="text-gray-500 font-medium mb-4">
              {user?.email || contact || "guest@example.com"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-bold border border-lime-200">
                Premium Member
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                O+ Blood Group
              </span>
            </div>
          </div>

          {/* small "Edit Profile" trigger -> expands to form below */}
          <div className="shrink-0 w-full md:w-auto">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-black text-white px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-white hover:text-black transition-all w-full md:w-auto"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all w-full md:w-auto"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Inline Edit Section: small form that appears below header when editing */}
        {editing && (
          <div className="bg-white border-2 border-black p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
            <h3 className="text-lg font-bold mb-3">Edit profile</h3>
            <form onSubmit={onSave} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <label className="text-sm font-medium">Name</label>
                <input
                  className="md:col-span-2 p-2 border border-gray-200 rounded-lg w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <label className="text-sm font-medium">
                  Contact (email/phone)
                </label>
                <input
                  className="md:col-span-2 p-2 border border-gray-200 rounded-lg w-full"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com or +91 9XXXXXXXXX"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <label className="text-sm font-medium">Location</label>
                <input
                  className="md:col-span-2 p-2 border border-gray-200 rounded-lg w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-lime-600 text-white px-4 py-2 rounded font-bold border-2 border-black disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded border border-gray-300"
                >
                  Cancel
                </button>

                {success && (
                  <div className="text-sm text-lime-600 font-medium">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600 font-medium">
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* AI Health Analysis */}
        <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-6 rounded-xl shadow-[8px_8px_0px_0px_#bef264] border border-teal-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold font-display mb-3 flex items-center gap-2">
              <i className="ph-fill ph-brain text-teal-300"></i>
              AI Health Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-bold text-teal-300 uppercase mb-1">
                  Risk Assessment
                </div>
                <div className="text-lg font-bold mb-1">Low Risk</div>
                <p className="text-xs text-teal-100">
                  Your vitals are stable. Keep up the good work!
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-bold text-teal-300 uppercase mb-1">
                  Next Checkup
                </div>
                <div className="text-lg font-bold mb-1">In 2 Weeks</div>
                <p className="text-xs text-teal-100">
                  Routine follow-up for viral fever recovery.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-bold text-teal-300 uppercase mb-1">
                  Lifestyle Tip
                </div>
                <div className="text-lg font-bold mb-1">Hydration</div>
                <p className="text-xs text-teal-100">
                  Increase water intake to 3L/day due to rising temps.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white border-2 border-black p-6 rounded-xl">
            <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
              <i className="ph-fill ph-calendar-check text-lime-500"></i>
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-lg">{apt.type}</div>
                      <div className="text-sm text-gray-500">
                        {apt.doctor} • {apt.hospital}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lime-600">{apt.date}</div>
                      <div className="text-xs font-bold text-gray-400">
                        {apt.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No upcoming appointments.</p>
            )}
          </div>

          {/* Medical History */}
          <div className="bg-white border-2 border-black p-6 rounded-xl">
            <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
              <i className="ph-fill ph-clipboard-text text-blue-500"></i>
              Medical History
            </h2>
            <div className="space-y-4">
              {medicalHistory.map((record, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-500">
                    <i className="ph-bold ph-file-text"></i>
                  </div>
                  <div>
                    <div className="font-bold">{record.diagnosis}</div>
                    <div className="text-sm text-gray-500">
                      {record.doctor} • {record.hospital}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {record.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm font-bold text-blue-600 hover:underline">
              View All History
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border-2 border-black p-6 rounded-xl">
          <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
            <i className="ph-fill ph-gear text-gray-500"></i>
            Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <span className="font-bold">Email Notifications</span>
              <div className="w-10 h-6 bg-lime-400 rounded-full relative cursor-pointer border border-black">
                <div className="absolute right-1 top-1 w-3.5 h-3.5 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <span className="font-bold">SMS Alerts</span>
              <div className="w-10 h-6 bg-lime-400 rounded-full relative cursor-pointer border border-black">
                <div className="absolute right-1 top-1 w-3.5 h-3.5 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <span className="font-bold">Dark Mode</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer border border-gray-300">
                <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
