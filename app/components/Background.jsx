"use client";

import { useEffect, useState } from "react";
import "./Background.css";

export default function Background({ isLightMode = false }) {
  const [bgPos, setBgPos] = useState("0px 0px");

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
      <div className="pointer-events-none fixed inset-0 z-0">
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
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={`absolute w-[50vw] h-[50vw] rounded-full blur-3xl ${isLightMode ? "bg-purple-300 opacity-40" : "bg-purple-500 opacity-3"}`}
          style={{
            top: "-10vw",
            left: "-10vw",
            animation: "blob1 60s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute w-[40vw] h-[40vw] rounded-full blur-3xl ${isLightMode ? "bg-blue-300 opacity-40" : "bg-blue-500 opacity-3"}`}
          style={{
            bottom: "-8vw",
            right: "-8vw",
            animation: "blob2 40s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute w-[38vw] h-[38vw] rounded-full blur-3xl ${isLightMode ? "bg-cyan-300 opacity-40" : "bg-cyan-500 opacity-3"}`}
          style={{
            top: "0vh",
            left: "60vw",
            animation: "blob3 80s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute w-[42vw] h-[42vw] rounded-full blur-3xl ${isLightMode ? "bg-orange-300 opacity-40" : "bg-orange-500 opacity-3"}`}
          style={{
            top: "60vh",
            left: "10vw",
            animation: "blob4 60s ease-in-out infinite",
          }}
        />
        <div
          className={`absolute w-[36vw] h-[36vw] rounded-full blur-3xl ${isLightMode ? "bg-red-300 opacity-40" : "bg-red-500 opacity-3"}`}
          style={{
            bottom: "10vh",
            right: "30vw",
            animation: "blob5 70s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
}
