"use client";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const portfolio = [
  {
    title: "aicheye's Combat Tagging",
    description: "Minecraft mod to make PvP fairer. Fast, performant, and fully customizable, totaling 200+ downloads on Modrinth.",
    github: "https://github.com/aicheye/combat-tag",
    thumbnail: "/combat-tag.png",
  },
  {
    title: "Quoridor",
    description: "A minimax game agent to play Quoridor applying pathfinding algorithms, heuristic ordering strategies, and alpha-beta pruning.",
    github: "https://github.com/aicheye/Quoridor",
    thumbnail: "/quoridor.png",
  },
  {
    title: "Community Centre Manager",
    description: "System for managing all aspects of a community centre including event booking, member billing, and staff payrolls.",
    github: "https://github.com/PAGELINE123/CommunityCentreManager",
    thumbnail: "/communitycentre.png",
  },
];

function useScrollAnimation() {
  const refs = useRef([]);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );
    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);
  return refs;
}

export default function Home() {
  const sectionRefs = useScrollAnimation();
  const [zoomed, setZoomed] = useState(false);
  const [bgPos, setBgPos] = useState("0px 0px");
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setZoomed(true), 100); // slight delay for effect
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX * 12) / window.innerWidth;
      const y = (e.clientY * 12) / window.innerHeight;
      setBgPos(`${x}% ${y}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="w-full h-full opacity-80 blur-2xs"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='%23333' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundPosition: bgPos,
          }}
        />
      </div>
      {/* Animated Freeform Gradient Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-20">
        <div className="absolute w-[50vw] h-[50vw] bg-[#7c3aed] opacity-4 rounded-full blur-3xl animate-blob1" style={{ top: "-10vw", left: "-10vw" }} />
        <div className="absolute w-[40vw] h-[40vw] bg-[#2563eb] opacity-4 rounded-full blur-3xl animate-blob2" style={{ bottom: "-8vw", right: "-8vw" }} />
        <div className="absolute w-[38vw] h-[38vw] bg-[#06b6d4] opacity-4 rounded-full blur-3xl animate-blob3" style={{ top: "0vh", left: "60vw" }} />
        <div className="absolute w-[42vw] h-[42vw] bg-[#f59e42] opacity-4 rounded-full blur-3xl animate-blob4" style={{ top: "60vh", left: "10vw" }} />
        <div className="absolute w-[36vw] h-[36vw] bg-[#e04242] opacity-4 rounded-full blur-3xl animate-blob5" style={{ bottom: "10vh", right: "30vw" }} />
      </div>
      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
          heroRef.current = el;
        }}
        className="flex flex-col items-center justify-center min-h-screen py-24 gap-8 opacity-0 transition-all duration-700 relative"
      >
        <a href="https://open.spotify.com/playlist/2B34ID9SWdE8WcEeh4q4mX?si=e5349b09043945e7&pt=6cd3613594f08576fc57bd88efb48f18" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-300 hover:scale-103">
          <div
            className={`relative lg:w-[50vh] lg:h-[50vh] md:w-[40vh] md:h-[40vh] w-[90vw] h-[90vw] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-1000`}
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              transform: zoomed ? "scale(1)" : "scale(0.7)",
            }}
          >
            <Image src="/hero.png" alt="Profile" fill style={{ objectFit: "cover" }} />
          </div>
        </a>
        <div className="max-w-3xl text-center lg:text-2xl md:text-2xl text-xl text-gray-300 ml-8 mr-8">
          <p style={{ fontWeight: "800" }}>Hello, World!</p>
          <em>Coder, sustainable urbanist, and advocate for economic justice. Building a socially responsible career in software development.</em>
        </div>
        {/* Scroll Down Indicator */}
        {!hasScrolled && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center animate-bounce z-10 select-none pointer-events-none">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 drop-shadow-lg">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span className="mt-1 text-sm text-white/80">Scroll to see projects</span>
          </div>
        )}
      </section>

      {/* Portfolio Section */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className="py-10 px-8 sm:px-16 md:px-32 lg:px-48 opacity-0 transition-all duration-700 lg:mb-[10vh]">
        <h2 className="lg:text-3xl md:text-3xl text-2xl font-semibold lg:mb-12 md:mb-12 mb-8 text-center">Projects</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {portfolio.map((project, idx) => (
            <a key={project.title} href={project.github} target="_blank" rel="noopener noreferrer" ref={(el) => (sectionRefs.current[2 + idx] = el)} className="portfolio-card block bg-gray-900 rounded-xl shadow-md p-4 w-full lg:h-[400px] md:h-[400px] h-[400px] hover:scale-[1.03] hover:shadow-lg opacity-0 transition-all duration-700">
              <div className="flex flex-col h-full">
                <div className="relative w-full h-full mb-4 rounded-lg bg-gray-800">
                  <Image src={project.thumbnail} alt={project.title + " thumbnail"} fill style={{ objectFit: "contain" }} />
                </div>
                <div className="flex flex-col h-auto">
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-gray-400 mb-3 text-md">{project.description}</p>
                  <span className="text-blue-400 font-medium text-md">View on GitHub →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer ref={(el) => (sectionRefs.current[portfolio.length + 2] = el)} className="mt-auto py-8 flex flex-col items-center gap-2 opacity-0 transition-all duration-700">
        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2 items-center mb-4">
          <div className="flex lg:gap-4 md:gap-4 gap-2 items-center">
            <span className="lg:text-3xl md:text-3xl text-2xl flex gap-2 lg:gap-4 md:gap-4">
              <a href="https://github.com/aicheye/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/syang07/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
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
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Sean Yang{" "}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
            (CC BY-NC-SA 4.0)
          </a>
        </div>
      </footer>
      <style jsx global>{`
        .animate-fade-in {
          opacity: 1 !important;
          transform: none !important;
        }
        section,
        footer,
        .portfolio-card {
          opacity: 0;
          transform: translateY(40px);
        }
        .animate-fade-in {
          transition: opacity 0.7s, transform 0.7s;
          opacity: 1;
          transform: none;
        }
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 12s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(16px);
          }
        }
        @keyframes blob1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(20vw, 10vh) scale(1.12);
          }
          40% {
            transform: translate(-15vw, 25vh) scale(0.95);
          }
          60% {
            transform: translate(10vw, -20vh) scale(1.08);
          }
          80% {
            transform: translate(-10vw, -10vh) scale(1.03);
          }
        }
        @keyframes blob2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(-18vw, 12vh) scale(1.09);
          }
          40% {
            transform: translate(12vw, -22vh) scale(0.97);
          }
          60% {
            transform: translate(-20vw, 18vh) scale(1.11);
          }
          80% {
            transform: translate(15vw, 15vh) scale(0.92);
          }
        }
        @keyframes blob3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(15vw, -18vh) scale(1.15);
          }
          40% {
            transform: translate(-12vw, 20vh) scale(0.93);
          }
          60% {
            transform: translate(18vw, 18vh) scale(1.06);
          }
          80% {
            transform: translate(-18vw, -15vh) scale(1.02);
          }
        }
        @keyframes blob4 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(22vw, 15vh) scale(1.13);
          }
          40% {
            transform: translate(-20vw, -18vh) scale(0.96);
          }
          60% {
            transform: translate(15vw, 22vh) scale(1.09);
          }
          80% {
            transform: translate(-15vw, 10vh) scale(1.04);
          }
        }
        @keyframes blob5 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(-20vw, -15vh) scale(1.1);
          }
          40% {
            transform: translate(18vw, 18vh) scale(0.94);
          }
          60% {
            transform: translate(-15vw, 20vh) scale(1.07);
          }
          80% {
            transform: translate(20vw, -18vh) scale(1.01);
          }
        }
        .animate-blob1 {
          animation: blob1 60s ease-in-out infinite;
        }
        .animate-blob2 {
          animation: blob2 40s ease-in-out infinite;
        }
        .animate-blob3 {
          animation: blob3 80s ease-in-out infinite;
        }
        .animate-blob4 {
          animation: blob4 60s ease-in-out infinite;
        }
        .animate-blob5 {
          animation: blob5 70s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
