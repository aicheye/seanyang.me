"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Background from "../components/Background.jsx";
import Blurb from "../components/Blurb.jsx";
import ContactCard from "../components/ContactCard.jsx";
import Footer from "../components/Footer.jsx";
import NavButtons from "../components/NavButtons.jsx";
import Oneko from "../components/Oneko.jsx";
import Tooltip from "../components/Tooltip.jsx";
import buildingProjects from "../data/building.js";
import portfolio from "../data/portfolio";
import songs from "../data/songs";
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
  const [songEmbedUrl, setSongEmbedUrl] = useState("");
  const [currSongIndex, setCurrSongIndex] = useState(0);
  const shuffledRef = useRef([]);

  const buildingRef = useRef(null);
  const buildingTextRef = useRef(null);
  const [buildingPath, setBuildingPath] = useState("");
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    const updatePath = () => {
      if (!buildingRef.current || !buildingTextRef.current) return;

      const containerRect = buildingRef.current.getBoundingClientRect();
      const textRect = buildingTextRef.current.getBoundingClientRect();

      const startX = textRect.right - containerRect.left + 8; // +16 for gap-4
      const width = containerRect.width;
      const height = containerRect.height;
      const radius = 20;
      const startY = textRect.top - containerRect.top + textRect.height / 2;

      const path = `
        M ${startX} ${startY}
        L ${width - radius} ${startY}
        Q ${width} ${startY} ${width} ${startY + radius}
        L ${width} ${height - radius}
        Q ${width} ${height} ${width - radius} ${height}
        L ${radius} ${height}
        Q 0 ${height} 0 ${height - radius}
        L 0 ${startY + radius}
        Q 0 ${startY} ${radius} ${startY}
      `;
      setBuildingPath(path);
    }; updatePath();
    const observer = new ResizeObserver(updatePath);
    if (buildingRef.current) observer.observe(buildingRef.current);

    window.addEventListener("resize", updatePath);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [buildingPath]);

  const onMouseMove = useCallback(
    throttle((e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (centerY - y) / 40;
      const rotateY = (x - centerX) / 40;

      setRotate({ x: rotateX, y: rotateY });
    }, 50),
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

  // Song recommendation setup
  useEffect(() => {
    shuffledRef.current = songs
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    const currSongId = shuffledRef.current[0]?.id;
    if (currSongId) setSongEmbedUrl(`https://open.spotify.com/embed/track/${currSongId}`);
  }, []);

  const handleChangeSong = () => {
    const nextIndex = (currSongIndex + 1) % songs.length;
    setCurrSongIndex(nextIndex);
    const nextSongId = shuffledRef.current[nextIndex]?.id;
    if (nextSongId) setSongEmbedUrl(`https://open.spotify.com/embed/track/${nextSongId}`);
  };

  const handlePoke = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const message = formData.get("poke-message");
    const from = formData.get("poke-from");
    try {
      const response = await fetch("https://api.seanyang.me/poke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, author: from }),
      });
      if (response.ok) {
        alert("Poke sent! 🎉");
        event.target.reset();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending poke:", error);
      alert("Failed to send poke. Please try again!");
    }
  };

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
      <NavButtons />
      <Oneko />
      <Background />

      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
          heroRef.current = el;
        }}
        id="top"
        className="flex flex-col lg:flex-row items-center justify-center min-h-screen py-20 gap-12 lg:gap-20 opacity-0 transition-all duration-700 relative max-w-7xl mx-auto px-12"
      >
        {/* Text Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 order-2 lg:order-1">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight" style={{ color: "var(--page-text)" }}>
            <span className="typed-[Hello,_World!] typed-caret"></span>
          </h1>

          <div className="text-lg lg:text-xl leading-relaxed max-w-2xl mb-8" style={{ color: "var(--page-subtext)" }}>
            <Blurb />
          </div>

          {/* Currently Building - Integrated */}
          <div ref={buildingRef} className="w-full max-w-md relative sm:p-5 p-3">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
              <path
                ref={pathRef}
                d={buildingPath}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength,
                  opacity: 0.4
                }}
                className={pathLength > 0 ? "animate-draw-path" : ""}
              />
            </svg>
            <div className="flex items-center gap-4 sm:mb-3 mb-1 relative z-10">
              <p ref={buildingTextRef} className="pl-4 sm:pl-2 text-md uppercase tracking-widest font-bold" style={{ color: "var(--accent-color)" }}>
                Currently Building
              </p>
            </div>
            <div className="flex flex-col gap-4 relative z-10">
              {buildingProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 sm:p-3 p-1 rounded-lg transition-all border border-transparent ${isLightMode
                    ? "hover:bg-black/5 hover:border-black/20"
                    : "hover:bg-white/5 hover:border-white/10"
                    }`}
                  onMouseEnter={() => handleMouseEnter(project.hoverText)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                    <Image src={project.image} alt={project.alt} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-left font-medium text-lg group-hover:text-blue-400 transition-colors" style={{ color: "var(--page-text)" }}>{project.name}</span>
                    <span className="text-sm text-left" style={{ color: "var(--page-subtext)" }}>{project.description}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center items-center order-1 lg:order-2 relative">
          <a href="https://open.spotify.com/playlist/2B34ID9SWdE8WcEeh4q4mX" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform duration-300" onMouseEnter={() => handleMouseEnter("🎵 My go-to playlist")} onMouseLeave={handleMouseLeaveHero} onMouseMove={isTouchDevice ? undefined : onMouseMove}>
            <div
              className="relative flex-shrink-0 w-[70vw] h-[70vw] lg:max-w-[30rem] lg:max-h-[30rem] max-w-[20rem] max-h-[20rem] rounded-md overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: "var(--hero-image-bg)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                willChange: "transform",
                transform: `${zoomed ? "scale(1)" : "scale(0.9)"} perspective(500px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                transition: `${rotate.x !== 0 && rotate.y !== 0 ? "all 100ms ease-out" : "1000ms cubic-bezier(0.2, 0.8, 0.2, 1)"}`,
              }}
            >
              <Image src="/hero.png" alt="Profile" fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vh, 30rem" priority />
            </div>
          </a>
        </div>

        {/* Scroll Down Indicator */}
        {atTop && (
          <Link href="#projects" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10 select-none opacity-50 hover:opacity-100 transition-opacity">
            See My Projects
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--scroll-indicator)" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>
        )}
      </section>

      <div className="flex-1 flex flex-col gap-30 pb-30">
        {/* About Section (moved from About page) */}
        <section ref={(el) => (sectionRefs.current[1] = el)} className="px-6 py-6 max-w-6xl mx-auto w-full opacity-0 transition-all duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-7 rounded-xl shadow-md" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
              <h2 className="text-3xl font-bold mb-4">Nice to meet you!</h2>
              <div className="flex flex-col gap-5 text-md lg:text-lg" style={{ color: "var(--page-subtext)" }}>
                <p>I believe in the power of technology to create positive change. I'm passionate about using my skills to contribute to a more equitable and sustainable future.</p>
                <p>I'm always open to new opportunities, especially in non-profit or ESG sectors.</p>
                <p>Don't hesitate to reach out if you think we could work together!</p>
                <h3 className="text-xl lg:text-2xl underline decoration-dashed font-bold">A few things about me</h3>
                <div className="flex flex-col gap-3">
                  <p>Hometown: <span className="font-bold sm:typed-caret sm:typed-[Toronto]"><span className="sm:hidden">Toronto</span></span></p>
                  <p>Pets: 🐕🐕 <span className="font-bold sm:typed-[2_dogs] sm:typed-caret"><span className="sm:hidden visible">2 dogs</span></span></p>
                  <p>Favourite Games: <span className="font-bold sm:typed-caret">Subway Builder, Cities Skylines II, Minecraft</span></p>
                  <p>Favourite Artists: <span className="font-bold sm:typed-caret">beabadoobee, Laufey, keshi</span></p>
                  <p>If I could live anywhere, it would be: 🌑 <span className="font-bold sm:typed-[The_Moon] sm:typed-caret"><span className="sm:hidden visible">The Moon</span></span></p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {/* Song recommendation */}
              <div className="flex flex-col h-auto w-auto p-7 rounded-xl shadow-md gap-3" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-subtext)" }}>
                <h2 className="text-xl lg:text-2xl font-bold" style={{ color: "var(--page-text)" }}>Song recommendation:</h2>
                <div className="w-full h-20 rounded-xl overflow-hidden" style={{ backgroundColor: "var(--card-image-bg)" }}>
                  {songEmbedUrl ? (
                    <iframe title="Song Recommendation" src={songEmbedUrl} width="100%" height="80" loading="lazy" style={{ border: "none", borderRadius: "12px" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--subtext)" }}>Loading song...</div>
                  )}
                </div>
                <button onClick={handleChangeSong} className="px-6 py-3 rounded-lg font-medium transition-all duration-0 self-stretch sm:self-start hover:scale-105 active:scale-100 flex items-center justify-center cursor-pointer" style={{ backgroundColor: "var(--spot-color)", color: "var(--page-bg)" }}>
                  Change!
                </button>
              </div>

              {/* Ping my phone */}
              <div className="flex flex-col p-7 rounded-xl shadow-md gap-2" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
                <h2 className="text-xl lg:text-2xl">Ping my phone!</h2>
                <p>
                  Yes, <Link href="/ping.png" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--link-color)" }}>really</Link>.
                </p>
                <form className="flex flex-col sm:flex-row gap-2 w-full mt-2" onSubmit={handlePoke}>
                  <div className="flex flex-col gap-2 w-full">
                    <textarea name="poke-message" className="flex-1 min-h-12 max-h-24 p-3 rounded-lg resize-none" style={{ backgroundColor: "var(--page-bg)", color: "var(--page-text)" }} placeholder="Poke!" maxLength={42} autoComplete="off" />
                    <input type="text" name="poke-from" className="h-12 p-3  rounded-lg" style={{ backgroundColor: "var(--page-bg)", color: "var(--page-text)" }} placeholder="Anonymous" maxLength={21} autoComplete="off" />
                  </div>
                  <button type="submit" className="px-6 py-3 rounded-lg font-medium transition-all duration-0 self-stretch hover:scale-105 active:scale-100 flex items-center justify-center cursor-pointer" style={{ backgroundColor: "var(--accent-color)", color: "var(--page-bg)" }}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="projects" ref={(el) => (sectionRefs.current[3] = el)} className="px-6 py-6 max-w-7xl mx-auto w-full opacity-0 transition-all duration-700">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              Selected Works
            </h2>
            <div className="h-[1px] flex-1 opacity-20" style={{ backgroundColor: "var(--page-text)" }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project, idx) => (
              <a
                key={project.title}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => (sectionRefs.current[4 + idx] = el)}
                className="group flex flex-col bg-white/5 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl opacity-0"
                style={{ backgroundColor: "var(--card-bg)" }}
                onMouseEnter={() => handleMouseEnter("View on GitHub")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative w-full aspect-video overflow-hidden" style={{ backgroundColor: "var(--card-image-bg)" }}>
                  <Image
                    src={project.thumbnail}
                    alt={project.title + " thumbnail"}
                    fill
                    style={{ objectFit: "contain" }}
                    className="group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 3ransition-colors" style={{ color: "var(--page-text)" }}>
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--page-subtext)" }}>
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm font-medium mt-auto" style={{ color: "var(--link-color)" }}>
                    View Project <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Card at page bottom (ensure always visible) */}
        <section
          id="contact"
          ref={(el) => (sectionRefs.current[4 + portfolio.length] = el)}
          className="px-6 py-6 max-w-6xl mx-auto w-full relative z-10 opacity-0 transition-all duration-700"
          style={{ backgroundColor: "transparent" }}
        >
          <ContactCard />
        </section>
      </div>

      <Footer hideLinks={true} />
      <Tooltip visible={tooltipVisible} text={tooltipText} />
    </div>
  );
}
