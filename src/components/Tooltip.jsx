import { useEffect, useState } from "react";

export default function Tooltip({ visible, text }) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    if (!isTouchDevice) window.addEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX + 7,
      y: e.clientY - 30,
    });
  };

  return (
    !isTouchDevice &&
    visible && (
      <>
        <div
          className="overflow-hidden fixed pointer-events-none px-2 py-1 text-sm rounded-lg shadow-lg transition-opacity duration-200 border"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 10000,
            backgroundColor: "var(--tooltip-bg)",
            color: "var(--tooltip-text)",
            borderColor: "var(--tooltip-border)",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </>
    )
  );
}
