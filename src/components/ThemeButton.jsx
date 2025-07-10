"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useThemeStore from "./ThemeState";

config.autoAddCss = false;

export default function ThemeButton() {
  const { isLightMode, setIsLightMode } = useThemeStore();

  return (
    <>
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className="fixed lg:top-6 lg:right-6 md:top-6 md:right-6 top-4 right-4 lg:w-12 lg:h-12 md:w-12 md:h-12 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: "var(--button-bg)",
          color: "var(--theme-button-icon)",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--button-hover)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "var(--button-bg)";
        }}
        aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
      >
        <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} className="text-lg" />
      </button>
    </>
  );
}
