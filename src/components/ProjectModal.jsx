"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  SiPython, SiJavascript, SiTypescript, SiRust,
  SiKotlin, SiHtml5, SiCss3, SiGo, SiRuby, SiPhp, SiSwift,
  SiCplusplus, SiC
} from "react-icons/si";
import { ExternalLinkIcon, GitHubIcon } from "./Icons";

// Language color mapping (GitHub-inspired)
const languageColors = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  "C++": "#f34b7d",
  C: "#555555",
};

// Custom Java icon (SVG)
const JavaIcon = ({ size = 20, color = "#b07219" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/>
  </svg>
);

// Language icon mapping
const languageIcons = {
  Python: SiPython,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Rust: SiRust,
  Java: JavaIcon,
  Kotlin: SiKotlin,
  HTML: SiHtml5,
  CSS: SiCss3,
  Go: SiGo,
  Ruby: SiRuby,
  PHP: SiPhp,
  Swift: SiSwift,
  "C++": SiCplusplus,
  C: SiC,
};

// Language icons with proper icons from react-icons
const LanguageIcon = ({ language, showLabel = true }) => {
  const color = languageColors[language] || "#858585";
  const Icon = languageIcons[language];

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}40` }}>
      {Icon && (
        language === "Java" ? (
          <Icon size={20} color={color} />
        ) : (
          <Icon size={20} style={{ color: color }} />
        )
      )}
      {showLabel && <span className="text-sm font-medium" style={{ color: color }}>{language}</span>}
    </div>
  );
};

export default function ProjectModal({ project, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: "var(--page-bg)", color: "var(--page-text)" }}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Hero Image */}
        <div className="relative w-full aspect-[21/9] max-h-80 overflow-hidden rounded-t-2xl" style={{ backgroundColor: "var(--card-image-bg)" }}>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Project title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white">{project.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--page-bg)" }}>
              <div className="text-sm opacity-70" style={{ color: "var(--page-subtext)" }}>Category</div>
              <div className="text-lg font-bold mt-1" style={{ color: "var(--page-text)" }}>{project.stats.category}</div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--page-bg)" }}>
              <div className="text-sm opacity-70" style={{ color: "var(--page-subtext)" }}>Year</div>
              <div className="text-lg font-bold mt-1" style={{ color: "var(--page-text)" }}>{project.stats.year}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--page-text)" }}>About</h3>
            <p className="text-lg leading-relaxed" style={{ color: "var(--page-subtext)" }}>
              {project.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--page-text)" }}>Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--page-bg)" }}
                >
                  <div className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent-color)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-base" style={{ color: "var(--page-text)" }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--page-text)" }}>Technologies</h3>
            <div className="flex gap-3 flex-wrap">
              {project.languages.map((lang) => (
                <LanguageIcon key={lang} language={lang} showLabel={true} />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 flex-wrap">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-100"
              style={{ backgroundColor: "var(--accent-color)", color: "var(--page-bg)" }}
            >
              <GitHubIcon className="w-5 h-5" />
              View on GitHub
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
              style={{ backgroundColor: "var(--page-bg)", color: "var(--page-text)", border: "2px solid var(--accent-color)" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
