import React, { useState, useEffect } from "react";

interface ContactManagerProps {
    onClose: () => void;
}

export const EmergencyManager: React.FC<ContactManagerProps> = ({ onClose }) => {
    const [contacts, setContacts] = useState<{ nurses: string[], ambulances: string[] }>({ nurses: [], ambulances: [] });
    const [newNumber, setNewNumber] = useState("");
    const [activeType, setActiveType] = useState<"nurses" | "ambulances">("nurses");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch("http://localhost:8002/contacts");
            const data = await res.json();
            setContacts(data);
        } catch (e) {
            console.error("Failed to fetch contacts", e);
        }
    };

    const addContact = async () => {
        if (!newNumber) return;
        try {
            await fetch("http://localhost:8002/contacts/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: activeType, number: newNumber })
            });
            setNewNumber("");
            fetchContacts();
        } catch (e) {
            console.error("Failed to add contact", e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#bef264] w-full max-w-md rounded-xl overflow-hidden">
                <div className="bg-black text-white p-4 flex justify-between items-center">
                    <h2 className="font-bold font-display flex items-center gap-2">
                        <i className="ph-fill ph-address-book text-lime-400"></i>
                        Emergency Contacts
                    </h2>
                    <button onClick={onClose} className="hover:text-lime-400 transition-colors">
                        <i className="ph-bold ph-x text-lg"></i>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveType("nurses")}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeType === "nurses" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                        >
                            Nurses
                        </button>
                        <button
                            onClick={() => setActiveType("ambulances")}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeType === "ambulances" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                        >
                            Ambulances
                        </button>
                    </div>

                    <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                        {contacts[activeType]?.map((num, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded font-mono text-sm">
                                <span>{num}</span>
                                <i className="ph-fill ph-check-circle text-lime-500"></i>
                            </div>
                        ))}
                        {contacts[activeType]?.length === 0 && (
                            <div className="text-center text-gray-400 text-sm italic py-4">No contacts added</div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="+91..."
                            value={newNumber}
                            onChange={(e) => setNewNumber(e.target.value)}
                            className="flex-1 border-2 border-gray-200 rounded px-3 py-2 font-mono text-sm focus:border-black focus:outline-none"
                        />
                        <button
                            onClick={addContact}
                            className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-lime-400 hover:text-black transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
