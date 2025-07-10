"use client";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "./animations.css";
import Background from "./components/Background";
import ThemeButton from "./components/ThemeButton";
import Tooltip from "./components/Tooltip";
import portfolio from "./portfolio";

function useScrollAnimation() {
  const refs = useRef([]);
  const [animatedElements, setAnimatedElements] = useState(new Set());

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            setAnimatedElements((prev) => new Set(prev).add(entry.target));
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
        // If element was previously animated, keep it animated
        if (animatedElements.has(ref)) {
          ref.classList.add("animate-fade-in");
        }
      }
    });

    return () => observer.disconnect();
  }, [animatedElements]);

  return refs;
}

export default function Home() {
  const sectionRefs = useScrollAnimation();
  const [zoomed, setZoomed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipText, setTooltipText] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setZoomed(true), 100); // slight delay for effect
  }, []);

  const handleMouseEnterSpot = () => {
    setTooltipText("🎵 My go-to playlist");
    setTooltipVisible(true);
  };

  const handleMouseEnterUrban = () => {
    setTooltipText("🏙️ Read more");
    setTooltipVisible(true);
  };

  const handleMouseEnterSocialism = () => {
    setTooltipText("🌹 Read more");
    setTooltipVisible(true);
  };

  const handleMouseEnterLoo = () => {
    setTooltipText("🪿💛💛");
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX + 7,
      y: e.clientY - 30,
    });
  };

  useEffect(() => {
    const checkScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (rect.top < 0) setHasScrolled(true);
    };
    checkScroll(); // Run on mount
    const handleScroll = () => {
      setHasScrolled(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preserve animation state when theme changes
  useEffect(() => {
    const preserveAnimations = () => {
      sectionRefs.current.forEach((ref) => {
        if (ref && ref.getBoundingClientRect().top < window.innerHeight) {
          ref.classList.add("animate-fade-in");
        }
      });
    };
    preserveAnimations();
  }, [isLightMode]);

  React.useEffect(() => {
    setIsLightMode(window.matchMedia("(prefers-color-scheme: light)").matches);
    const mediaQueryList = window != null && window.matchMedia("(prefers-color-scheme: light)");
    mediaQueryList.addEventListener("change", handleThemeChange);
  }, []);

  const handleThemeChange = (event) => {
    if (event.matches) {
      setIsLightMode(true);
    } else {
      setIsLightMode(false);
    }
  };

  return (
    <div className={`relative flex flex-col min-h-screen overflow-hidden transition-colors duration-500 ${isLightMode ? "bg-neutral-200 text-neutral-900" : "bg-neutral-950 text-neutral-200"}`}>
      <Background isLightMode={isLightMode} />

      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
          heroRef.current = el;
        }}
        className="flex flex-col items-center lg:justify-center md:justify-center min-h-screen py-24 gap-8 opacity-0 transition-all duration-700 relative"
      >
        <a href="https://open.spotify.com/playlist/2B34ID9SWdE8WcEeh4q4mX" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-300 hover:scale-103" onMouseEnter={handleMouseEnterSpot} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
          <div
            className={`relative lg:w-[50vh] lg:h-[50vh] md:w-[40vh] md:h-[40vh] w-[90vw] h-[90vw] bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-1000`}
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              transform: zoomed ? "scale(1)" : "scale(0.7)",
            }}
          >
            <Image src="/hero.png" alt="Profile" fill style={{ objectFit: "cover" }} />
          </div>
        </a>
        <div className={`max-w-3xl text-center lg:text-2xl md:text-2xl text-lg ml-8 mr-8 ${isLightMode ? "text-neutral-900" : "text-neutral-200"}`}>
          <p style={{ fontWeight: 800 }}>Hello, World!</p>
          <p>
            Coder,{" "}
            <a href="https://en.wikipedia.org/wiki/Sustainable_urbanism" target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnterUrban} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
              sustainable urbanist
            </a>
            , and advocate for{" "}
            <a href="https://en.wikipedia.org/wiki/Democratic_socialism" target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnterSocialism} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
              economic justice
            </a>{" "}
            studying Software Engineering at the{" "}
            <span onMouseEnter={handleMouseEnterLoo} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
              University of Waterloo
            </span>
            .
          </p>
        </div>

        {/* Scroll Down Indicator */}
        {!hasScrolled && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center animate-bounce z-10 select-none pointer-events-none">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`opacity-80 drop-shadow-lg ${isLightMode ? "text-neutral-800" : "text-white"}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className={`mt-1 text-sm ${isLightMode ? "text-neutral-600" : "text-neutral-300"}`}>Scroll to see projects</span>
          </div>
        )}
      </section>

      {/* Portfolio Section */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className="py-10 px-8 sm:px-16 md:px-32 lg:px-48 opacity-0 transition-all duration-700 lg:mb-[10vh] z-10">
        <h2 className={`lg:text-3xl md:text-3xl text-2xl font-bold lg:mb-12 md:mb-12 mb-8 text-center ${isLightMode ? "text-gray-900" : "text-neutral-200"}`}>Projects</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {portfolio.map((project, idx) => (
            <a key={project.title} href={project.github} target="_blank" rel="noopener noreferrer" ref={(el) => (sectionRefs.current[2 + idx] = el)} className={`portfolio-card block rounded-xl shadow-md p-4 w-full lg:h-[400px] md:h-[400px] h-[400px] hover:scale-[1.03] hover:shadow-lg opacity-0 transition-all duration-700 ${isLightMode ? "bg-neutral-50" : "bg-neutral-900"}`}>
              <div className="flex flex-col h-full">
                <div className={`relative w-full h-full mb-4 rounded-lg ${isLightMode ? "bg-neutral-300" : "bg-neutral-800"}`}>
                  <Image src={project.thumbnail} alt={project.title + " thumbnail"} fill style={{ objectFit: "contain" }} />
                </div>
                <div className="flex flex-col h-auto">
                  <h3 className={`lg:text-xl md:text-xl text-lg mb-1 ${isLightMode ? "text-neutral-900" : "text-neutral-200"}`} style={{ fontWeight: 800 }}>
                    {project.title}
                  </h3>
                  <p className={`mb-3 text-md ${isLightMode ? "text-neutral-600" : "text-neutral-400"}`}>{project.description}</p>
                  <span className="text-blue-400 font-medium text-md">View on GitHub →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer ref={(el) => (sectionRefs.current[portfolio.length + 2] = el)} className="mt-auto py-8 flex flex-col items-center gap-2 opacity-0 transition-all duration-700 z-10">
        <div className={`flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2 items-center mb-4 ${isLightMode ? "text-neutral-900" : "text-neutral-200"}`}>
          <div className="flex lg:gap-4 md:gap-4 gap-2 items-center">
            <span className="lg:text-3xl md:text-3xl text-2xl flex gap-2 lg:gap-4 md:gap-4 items-center">
              <a href="https://github.com/aicheye/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/syang07/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://se-webring.xyz/" target="_blank" rel="noopener noreferrer" aria-label="SE Webring" className="lg:w-10 lg:h-10 md:w-10 md:h-10 w-8 h-8">
                {isLightMode ? <img src="/webring_logo_b.svg" alt="SE Webring" /> : <img src="/webring_logo_w.svg" alt="SE Webring" />}
              </a>
            </span>
            <span>·</span>
            <a href="mailto:contact@seanyang.me" aria-label="Email" className="lg:text-lg md:text-lg text-md underline" target="_blank" rel="noopener noreferrer">
              contact@seanyang.me
            </a>
          </div>
          <span className="hidden lg:block md:block">·</span>
          <div className="flex lg:gap-4 md:gap-4 gap-2">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline lg:text-lg md:text-lg text-md flex items-center gap-2">
              Resume
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
            </a>
            <span>·</span>
            <a href="https://github.com/aicheye/seanyang.me" target="_blank" rel="noopener noreferrer" className="underline lg:text-lg md:text-lg text-md flex items-center gap-2">
              Source
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
            </a>
          </div>
        </div>
        <div className={`text-sm ${isLightMode ? "text-neutral-600" : "text-neutral-400"}`}>
          © {new Date().getFullYear()} Sean Yang{" "}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
            (CC BY-NC-SA 4.0)
          </a>
        </div>
      </footer>

      <Tooltip isLightMode={isLightMode} tooltipVisible={tooltipVisible} tooltipPosition={tooltipPosition} text={tooltipText} />

      <ThemeButton isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
    </div>
  );
}
