import { useEffect, useState } from "react";

export default function Tooltip({ tooltipVisible, text }) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX + 7,
      y: e.clientY - 30,
    });
  };

  useEffect(() => {
    if (!tooltipVisible) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tooltipVisible]);

  return (
    tooltipVisible && (
      <>
        <div
          className="fixed pointer-events-none px-2 py-1 text-sm rounded-lg shadow-lg transition-opacity duration-200 border"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 10000,
            backgroundColor: "var(--tooltip-bg)",
            color: "var(--tooltip-text)",
            borderColor: "var(--tooltip-border)",
          }}
        >
          {text}
        </div>
      </>
    )
  );
}
