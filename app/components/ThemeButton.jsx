import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ThemeButton({ isLightMode, setIsLightMode }) {
  return (
    <>
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className="fixed top-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "var(--theme-button-bg)",
          color: "var(--theme-button-icon)",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--theme-button-hover)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "var(--theme-button-bg)";
        }}
        aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
      >
        <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} className="text-lg" />
      </button>
    </>
  );
}
