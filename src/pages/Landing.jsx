"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Background from "../components/Background.jsx";
import Blurb from "../components/Blurb.jsx";
import ContactButton from "../components/ContactButton.jsx";
import Footer from "../components/Footer.jsx";
import Oneko from "../components/Oneko.jsx";
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

function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export default function Landing() {
  const sectionRefs = useScrollAnimation();
  const [zoomed, setZoomed] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isLightMode = useThemeStore((state) => state.isLightMode);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const onMouseMove = useCallback(
    throttle((e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (centerY - y) / 20;
      const rotateY = (x - centerX) / 20;

      setRotate({ x: rotateX, y: rotateY });
    }, 100),
    []
  );

  const handleMouseLeaveHero = () => {
    setTooltipVisible(false);
    setRotate({ x: 0, y: 0 });
  };

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
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);

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
      <Oneko />
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
        className="flex flex-col items-center sm:justify-center min-h-screen py-18 gap-8 opacity-0 transition-all duration-700 relative"
      >
        <a href="https://open.spotify.com/playlist/2B34ID9SWdE8WcEeh4q4mX" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform duration-300" onMouseEnter={() => handleMouseEnter("🎵 My go-to playlist")} onMouseLeave={handleMouseLeaveHero} onMouseMove={isTouchDevice ? undefined : onMouseMove}>
          <div
            className="relative flex-shrink-0 sm:w-[50vh] sm:h-[50vh] w-[90vw] h-[90vw] lg:max-w-[34rem] lg:max-h-[34rem] max-w-[28rem] max-h-[28rem] rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: "var(--hero-image-bg)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              willChange: "transform",
              transform: `${zoomed ? "scale(1)" : "scale(0.7)"} perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
              transition: `${rotate.x !== 0 && rotate.y !== 0 ? "all 1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s" : "700ms transform"}`,
            }}
          >
            <Image src="/hero.png" alt="Profile" fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 90vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vh, 34rem" fetchPriority="high" loading="eager" />
          </div>
        </a>
        <div className="max-w-3xl text-center sm:text-2xl text-lg ml-8 mr-8" style={{ color: "var(--page-text)" }}>
          <h1 className="typed-[Hello,_World!] typed-caret" style={{ fontWeight: 800 }}></h1>
          <div>
            <Blurb />
            <span className="sm:inline block text-2xl" style={{ color: "var(--page-subtext)" }}>
              {" "}
              [
              <Link href="/about" className="underline" style={{ color: "var(--link-color)" }} onMouseEnter={() => handleMouseEnter("Learn more about me")} onMouseLeave={handleMouseLeave}>
                ...
              </Link>
              ]
            </span>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        {atTop && (
          <Link href="#projects" className="hidden sm:flex flex-col absolute left-1/2 -translate-x-1/2 bottom-8 items-center animate-bounce z-10 select-none w-full">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 drop-shadow-lg" style={{ color: "var(--scroll-indicator)" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className="mt-1 text-sm text-center" style={{ color: "var(--page-subtext)" }}>
              Scroll to see projects
            </span>
          </Link>
        )}
      </section>

      {/* Portfolio Section */}
      <section id="projects" ref={(el) => (sectionRefs.current[1] = el)} className="sm:mb-30 mb-8 flex flex-col sm:gap-10 gap-5 pt-20 px-5 opacity-0 transition-all duration-700 max-w-[100rem] w-full mx-auto">
        <h1 className="sm:text-3xl text-2xl text-center" style={{ color: "var(--page-text)" }}>
          Projects
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {portfolio.map((project, idx) => (
            <a key={project.title} href={project.github} target="_blank" rel="noopener noreferrer" ref={(el) => (sectionRefs.current[2 + idx] = el)} className="rounded-xl shadow-md p-4 h-[350px] lg:h-[450px] hover:scale-[1.03] hover:shadow-lg opacity-0 transition-all duration-700" style={{ backgroundColor: "var(--card-bg)", flex: "1 1 400px", minWidth: "320px", maxWidth: "500px" }} onMouseEnter={() => handleMouseEnter("View on GitHub")} onMouseLeave={handleMouseLeave}>
              <div className="flex flex-col h-full">
                <div className="relative w-full h-full mb-4 rounded-lg overflow-clip" style={{ backgroundColor: "var(--card-image-bg)" }}>
                  <Image src={project.thumbnail} alt={project.title + " thumbnail"} fill style={{ objectFit: "contain" }} sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) calc(50vw - 48px), (max-width: 1280px) calc(33vw - 32px), 400px" loading="lazy" />
                </div>
                <div className="flex flex-col h-auto">
                  <h2 className="sm:text-xl text-lg mb-1" style={{ color: "var(--page-text)" }}>
                    {project.title}
                  </h2>
                  <p className="mb-3 sm:text-lg text-md" style={{ color: "var(--page-subtext)" }}>
                    {project.description}
                  </p>
                  <span className="font-medium text-md" style={{ color: "var(--link-color)" }}>
                    View on GitHub →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
      <Footer />
      <Tooltip visible={tooltipVisible} text={tooltipText} />
    </div>
  );
}
