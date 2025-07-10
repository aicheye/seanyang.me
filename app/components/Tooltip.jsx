export default function Tooltip({ isLightMode, tooltipVisible, tooltipPosition, text }) {
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
