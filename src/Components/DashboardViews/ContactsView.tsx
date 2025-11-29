import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { useToast } from "../Toaster";

interface Contact {
    id: number;
    name: string;
    role: string;
    phone: string;
}

export const ContactsView: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("Nurse");
    const [newPhone, setNewPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/contacts`);
            const data = await res.json();
            setContacts(data);
        } catch (e) {
            console.error("Failed to fetch contacts", e);
            toast("Failed to load contacts", "error");
        }
    };

    const addContact = async () => {
        if (!newName || !newPhone) {
            toast("Please fill in all fields", "info");
            return;
        }
        setIsLoading(true);
        try {
            await fetch(`${API_BASE_URL}/contacts/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, role: newRole, phone: newPhone })
            });
            setNewName("");
            setNewPhone("");
            toast("Contact added successfully", "success");
            fetchContacts();
        } catch (e) {
            console.error("Failed to add contact", e);
            toast("Failed to add contact", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteContact = async (id: number) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await fetch(`${API_BASE_URL}/contacts/delete/${id}`, {
                method: "POST"
            });
            toast("Contact deleted", "success");
            fetchContacts();
        } catch (e) {
            console.error("Failed to delete contact", e);
            toast("Failed to delete contact", "error");
        }
    };

    const callContact = async (contact: Contact) => {
        const message = prompt("Enter message to speak:", "Be ready for tomorrow. Tomorrow is an important day.");
        if (!message) return;

        try {
            toast("Initiating call...", "info");
            const res = await fetch(`${API_BASE_URL}/call_staff`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: contact.phone, message })
            });
            const data = await res.json();
            if (data.status === "success") {
                toast("Call initiated successfully!", "success");
            } else {
                toast("Failed to initiate call: " + data.message, "error");
            }
        } catch (e) {
            console.error("Failed to call contact", e);
            toast("Failed to call contact", "error");
        }
    };

    // Group contacts by role
    const groupedContacts = {
        Ambulance: contacts.filter(c => c.role === "Ambulance"),
        Doctor: contacts.filter(c => c.role === "Doctor"),
        Nurse: contacts.filter(c => c.role === "Nurse"),
        Admin: contacts.filter(c => c.role === "Admin"),
    };

    const renderContactGroup = (title: string, icon: string, groupContacts: Contact[], colorClass: string) => (
        <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className={`px-6 py-4 border-b-2 border-black flex justify-between items-center ${colorClass}`}>
                <h3 className="font-bold font-display text-lg flex items-center gap-2">
                    <i className={`ph-bold ${icon}`}></i>
                    {title} Unit
                </h3>
                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                    {groupContacts.length} Active
                </span>
            </div>
            <div className="p-4">
                {groupContacts.length === 0 ? (
                    <div className="text-center text-gray-400 italic py-4 text-sm">
                        No {title.toLowerCase()} contacts active.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {groupContacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-black transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center text-black shadow-sm">
                                        <i className="ph-bold ph-user"></i>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{contact.name}</div>
                                        <div className="text-xs font-mono text-gray-600">{contact.phone}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => callContact(contact)}
                                        className="text-gray-400 hover:text-lime-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Call Contact"
                                    >
                                        <i className="ph-bold ph-phone-call"></i>
                                    </button>
                                    <button
                                        onClick={() => deleteContact(contact.id)}
                                        className="text-gray-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Contact"
                                    >
                                        <i className="ph-bold ph-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-black pb-6">
                <div>
                    <h1 className="text-4xl font-black font-display text-black mb-2 uppercase tracking-tight">
                        Emergency Dispatch
                    </h1>
                    <p className="text-gray-600 font-medium max-w-xl">
                        Manage critical contact points for automated emergency protocols. Ensure all numbers are verified for SMS delivery.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="bg-lime-400 text-black px-4 py-2 rounded-lg border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] flex items-center gap-2 animate-pulse">
                        <i className="ph-bold ph-broadcast"></i>
                        SYSTEM ONLINE
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add Form */}
                <div className="lg:col-span-1">
                    <div className="bg-black text-white p-6 rounded-xl shadow-[8px_8px_0px_0px_#bef264] sticky top-6">
                        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2 text-lime-400">
                            <i className="ph-bold ph-plus-circle"></i>
                            Register Unit
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Full Name / Unit ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Unit 404 or Dr. Smith"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Role / Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Ambulance", "Doctor", "Nurse", "Admin"].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setNewRole(role)}
                                            className={`px-3 py-2 rounded-md text-xs font-bold border transition-all ${newRole === role
                                                ? "bg-lime-400 text-black border-lime-400"
                                                : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Contact Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-500 font-mono text-sm"></span>
                                    <input
                                        type="text"
                                        placeholder="+91..."
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 py-3 text-white font-mono focus:border-lime-400 focus:outline-none transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    * Must include country code (e.g. +91)
                                </p>
                            </div>

                            <button
                                onClick={addContact}
                                disabled={isLoading}
                                className="w-full bg-lime-400 text-black font-black uppercase tracking-wide rounded-lg px-4 py-4 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_#fff] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <i className="ph-bold ph-spinner animate-spin"></i> : <i className="ph-bold ph-check"></i>}
                                {isLoading ? "Registering..." : "Register Contact"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {renderContactGroup("Ambulance", "ph-ambulance", groupedContacts.Ambulance, "bg-red-100 text-red-800")}
                    {renderContactGroup("Doctor", "ph-stethoscope", groupedContacts.Doctor, "bg-blue-100 text-blue-800")}
                    {renderContactGroup("Nurse", "ph-first-aid", groupedContacts.Nurse, "bg-pink-100 text-pink-800")}
                    {renderContactGroup("Admin", "ph-shield-check", groupedContacts.Admin, "bg-gray-100 text-gray-800")}
                </div>
            </div>
        </div>
    );
};