import React from "react";
import HospitalCard from "./HospitalCard"; // assumes HospitalCard is exported separately

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

interface Props {
  hospitals: Hospital[];
  positions: Record<string, React.CSSProperties>;
  offsets: Record<string, { x: number; y: number }>;
  centerX: number;
  centerY: number;
  sphereRef: React.RefObject<HTMLDivElement>;
  sphereRadius: number;
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  setDetailModalHospital: (h: Hospital | null) => void;
  handleMouseDown: (e: React.MouseEvent, hospitalId: string) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

const HospitalCardSection: React.FC<Props> = ({
  hospitals,
  positions,
  offsets,
  centerX,
  centerY,
  sphereRef,
  sphereRadius,
  selectedHospital,
  setSelectedHospital,
  setDetailModalHospital,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}) => {
  return (
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

          const circleRadius = sphereRadius;
          const startX = centerX + Math.cos(angle) * circleRadius;
          const startY = centerY + Math.sin(angle) * circleRadius;

          const pos = positions[hospital.id] as React.CSSProperties;
          const rectWidth = 320;
          const rectHeight = 160;
          const halfW = rectWidth / 2;
          const halfH = rectHeight / 2;

          let posLeft =
            pos && typeof pos.left === "string"
              ? parseFloat(pos.left)
              : centerX - Math.cos(angle) * radius - halfW;
          let posTop =
            pos && typeof pos.top === "string"
              ? parseFloat(pos.top)
              : centerY - Math.sin(angle) * radius - halfH;

          const offset = offsets[hospital.id] || { x: 0, y: 0 };
          posLeft += offset.x;
          posTop += offset.y;

          const cardX = posLeft + halfW;
          const cardY = posTop + halfH;

          const vx = startX - cardX;
          const vy = startY - cardY;

          let endX: number;
          let endY: number;
          if (Math.abs(vx) < 1e-6 && Math.abs(vy) < 1e-6) {
            endX = cardX;
            endY = cardY;
          } else {
            let s: number;
            if (Math.abs(vx) < 1e-6) {
              s = halfH / Math.abs(vy);
            } else if (Math.abs(vy) < 1e-6) {
              s = halfW / Math.abs(vx);
            } else {
              s = Math.min(halfW / Math.abs(vx), halfH / Math.abs(vy));
            }
            endX = cardX + vx * s;
            endY = cardY + vy * s;
          }

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

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
        <div className="absolute inset-0 rounded-full border border-lime-400/30 animate-[ping_3s_linear_infinite]"></div>
        <div className="absolute -inset-5 rounded-full border border-lime-400/20 animate-[ping_3s_linear_infinite_1s]"></div>
      </div>

      {/* Hospital Cards positioned around center */}
      {hospitals.map((hospital) => {
        const offset = offsets[hospital.id] || { x: 0, y: 0 };
        const basePos = positions[hospital.id];
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
  );
};

export default HospitalCardSection;
