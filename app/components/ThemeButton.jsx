import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ThemeButton({ isLightMode, setIsLightMode }) {
  return (
    <>
      <button onClick={() => setIsLightMode(!isLightMode)} className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center ${isLightMode ? "bg-neutral-800 text-yellow-400 hover:bg-neutral-700" : "bg-white text-neutral-800 hover:bg-neutral-100"}`} aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}>
        <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} className="text-lg" />
      </button>
    </>
  );
}
