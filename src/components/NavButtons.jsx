"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useThemeStore from "../stores/ThemeStore";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ContactIcon,
  ExternalLinkIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "./Icons";

export default function NavButtons({ showHome = false }) {
  const { isLightMode, setIsLightMode } = useThemeStore();
  const [atTop, setAtTop] = useState(true);
  const [isContactHovered, setIsContactHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseButtonClass =
    "rounded-full shadow-lg transition-all h-10 lg:h-12 md:h-12 duration-300 hover:scale-110 flex items-center justify-center cursor-pointer";
  const iconButtonClass =
    "w-10 lg:w-12 md:w-12 " + baseButtonClass;

  const buttonStyle = {
    backgroundColor: "var(--button-bg)",
    color: "var(--contact-button-icon)", // Using contact-button-icon for most, theme button overrides
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "var(--button-hover)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "var(--button-bg)";
  };

  return (
    <div className="fixed z-50 flex flex-row-reverse items-center gap-4 lg:gap-6 top-4 right-4 lg:top-6 lg:right-6 md:top-6 md:right-6">
      {/* Theme Button */}
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className={iconButtonClass}
        style={{
          ...buttonStyle,
          color: "var(--theme-button-icon)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
      >
        {isLightMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-6 h-6" />}
      </button>

      {/* Resume Button (visible only on large screens) */}
      <Link
        href="/resume.pdf"
        target="_blank"
        className={`${baseButtonClass} hidden lg:inline-flex px-3 h-12 gap-2`}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Resume"
      >
        <span className="text-md" style={{ color: "var(--accent)" }}>
          Resumé
        </span>
        <ExternalLinkIcon className="w-4 h-4" />
      </Link>

      {/* Contact or Home Button */}
      {showHome ? (
        <Link
          href="/"
          className={iconButtonClass}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Home"
        >
          <HomeIcon className="w-6 h-6" />
        </Link>
      ) : (
        <Link
          href="#contact"
          className={iconButtonClass}
          style={buttonStyle}
          onMouseEnter={(e) => {
            handleMouseEnter(e);
            setIsContactHovered(true);
          }}
          onMouseLeave={(e) => {
            handleMouseLeave(e);
            setIsContactHovered(false);
          }}
          aria-label="Contact"
        >
          {isContactHovered ? (
            <ArrowDownIcon className="w-5 h-5" />
          ) : (
            <ContactIcon className="w-6 h-6" />
          )}
        </Link>
      )}

      {/* Top Button */}
      {!atTop && (
        <Link
          href="#top"
          className={iconButtonClass}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Back to top"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
