"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Background from "../components/Background.jsx";
import Blurb from "../components/Blurb.jsx";
import ContactButton from "../components/ContactButton.jsx";
import Footer from "../components/Footer.jsx";
import ThemeButton from "../components/ThemeButton.jsx";
import Tooltip from "../components/Tooltip.jsx";
import TopButton from "../components/TopButton.jsx";
import portfolio from "../data/portfolio";
import useThemeStore from "../stores/ThemeStore.jsx";
import "../styles/animations.css";

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

export default function Landing() {
  const sectionRefs = useScrollAnimation();
  const [zoomed, setZoomed] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const isLightMode = useThemeStore((state) => state.isLightMode);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setZoomed(true), 100); // slight delay for effect
  }, []);

  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 0) setAtTop(false);
    };
    checkScroll(); // Run on mount
    const handleScroll = () => {
      if (window.scrollY > 0) setAtTop(false);
      else setAtTop(true);
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

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden transition-colors duration-500">
      {!atTop && <TopButton />}
      <ThemeButton />
      <ContactButton />
      <Background />
      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
          heroRef.current = el;
        }}
        id="top"
        className="flex flex-col items-center lg:justify-center md:justify-center min-h-screen py-18 gap-8 opacity-0 transition-all duration-700 relative"
      >
        <a href="https://open.spotify.com/playlist/2B34ID9SWdE8WcEeh4q4mX" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform duration-300" onMouseEnter={() => handleMouseEnter("🎵 My go-to playlist")} onMouseLeave={handleMouseLeave}>
          <div
            className="relative flex-shrink-0 lg:w-[50vh] lg:h-[50vh] md:w-[50vh] md:h-[50vh] w-[90vw] h-[90vw] rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-1000"
            style={{
              backgroundColor: "var(--hero-image-bg)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              transform: zoomed ? "scale(1)" : "scale(0.7)",
              willChange: "transform",
            }}
          >
            <Image src="/hero.png" alt="Profile" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 90vw, 50vh" priority={true} />
          </div>
        </a>
        <div className="max-w-3xl text-center lg:text-2xl md:text-2xl text-md ml-8 mr-8" style={{ color: "var(--page-text)" }}>
          <p className="typed-[Hello,_World!] typed-caret" style={{ fontWeight: 800 }}></p>
          <div>
            <Blurb />
            <Link href="/about">{" [...]"}</Link>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        {atTop && (
          <Link href="#projects" className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center animate-bounce z-10 select-none">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 drop-shadow-lg" style={{ color: "var(--scroll-indicator)" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className="mt-1 text-sm" style={{ color: "var(--page-subtext)" }}>
              Scroll to see projects
            </span>
          </Link>
        )}
      </section>
      {/* Portfolio Section */}
      <section id="projects" ref={(el) => (sectionRefs.current[1] = el)} className="pt-20 px-8 sm:px-16 md:px-32 lg:px-48 opacity-0 transition-all duration-700 lg:mb-[10vh] z-10">
        <h2 className="lg:text-3xl md:text-3xl text-2xl font-bold lg:mb-12 md:mb-12 mb-8 text-center" style={{ color: "var(--page-text)" }}>
          Projects
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {portfolio.map((project, idx) => (
            <a key={project.title} href={project.github} target="_blank" rel="noopener noreferrer" ref={(el) => (sectionRefs.current[2 + idx] = el)} className="min-w-xs max-w-2xl w-auto rounded-xl shadow-md p-4 lg:h-[400px] md:h-[400px] h-[400px] hover:scale-[1.03] hover:shadow-lg opacity-0 transition-all duration-700" style={{ backgroundColor: "var(--card-bg)" }}>
              <div className="flex flex-col h-full">
                <div className="relative w-full h-full mb-4 rounded-lg" style={{ backgroundColor: "var(--card-image-bg)" }}>
                  <Image src={project.thumbnail} alt={project.title + " thumbnail"} fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) calc(100vw - 64px), (max-width: 1024px) calc(50vw - 64px), 400px" />
                </div>
                <div className="flex flex-col h-auto">
                  <h3 className="lg:text-xl md:text-xl text-lg mb-1" style={{ fontWeight: 800, color: "var(--page-text)" }}>
                    {project.title}
                  </h3>
                  <p className="mb-3 text-md" style={{ color: "var(--page-subtext)" }}>
                    {project.description}
                  </p>
                  <span className="font-medium text-md" style={{ color: "var(--accent-color)" }}>
                    View on GitHub →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
      <Footer />
      <Tooltip tooltipVisible={tooltipVisible} text={tooltipText} />
    </div>
  );
}
