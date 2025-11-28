import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const UserProfile: React.FC = () => {
    const user = useQuery(api.myFunctions.getUser);

    // Mock Data
    const medicalHistory = [
        { date: "2024-10-15", diagnosis: "Viral Fever", doctor: "Dr. Sharma", hospital: "Apollo Hospitals" },
        { date: "2024-08-20", diagnosis: "Routine Checkup", doctor: "Dr. Patel", hospital: "Lilavati Hospital" },
        { date: "2024-05-10", diagnosis: "Sprained Ankle", doctor: "Dr. Singh", hospital: "Max Healthcare" },
    ];

    const upcomingAppointments = [
        { date: "2024-11-30", time: "10:00 AM", type: "Follow-up", doctor: "Dr. Sharma", hospital: "Apollo Hospitals" },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header / Profile Card */}
                <div className="bg-white border-2 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_#bef264] flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-lime-400 overflow-hidden shrink-0">
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-bold font-display mb-2">{user?.name || "Guest User"}</h1>
                        <p className="text-gray-500 font-medium mb-4">{user?.email || "guest@example.com"}</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-bold border border-lime-200">
                                Premium Member
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                                O+ Blood Group
                            </span>
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-white hover:text-black transition-all">
                        Edit Profile
                    </button>
                </div>

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
                                <div className="text-xs font-bold text-teal-300 uppercase mb-1">Risk Assessment</div>
                                <div className="text-lg font-bold mb-1">Low Risk</div>
                                <p className="text-xs text-teal-100">Your vitals are stable. Keep up the good work!</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                                <div className="text-xs font-bold text-teal-300 uppercase mb-1">Next Checkup</div>
                                <div className="text-lg font-bold mb-1">In 2 Weeks</div>
                                <p className="text-xs text-teal-100">Routine follow-up for viral fever recovery.</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                                <div className="text-xs font-bold text-teal-300 uppercase mb-1">Lifestyle Tip</div>
                                <div className="text-lg font-bold mb-1">Hydration</div>
                                <p className="text-xs text-teal-100">Increase water intake to 3L/day due to rising temps.</p>
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
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-lg">{apt.type}</div>
                                            <div className="text-sm text-gray-500">{apt.doctor} • {apt.hospital}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lime-600">{apt.date}</div>
                                            <div className="text-xs font-bold text-gray-400">{apt.time}</div>
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
                                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-500">
                                        <i className="ph-bold ph-file-text"></i>
                                    </div>
                                    <div>
                                        <div className="font-bold">{record.diagnosis}</div>
                                        <div className="text-sm text-gray-500">{record.doctor} • {record.hospital}</div>
                                        <div className="text-xs text-gray-400 mt-1">{record.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-center text-sm font-bold text-blue-600 hover:underline">
                            View All History
                        </button>
                    </div>
                </div>

                {/* Settings / Preferences */}
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
