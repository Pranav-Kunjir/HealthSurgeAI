import React, { useState, useRef, useEffect } from "react";
import "../index.css";

interface Hospital {
  id: string;
  name: string;
  distance: number;
  beds: number;
  occupancy: number;
  rating: number;
  address: string;
  specializations: string[];
  emergencyRating: "high" | "medium" | "low";
  waitTime: number;
}

// Mock data for nearby hospitals
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospitals",
    distance: 2.3,
    beds: 450,
    occupancy: 78,
    rating: 4.8,
    address: "Bandra, Mumbai",
    specializations: ["Cardiology", "Neurology", "Oncology"],
    emergencyRating: "high",
    waitTime: 15,
  },
  {
    id: "2",
    name: "Lilavati Hospital",
    distance: 3.1,
    beds: 380,
    occupancy: 65,
    rating: 4.6,
    address: "Bandra, Mumbai",
    specializations: ["General", "Pediatrics", "Orthopedics"],
    emergencyRating: "medium",
    waitTime: 22,
  },
  {
    id: "3",
    name: "Hinduja Hospital",
    distance: 1.8,
    beds: 320,
    occupancy: 82,
    rating: 4.7,
    address: "Mahim, Mumbai",
    specializations: ["Cardiac Surgery", "ICU", "General"],
    emergencyRating: "high",
    waitTime: 18,
  },
  {
    id: "4",
    name: "Breach Candy Hospital",
    distance: 4.2,
    beds: 280,
    occupancy: 71,
    rating: 4.5,
    address: "Kala Ghoda, Mumbai",
    specializations: ["Dermatology", "Obstetrics", "Surgery"],
    emergencyRating: "medium",
    waitTime: 25,
  },
  {
    id: "5",
    name: "Jaslok Hospital",
    distance: 2.8,
    beds: 350,
    occupancy: 68,
    rating: 4.7,
    address: "Peddar Road, Mumbai",
    specializations: ["Gastroenterology", "Urology", "ENT"],
    emergencyRating: "low",
    waitTime: 30,
  },
  {
    id: "6",
    name: "Max Healthcare",
    distance: 3.5,
    beds: 400,
    occupancy: 75,
    rating: 4.4,
    address: "Bandra East, Mumbai",
    specializations: ["Orthopedics", "Neurosurgery", "Pulmonology"],
    emergencyRating: "medium",
    waitTime: 20,
  },
];

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onClick: () => void;
  onViewDetails: (hospital: Hospital) => void;
  style: React.CSSProperties;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isSelected,
  onClick,
  onViewDetails,
  style,
}) => {
  const occupancyColor =
    hospital.occupancy > 80
      ? "bg-red-500"
      : hospital.occupancy > 60
        ? "bg-yellow-500"
        : "bg-green-500";

  const emergencyColor =
    hospital.emergencyRating === "high"
      ? "bg-red-100 text-red-700 border-red-200"
      : hospital.emergencyRating === "medium"
        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
        : "bg-green-100 text-green-700 border-green-200";

  return (
    <div
      style={style}
      className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_#111] cursor-pointer transition-all duration-300 group hover:shadow-[8px_8px_0px_0px_#bef264] hover:translate-x-1 hover:translate-y-1 hover:z-999 ${
        isSelected ? "z-50 ring-4 ring-lime-400" : "z-10"
      }`}
      onClick={onClick}
    >
      {/* Compact View (Default) */}
      <div className="p-4 min-h-32 group-hover:hidden">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-base font-bold font-display truncate">
              {hospital.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {hospital.address}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-lime-100 px-2 py-1 rounded shrink-0 ml-2 border border-lime-200">
            <i className="ph-fill ph-star text-xs text-lime-600"></i>
            <span className="text-xs font-bold text-lime-600">
              {hospital.rating}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <i className="ph-bold ph-map-pin text-red-500"></i>
            <span className="font-bold">{hospital.distance} km</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <i className="ph-bold ph-clock text-blue-500"></i>
            <span className="font-bold">{hospital.waitTime} min</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">
              OCCUPANCY
            </span>
            <span className="text-xs font-bold">{hospital.occupancy}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className={`h-full ${occupancyColor} transition-all duration-500`}
              style={{ width: `${hospital.occupancy}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Full View (On Hover) */}
      <div
        className="p-5 hidden z-50 group-hover:block w-80 absolute bg-white border-2 border-black shadow-[8px_8px_0px_0px_#bef264]"
        style={{ zIndex: 1000 }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold font-display">{hospital.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{hospital.address}</p>
          </div>
          <div className="flex items-center gap-1 bg-lime-100 px-2 py-1 rounded border border-lime-200">
            <i className="ph-fill ph-star text-xs text-lime-600"></i>
            <span className="text-xs font-bold text-lime-600">
              {hospital.rating}
            </span>
          </div>
        </div>

        {/* Distance & Wait Time */}
        <div className="flex gap-3 mb-4 text-xs">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <i className="ph-bold ph-map-pin text-red-500"></i>
            <span className="font-bold">{hospital.distance} km</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <i className="ph-bold ph-clock text-blue-500"></i>
            <span className="font-bold">{hospital.waitTime} min</span>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">
              OCCUPANCY
            </span>
            <span className="text-xs font-bold">{hospital.occupancy}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className={`h-full ${occupancyColor} transition-all duration-500`}
              style={{ width: `${hospital.occupancy}%` }}
            ></div>
          </div>
        </div>

        {/* Beds Available */}
        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="ph-fill ph-bed text-blue-600 text-lg"></i>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-bold tracking-wider">
                  TOTAL BEDS
                </div>
                <div className="text-sm font-bold">{hospital.beds}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-bold tracking-wider">
                AVAILABLE
              </div>
              <div className="text-sm font-bold text-green-600">
                {Math.ceil(hospital.beds * (1 - hospital.occupancy / 100))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Rating */}
        <div className="mb-3">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">
            EMERGENCY
          </div>
          <div
            className={`${emergencyColor} px-3 py-1.5 rounded border text-xs font-bold text-center uppercase tracking-wide`}
          >
            {hospital.emergencyRating} PRIORITY
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">
            SPECIALIZATIONS
          </div>
          <div className="flex flex-wrap gap-2">
            {hospital.specializations.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-black text-white px-2 py-1 rounded font-bold uppercase tracking-wide"
              >
                {spec}
              </span>
            ))}
            {hospital.specializations.length > 3 && (
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">
                +{hospital.specializations.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(hospital)}
          className="w-full bg-lime-400 border-2 border-black text-black px-4 py-2.5 font-bold text-sm rounded shadow-[4px_4px_0px_0px_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#111] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>BOOK NOW</span>
          <i className="ph-bold ph-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

interface BedTypeInfo {
  type: string;
  available: number;
  price: number;
  icon: string;
  features: string[];
}

interface AmbulanceService {
  type: string;
  available: number;
  eta: number; // minutes
  price: number;
  icon: string;
  features: string[];
}

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  onClose: () => void;
}

const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  onClose,
}) => {
  const [selectedBedType, setSelectedBedType] = useState<string | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(
    null,
  );
  const [bookingStep, setBookingStep] = useState<"service" | "confirm">(
    "service",
  );

  if (!hospital) return null;

  const bedTypes: BedTypeInfo[] = [
    {
      type: "ICU",
      available: Math.floor(Math.random() * 5) + 1,
      price: 15000,
      icon: "ph-heartbeat",
      features: ["Ventilator", "24/7 Monitoring", "Specialist Care"],
    },
    {
      type: "Deluxe Room",
      available: Math.floor(Math.random() * 8) + 2,
      price: 8000,
      icon: "ph-armchair",
      features: ["Private Room", "TV & AC", "Sofa Bed for Attendant"],
    },
    {
      type: "Standard Room",
      available: Math.floor(Math.random() * 12) + 5,
      price: 4000,
      icon: "ph-bed",
      features: ["Twin Sharing", "AC", "Basic Amenities"],
    },
    {
      type: "General Ward",
      available: Math.floor(Math.random() * 20) + 10,
      price: 2000,
      icon: "ph-users",
      features: ["Multiple Beds", "Common Amenities", "Economical"],
    },
  ];

  const ambulanceServices: AmbulanceService[] = [
    {
      type: "Basic Life Support",
      available: Math.floor(Math.random() * 3) + 1,
      eta: Math.floor(Math.random() * 10) + 5,
      price: 500,
      icon: "ph-ambulance",
      features: ["Oxygen", "Stretcher", "First Aid"],
    },
    {
      type: "Advanced Life Support",
      available: Math.floor(Math.random() * 2) + 1,
      eta: Math.floor(Math.random() * 15) + 8,
      price: 1200,
      icon: "ph-siren",
      features: ["Ventilator", "Defibrillator", "Paramedic"],
    },
    {
      type: "ICU on Wheels",
      available: Math.floor(Math.random() * 1) + 1,
      eta: Math.floor(Math.random() * 20) + 10,
      price: 2000,
      icon: "ph-truck",
      features: ["Full ICU Setup", "Doctor on Board", "Critical Care"],
    },
  ];

  const handleBooking = () => {
    if (selectedBedType || selectedAmbulance) {
      setBookingStep("confirm");
    }
  };

  const handleConfirmBooking = () => {
    alert(
      `Booking confirmed!\nBed: ${selectedBedType || "N/A"}\nAmbulance: ${selectedAmbulance || "Not selected"}`,
    );
    onClose();
  };

  const totalCost =
    (bedTypes.find((b) => b.type === selectedBedType)?.price || 0) +
    (ambulanceServices.find((a) => a.type === selectedAmbulance)?.price || 0);

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_#bef264] w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold font-display">
                {hospital.name}
              </h2>
              <span className="bg-lime-400 text-black text-xs font-bold px-2 py-1 rounded">
                {hospital.rating} ★
              </span>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <i className="ph-fill ph-map-pin text-lime-400"></i>
              {hospital.address} • {hospital.distance} km away
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
          >
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 border-b-2 border-black px-6 py-4 flex items-center gap-4 shrink-0">
          <div
            className={`flex items-center gap-2 ${bookingStep === "service" ? "text-black" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${bookingStep === "service" ? "bg-lime-400 border-black" : "bg-gray-200 border-gray-300"}`}
            >
              1
            </div>
            <span className="font-bold">Select Services</span>
          </div>
          <div className="h-0.5 w-12 bg-gray-300"></div>
          <div
            className={`flex items-center gap-2 ${bookingStep === "confirm" ? "text-black" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${bookingStep === "confirm" ? "bg-lime-400 border-black" : "bg-gray-200 border-gray-300"}`}
            >
              2
            </div>
            <span className="font-bold">Confirmation</span>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {bookingStep === "service" ? (
            <div className="space-y-8">
              {/* Bed Selection */}
              <section>
                <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  <i className="ph-fill ph-bed text-blue-600"></i>
                  Select Room Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bedTypes.map((bed) => (
                    <div
                      key={bed.type}
                      onClick={() =>
                        setSelectedBedType(
                          selectedBedType === bed.type ? null : bed.type,
                        )
                      }
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedBedType === bed.type
                          ? "border-black bg-lime-50 shadow-[4px_4px_0px_0px_#111]"
                          : "border-gray-200 hover:border-black hover:bg-gray-50"
                      }`}
                    >
                      {selectedBedType === bed.type && (
                        <div className="absolute -top-3 -right-3 bg-black text-lime-400 rounded-full p-1 border-2 border-lime-400 shadow-sm">
                          <i className="ph-bold ph-check text-lg"></i>
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedBedType === bed.type ? "bg-lime-200" : "bg-blue-50"}`}
                          >
                            <i
                              className={`ph-fill ${bed.icon} text-2xl ${selectedBedType === bed.type ? "text-black" : "text-blue-600"}`}
                            ></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-base">{bed.type}</h4>
                            <p className="text-xs text-gray-500 font-medium">
                              {bed.available} beds available
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-bold">
                            ₹{bed.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase font-bold">
                            Per Day
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {bed.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 font-bold"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ambulance Selection */}
              <section>
                <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  <i className="ph-fill ph-ambulance text-red-600"></i>
                  Select Ambulance (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ambulanceServices.map((ambulance) => (
                    <div
                      key={ambulance.type}
                      onClick={() =>
                        setSelectedAmbulance(
                          selectedAmbulance === ambulance.type
                            ? null
                            : ambulance.type,
                        )
                      }
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAmbulance === ambulance.type
                          ? "border-black bg-lime-50 shadow-[4px_4px_0px_0px_#111]"
                          : "border-gray-200 hover:border-black hover:bg-gray-50"
                      }`}
                    >
                      {selectedAmbulance === ambulance.type && (
                        <div className="absolute -top-3 -right-3 bg-black text-lime-400 rounded-full p-1 border-2 border-lime-400 shadow-sm">
                          <i className="ph-bold ph-check text-lg"></i>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedAmbulance === ambulance.type ? "bg-lime-200" : "bg-red-50"}`}
                        >
                          <i
                            className={`ph-fill ${ambulance.icon} text-2xl ${selectedAmbulance === ambulance.type ? "text-black" : "text-red-600"}`}
                          ></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm leading-tight">
                            {ambulance.type}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            ETA: {ambulance.eta} mins
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                        <span className="text-xs font-bold text-gray-500">
                          Base Fare
                        </span>
                        <span className="font-bold">
                          ₹{ambulance.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="bg-lime-50 border-2 border-lime-200 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_#111]">
                  <i className="ph-bold ph-check text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">
                  Almost There!
                </h3>
                <p className="text-gray-600">
                  Please review your booking details before confirming.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg border-b-2 border-gray-100 pb-2">
                    Hospital Details
                  </h4>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <i className="ph-fill ph-hospital text-2xl text-gray-600"></i>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{hospital.name}</div>
                      <div className="text-gray-500 text-sm">
                        {hospital.address}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                          {hospital.distance} km away
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                          {hospital.waitTime} min wait
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg border-b-2 border-gray-100 pb-2">
                    Selected Services
                  </h4>
                  {selectedBedType ? (
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex items-center gap-3">
                        <i className="ph-fill ph-bed text-blue-600 text-xl"></i>
                        <div>
                          <div className="font-bold text-sm">
                            {selectedBedType}
                          </div>
                          <div className="text-xs text-gray-500">
                            Room Charges
                          </div>
                        </div>
                      </div>
                      <div className="font-bold">
                        ₹
                        {bedTypes
                          .find((b) => b.type === selectedBedType)
                          ?.price.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm">
                      No room selected
                    </div>
                  )}

                  {selectedAmbulance ? (
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex items-center gap-3">
                        <i className="ph-fill ph-ambulance text-red-600 text-xl"></i>
                        <div>
                          <div className="font-bold text-sm">
                            {selectedAmbulance}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ambulance Fare
                          </div>
                        </div>
                      </div>
                      <div className="font-bold">
                        ₹
                        {ambulanceServices
                          .find((a) => a.type === selectedAmbulance)
                          ?.price.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm">
                      No ambulance selected
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Estimated Cost</span>
                  <span className="text-lime-600 text-2xl">
                    ₹{totalCost.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  *Final bill may vary based on actual usage and medical
                  procedures.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t-2 border-black bg-gray-50 flex justify-between items-center shrink-0">
          <div className="text-sm">
            <span className="text-gray-500 font-bold">Total: </span>
            <span className="text-xl font-bold">
              ₹{totalCost.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3">
            {bookingStep === "confirm" && (
              <button
                onClick={() => setBookingStep("service")}
                className="px-6 py-3 border-2 border-black font-bold rounded hover:bg-white transition-all"
              >
                Back
              </button>
            )}
            {bookingStep === "service" ? (
              <button
                onClick={handleBooking}
                disabled={!selectedBedType && !selectedAmbulance}
                className="px-8 py-3 bg-black text-white font-bold rounded shadow-[4px_4px_0px_0px_#bef264] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue <i className="ph-bold ph-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="px-8 py-3 bg-lime-400 text-black border-2 border-black font-bold rounded shadow-[4px_4px_0px_0px_#111] hover:translate-y-1 hover:shadow-none transition-all"
              >
                Confirm Booking <i className="ph-bold ph-check ml-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hospitals: React.FC = () => {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [detailModalHospital, setDetailModalHospital] =
    useState<Hospital | null>(null);
  const [hospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1400);
  const [positions, setPositions] = useState<
    Record<string, React.CSSProperties>
  >({});

  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, []);

  // Container dimensions
  const containerHeight = 900;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Generate positions based on distance - closer hospitals are nearer to center
  useEffect(() => {
    const generatePositions = (): Record<string, React.CSSProperties> => {
      const positions: Record<string, React.CSSProperties> = {};

      // Calculate max distance for scaling
      const maxDistance = Math.max(...hospitals.map((h) => h.distance));
      // Scale factor: closer hospitals (smaller distance) should be closer to center
      const radiusScale = 150; // Base radius for positioning

      hospitals.forEach((hospital, idx) => {
        // Distribute hospitals evenly around a circle
        const angle = (idx / hospitals.length) * Math.PI * 2;

        // Distance-based radius: shorter distance = closer to center
        const distanceRatio = hospital.distance / maxDistance;
        const radius = radiusScale + distanceRatio * 250; // 150-400px radius

        // Calculate position on circle
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Card dimensions used for positioning/clamping
        const rectWidth = 320; // w-80
        const rectHeight = 160; // compact card approx height
        const halfW = rectWidth / 2;
        const halfH = rectHeight / 2;

        // Centered left/top before clamping
        let left = x - halfW;
        let top = y - halfH;

        // Clamp to keep cards inside the floating area
        left = Math.max(0, Math.min(left, containerWidth - rectWidth));
        top = Math.max(0, Math.min(top, containerHeight - rectHeight));

        positions[hospital.id] = {
          position: "absolute" as const,
          left: `${left}px`,
          top: `${top}px`,
        };
      });

      return positions;
    };

    setPositions(generatePositions());
  }, [containerWidth, hospitals, centerX, centerY]);

  // Drag state: track which card is being dragged and its offset
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Movement limit: 10vh in each direction
  const movementLimit = window.innerHeight * 0.1;

  // Clamp offset to movement limit
  const clampOffset = (offset: number) => {
    return Math.max(-movementLimit, Math.min(movementLimit, offset));
  };

  const handleMouseDown = (e: React.MouseEvent, hospitalId: string) => {
    setDraggedCard(hospitalId);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedCard || !dragStartPos.current) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    setOffsets((prev) => ({
      ...prev,
      [draggedCard]: {
        x: clampOffset(deltaX),
        y: clampOffset(deltaY),
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggedCard(null);
    dragStartPos.current = null;
  };

  // Sphere measurement: measure the rendered "YOU" circle so SVG
  // connections start exactly at its visible edge. This allows the
  // sphere size to be changed via CSS/classes and keeps lines correct.
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const [sphereRadius, setSphereRadius] = useState<number>(64);

  useEffect(() => {
    const measure = () => {
      if (sphereRef.current) {
        const rect = sphereRef.current.getBoundingClientRect();
        const r = Math.max(rect.width, rect.height) / 2;
        setSphereRadius(r);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="antialiased text-black font-sans bg-white">
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes user-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(190, 242, 100, 0.3);
          }
          50% { 
            box-shadow: 0 0 0 20px rgba(0, 0, 0, 0), inset 0 0 30px rgba(190, 242, 100, 0.5);
          }
        }
        @keyframes connecting-pulse {
          0%, 100% { stroke: rgba(0, 0, 0, 0.1); stroke-width: 2; }
          50% { stroke: rgba(190, 242, 100, 0.6); stroke-width: 3; }
        }
        .user-center {
          animation: user-pulse 3s ease-in-out infinite;
        }
        .hospital-card-float {
          animation: float 6s ease-in-out infinite;
        }
        .hospital-card-float:nth-child(2) {
          animation-delay: 1s;
        }
        .hospital-card-float:nth-child(3) {
          animation-delay: 2s;
        }
        .hospital-card-float:nth-child(4) {
          animation-delay: 1.5s;
        }
        .hospital-card-float:nth-child(5) {
          animation-delay: 2.5s;
        }
        .hospital-card-float:nth-child(6) {
          animation-delay: 0.5s;
        }
        @keyframes squiggly {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20px; }
        }
        .connecting-line {
          animation: connecting-pulse 2s ease-in-out infinite, squiggly 1s linear infinite;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navbar removed - handled by UserLayout */}

      {/* Header Section */}
      <div className="border-b-2 border-black p-10 bg-linear-to-r from-white via-lime-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <i className="ph-fill ph-hospital text-9xl"></i>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl font-bold font-display mb-4 tracking-tight">
            Find Your Nearest{" "}
            <span className="text-lime-600 underline decoration-4 decoration-black">
              Care Center
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mb-8 font-medium">
            Real-time availability, instant booking, and emergency response. We
            connect you to the best healthcare facilities in seconds.
          </p>
          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-3 font-bold border-2 border-black shadow-[6px_6px_0px_0px_#bef264] hover:translate-y-1 hover:shadow-none transition-all rounded-lg flex items-center gap-2">
              <i className="ph-fill ph-navigation-arrow"></i> Use Current
              Location
            </button>
            <button className="bg-white text-black px-8 py-3 font-bold border-2 border-black shadow-[6px_6px_0px_0px_#ddd] hover:translate-y-1 hover:shadow-none transition-all rounded-lg flex items-center gap-2">
              <i className="ph-fill ph-map-trifold"></i> View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Floating Cards Area */}
      <div className="p-8 flex justify-center bg-gray-100">
        <div
          ref={containerRef}
          className="relative bg-white border-2 border-black rounded-2xl shadow-2xl w-full max-w-[1400px]"
          style={{ height: "900px" }}
        >
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          {/* Floating Hospital Cards */}
          <div className="relative w-full h-full" style={{ height: "900px" }}>
            {/* Connecting Lines SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 30 }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#bef264" />
                </marker>
              </defs>
              {hospitals.map((hospital, idx) => {
                const angle = (idx / hospitals.length) * Math.PI * 2;
                const maxDist = Math.max(...hospitals.map((h) => h.distance));
                const distRatio = hospital.distance / maxDist;
                const radius = 150 + distRatio * 250;

                // Calculate start point on the circle edge using the
                // measured sphere radius so lines attach to the visible
                // circle even if its size changes.
                const circleRadius = sphereRadius;
                const startX = centerX + Math.cos(angle) * circleRadius;
                const startY = centerY + Math.sin(angle) * circleRadius;

                // Use the previously computed/clamped card positions to
                // derive the actual card center so the path endpoint
                // matches the visible card location. Also include the
                // current drag offset so lines follow dragged cards.
                const pos = positions[hospital.id] as React.CSSProperties;
                const rectWidth = 320; // w-80
                const rectHeight = 160; // compact card approx height
                const halfW = rectWidth / 2;
                const halfH = rectHeight / 2;

                // Parse left/top (they are stored as px strings)
                let posLeft =
                  pos && typeof pos.left === "string"
                    ? parseFloat(pos.left)
                    : centerX - Math.cos(angle) * radius - halfW;
                let posTop =
                  pos && typeof pos.top === "string"
                    ? parseFloat(pos.top)
                    : centerY - Math.sin(angle) * radius - halfH;

                // Apply drag offset to card position
                const offset = offsets[hospital.id] || { x: 0, y: 0 };
                posLeft += offset.x;
                posTop += offset.y;

                const cardX = posLeft + halfW;
                const cardY = posTop + halfH;

                // Vector from card center to the start (sphere edge)
                const vx = startX - cardX;
                const vy = startY - cardY;

                // If vector is tiny (start overlaps center), fall back to card center
                let endX: number;
                let endY: number;
                if (Math.abs(vx) < 1e-6 && Math.abs(vy) < 1e-6) {
                  endX = cardX;
                  endY = cardY;
                } else {
                  // scale factor to hit rectangle boundary
                  let s: number;
                  if (Math.abs(vx) < 1e-6) {
                    s = halfH / Math.abs(vy);
                  } else if (Math.abs(vy) < 1e-6) {
                    s = halfW / Math.abs(vx);
                  } else {
                    s = Math.min(halfW / Math.abs(vx), halfH / Math.abs(vy));
                  }

                  // end point is card center plus scaled vector towards start
                  endX = cardX + vx * s;
                  endY = cardY + vy * s;
                }

                // Calculate midpoint for quadratic curve
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                // Perpendicular offset for curve
                const offsetX = Math.cos(angle + Math.PI / 2) * 30;
                const offsetY = Math.sin(angle + Math.PI / 2) * 30;
                const controlX = midX + offsetX;
                const controlY = midY + offsetY;

                const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

                return (
                  <path
                    key={`line-${hospital.id}`}
                    d={pathData}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10,5"
                    className="connecting-line text-lime-400"
                  />
                );
              })}
            </svg>

            {/* Center User Circle */}
            <div
              ref={sphereRef}
              className="absolute w-32 h-32 bg-black rounded-full flex items-center justify-center user-center border-4 border-lime-400 z-50 shadow-2xl"
              style={{
                left: `${centerX}px`,
                top: `${centerY}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="text-center relative z-10">
                <div className="bg-lime-400 rounded-full p-2 mb-1 inline-block">
                  <i className="ph-fill ph-user text-3xl text-black"></i>
                </div>
                <span className="text-xs text-lime-400 font-bold block tracking-widest">
                  YOU
                </span>
              </div>
              {/* Radar Scan Effect */}
              <div className="absolute inset-0 rounded-full border border-lime-400/30 animate-[ping_3s_linear_infinite]"></div>
              <div className="absolute -inset-5 rounded-full border border-lime-400/20 animate-[ping_3s_linear_infinite_1s]"></div>
            </div>

            {/* Hospital Cards positioned around center */}
            {hospitals.map((hospital) => {
              const offset = offsets[hospital.id] || { x: 0, y: 0 };
              const basePos = positions[hospital.id];
              // Conditional rendering to prevent rendering before positions are calculated
              if (!basePos) return null;
              const baseLeft =
                typeof basePos.left === "string" ? parseFloat(basePos.left) : 0;
              const baseTop =
                typeof basePos.top === "string" ? parseFloat(basePos.top) : 0;
              return (
                <div
                  key={hospital.id}
                  style={{
                    position: "absolute",
                    left: `${baseLeft + offset.x}px`,
                    top: `${baseTop + offset.y}px`,
                  }}
                  className="hospital-card-float z-10 hover:z-999 cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={(e) => handleMouseDown(e, hospital.id)}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <HospitalCard
                    hospital={hospital}
                    isSelected={selectedHospital === hospital.id}
                    onClick={() =>
                      setSelectedHospital(
                        selectedHospital === hospital.id ? null : hospital.id,
                      )
                    }
                    onViewDetails={setDetailModalHospital}
                    style={{ position: "static" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t-2 border-black p-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold font-display">
              Why Choose HealthSurgeAI?
            </h3>
            <button className="text-lime-600 font-bold hover:underline flex items-center gap-1">
              Learn More <i className="ph-bold ph-arrow-right"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[8px_8px_0px_0px_#bef264] p-8 rounded-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ph-fill ph-bed text-3xl text-blue-600"></i>
              </div>
              <h4 className="font-bold text-xl font-display mb-3">
                Real-Time Bed Availability
              </h4>
              <p className="text-gray-600 leading-relaxed">
                No more calling around. See live bed counts across all nearby
                hospitals instantly and secure your spot.
              </p>
            </div>
            <div className="bg-gray-50 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[8px_8px_0px_0px_#bef264] p-8 rounded-xl transition-all group">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ph-fill ph-stethoscope text-3xl text-red-600"></i>
              </div>
              <h4 className="font-bold text-xl font-display mb-3">
                Specialized Care Search
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Filter hospitals by specific treatments and departments to
                ensure you get the right expert care immediately.
              </p>
            </div>
            <div className="bg-gray-50 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[8px_8px_0px_0px_#bef264] p-8 rounded-xl transition-all group">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ph-fill ph-shield-check text-3xl text-yellow-600"></i>
              </div>
              <h4 className="font-bold text-xl font-display mb-3">
                Verified Emergency Ratings
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Trust our data-driven emergency ratings to make informed
                decisions when every second counts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Details Modal */}
      <HospitalDetailsModal
        hospital={detailModalHospital}
        onClose={() => setDetailModalHospital(null)}
      />
    </div>
  );
};

export default Hospitals;
