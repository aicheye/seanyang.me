"use client";

import { useEffect, useState } from "react";
import useThemeStore from "../stores/ThemeStore";
import "./Background.css";

export default function Background() {
  const [bgPos, setBgPos] = useState("0px 0px");

  const isLightMode = useThemeStore((state) => state.isLightMode);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX * 12) / window.innerWidth;
      const y = (e.clientY * 12) / window.innerHeight;
      setBgPos(`${x}% ${y}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Animated Dot Background */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div
          className="w-full h-full opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='${isLightMode ? "%23333" : "%23555"}' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundPosition: bgPos,
          }}
        />
      </div>
      {/* Animated Freeform Gradient Blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl"
          style={{
            top: "-10vw",
            left: "-10vw",
            backgroundColor: "var(--blob-purple)",
            animation: "blob1 60s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl"
          style={{
            bottom: "-8vw",
            right: "-8vw",
            backgroundColor: "var(--blob-blue)",
            animation: "blob2 40s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[38vw] h-[38vw] rounded-full blur-3xl"
          style={{
            top: "0vh",
            left: "60vw",
            backgroundColor: "var(--blob-cyan)",
            animation: "blob3 80s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[42vw] h-[42vw] rounded-full blur-3xl"
          style={{
            top: "60vh",
            left: "10vw",
            backgroundColor: "var(--blob-orange)",
            animation: "blob4 60s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[36vw] h-[36vw] rounded-full blur-3xl"
          style={{
            bottom: "10vh",
            right: "30vw",
            backgroundColor: "var(--blob-red)",
            animation: "blob5 70s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
}
