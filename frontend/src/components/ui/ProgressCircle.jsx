import React from "react";

/**
 * Reusable animated circular progress indicator.
 * @param {number} score - Value from 0–100
 * @param {number} size - SVG diameter in px (default 160)
 * @param {number} stroke - Stroke width (default 12)
 * @param {string} label - Label shown below the number
 */
export default function ProgressCircle({ score = 0, size = 160, stroke = 12, label = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#4ade80" :
    score >= 60 ? "#facc15" : "#f87171";

  const textColor =
    score >= 80 ? "text-green-400" :
    score >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className={`font-black leading-none ${textColor}`} style={{ fontSize: size * 0.27 }}>
            {score}
          </span>
          <span className="text-slate-400 font-medium" style={{ fontSize: size * 0.1 }}>
            /100
          </span>
        </div>
      </div>
      {label && (
        <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
          {label}
        </p>
      )}
    </div>
  );
}
