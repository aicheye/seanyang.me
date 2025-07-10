export default function Tooltip({ isLightMode, tooltipVisible, tooltipPosition, text }) {
  return (
    tooltipVisible && (
      <>
        <div
          className={`fixed pointer-events-none px-2 py-1 text-sm rounded-lg shadow-lg transition-opacity duration-200 ${isLightMode ? "bg-white text-neutral-800 border border-neutral-200" : "bg-neutral-800 text-white border border-neutral-700"}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 10000,
          }}
        >
          {text}
        </div>
      </>
    )
  );
}
