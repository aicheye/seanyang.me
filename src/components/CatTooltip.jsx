"use client";

import { useEffect, useState } from "react";

export default function CatTooltip({ visible, text, catX, catY }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!isAnimating && !visible) return null;

  return (
    <div
      className={`fixed pointer-events-none select-none transition-all duration-300 ease-out transform ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}
      style={{
        left: `${catX - 17}px`,
        top: `${catY - 64}px`,
        zIndex: 2147483648,
      }}
    >
      {/* Tooltip bubble */}
      <div className="relative">
        {/* Main tooltip content */}
        <div
          className="px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border animate-pulse-glow"
          style={{
            background: "linear-gradient(135deg, rgba(139, 69, 92, 0.95), rgba(102, 51, 68, 0.95))",
            color: "white",
            fontSize: "13px",
            fontWeight: "500",
            borderColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(139, 69, 92, 0.4)",
          }}
        >
          {text}

          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-4 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(139, 69, 92, 0.95)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
