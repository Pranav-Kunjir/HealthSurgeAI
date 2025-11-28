// File: components/HospitalCard.tsx
import React from "react";

export interface Hospital {
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

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onClick: () => void;
  onViewDetails: (hospital: Hospital) => void;
  style?: React.CSSProperties;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isSelected,
  onClick,
  onViewDetails,
  style = {},
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

export default HospitalCard;
