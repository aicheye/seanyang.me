"use client";

import { useEffect, useRef, useState } from "react";
import "../styles/animations.css";

export default function CatTooltip({ visible = false, text, catX, catY }) {
  const [position, setPosition] = useState({ x: catX - 50, y: catY - 60, arrowX: 50, showAbove: false });
  const [isAnimating, setIsAnimating] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (!tooltipRef.current || !text) return;

    const updatePosition = () => {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Cat dimensions (32px wide, 32px tall)
      const catWidth = 32;
      const catHeight = 32;
      const catCenterX = catX;
      const catCenterY = catY;

      // Tooltip spacing from cat
      const tooltipSpacing = 12;

      // Calculate if tooltip should be above or below cat
      const spaceAbove = catCenterY - tooltipHeight - tooltipSpacing;
      const showAbove = spaceAbove > 12;

      // Calculate Y position
      let tooltipY;
      if (showAbove) {
        tooltipY = catCenterY - catHeight / 2 - tooltipSpacing - tooltipHeight;
      } else {
        tooltipY = catCenterY + catHeight / 2 + tooltipSpacing;
      }

      // Calculate X position (try to center tooltip on cat)
      let tooltipX = catCenterX - tooltipWidth / 2;

      // Ensure tooltip doesn't go off screen horizontally
      const margin = 10;
      if (tooltipX < margin) {
        tooltipX = margin;
      } else if (tooltipX + tooltipWidth > viewportWidth - margin) {
        tooltipX = viewportWidth - tooltipWidth - margin;
      }

      // Calculate arrow X position relative to tooltip
      const arrowX = catCenterX - tooltipX;

      setPosition({
        x: tooltipX,
        y: tooltipY,
        arrowX: Math.max(12, Math.min(arrowX, tooltipWidth - 12)), // Keep arrow within tooltip bounds
        showAbove,
      });
    };

    // Initial position calculation (with small delay to ensure DOM is ready)
    const timer = setTimeout(updatePosition, 0);

    // Recalculate on window resize
    window.addEventListener("resize", updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, [catX, catY, text, visible]);

  if (!isAnimating && !visible) return null;
  if (!text) return null;

  return (
    <div
      ref={tooltipRef}
      className={`fixed pointer-events-none select-none transition-all duration-300 ease-out transform ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
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

          {/* Tooltip arrow - positioned dynamically */}
          <div
            className={`absolute ${position.showAbove ? "top-full" : "bottom-full"} transform -translate-x-1/2`}
            style={{
              left: `${position.arrowX}px`,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              ...(position.showAbove
                ? { borderTop: "6px solid rgba(139, 69, 92, 0.95)" } // Arrow points down when tooltip is above
                : { borderBottom: "6px solid rgba(139, 69, 92, 0.95)" }), // Arrow points up when tooltip is below
            }}
          />
        </div>
      </div>
    </div>
  );
}
