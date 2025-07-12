"use client";

import { useEffect, useRef, useState } from "react";
import { useSupabaseClickCounter } from "../hooks/useSupabaseClickCounter.js";
import useOnekoStore from "../stores/OnekoStore.jsx";
import CatTooltip from "./CatTooltip.jsx";

export default function Oneko({ nekoFile = "/oneko.gif" }) {
  const [tooltipText, setTooltipText] = useState("Click me! 🐱");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 32, y: 32 });
  const [isMounted, setIsMounted] = useState(false);

  // Supabase click counter
  const { incrementClick } = useSupabaseClickCounter();

  const nekoRef = useRef(null);
  const animationRef = useRef(null);

  // Direct variables like the original (using refs to persist across renders)
  const nekoPosX = useRef(32);
  const nekoPosY = useRef(32);
  const mousePosX = useRef(useOnekoStore.getState().pos.x);
  const mousePosY = useRef(useOnekoStore.getState().pos.y);
  const frameCount = useRef(0);
  const idleTime = useRef(0);
  const idleAnimation = useRef(null);
  const idleAnimationFrame = useRef(0);
  const lastFrameTimestamp = useRef(null);

  // Ensure we only render on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  const setSprite = (name, frame) => {
    if (!nekoRef.current) return;
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoRef.current.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  };

  const resetIdleAnimation = () => {
    idleAnimation.current = null;
    idleAnimationFrame.current = 0;
  };

  const idle = () => {
    idleTime.current += 1;

    // every ~ 20 seconds
    if (idleTime.current > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation.current === null) {
      let availableIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX.current < 32) {
        availableIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY.current < 32) {
        availableIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX.current > window.innerWidth - 32) {
        availableIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY.current > window.innerHeight - 32) {
        availableIdleAnimations.push("scratchWallS");
      }
      idleAnimation.current = availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)];
    }

    switch (idleAnimation.current) {
      case "sleeping":
        if (idleAnimationFrame.current < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame.current / 4));
        if (idleAnimationFrame.current > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation.current, idleAnimationFrame.current);
        if (idleAnimationFrame.current > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame.current += 1;
  };

  const frame = () => {
    frameCount.current += 1;
    const diffX = nekoPosX.current - mousePosX.current;
    const diffY = nekoPosY.current - mousePosY.current;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Use 48 like the original instead of 96
    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation.current = null;
    idleAnimationFrame.current = 0;

    if (idleTime.current > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime.current = Math.min(idleTime.current, 7);
      idleTime.current -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount.current);

    nekoPosX.current -= (diffX / distance) * nekoSpeed;
    nekoPosY.current -= (diffY / distance) * nekoSpeed;

    nekoPosX.current = Math.min(Math.max(16, nekoPosX.current), window.innerWidth - 16);
    nekoPosY.current = Math.min(Math.max(16, nekoPosY.current), window.innerHeight - 16);

    // Update store and state for tooltip
    useOnekoStore.getState().setPos({ x: nekoPosX.current, y: nekoPosY.current });
    setCatPosition({ x: nekoPosX.current, y: nekoPosY.current });

    if (nekoRef.current) {
      nekoRef.current.style.left = `${nekoPosX.current - 16}px`;
      nekoRef.current.style.top = `${nekoPosY.current - 16}px`;
    }
  };

  const onAnimationFrame = (timestamp) => {
    // Stops execution if the neko element is removed from DOM
    if (!nekoRef.current) {
      return;
    }

    if (!lastFrameTimestamp.current) {
      lastFrameTimestamp.current = timestamp;
    }

    if (timestamp - lastFrameTimestamp.current > 100) {
      lastFrameTimestamp.current = timestamp;
      frame();
    }

    animationRef.current = requestAnimationFrame(onAnimationFrame);
  };

  useEffect(() => {
    // Only run if mounted
    if (!isMounted) return;

    // Check for reduced motion like the original
    const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    // Initialize positions from store or use defaults
    const storedPos = useOnekoStore.getState().pos;
    nekoPosX.current = storedPos.x || 32;
    nekoPosY.current = storedPos.y || 32;
    setCatPosition({ x: nekoPosX.current, y: nekoPosY.current });

    // Mouse move handler - exactly like the original
    const handleMouseMove = (event) => {
      mousePosX.current = event.clientX;
      mousePosY.current = event.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Start animation
    animationRef.current = requestAnimationFrame(onAnimationFrame);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleClick = async () => {
    const newCount = await incrementClick();
    setTooltipText(`Meow 💗 Global Click #${newCount.toLocaleString()}`);
    setTooltipVisible(true);
  };

  const handleMouseEnter = () => {
    // Keep tooltip visible when hovering
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      <div
        ref={nekoRef}
        id="oneko"
        aria-hidden="true"
        style={{
          width: "32px",
          height: "32px",
          position: "fixed",
          pointerEvents: "auto", // Enable clicking unlike the original
          imageRendering: "pixelated", // Use pixelated like the original
          left: `${nekoPosX.current - 16}px`,
          top: `${nekoPosY.current - 16}px`,
          zIndex: 2147483647,
          backgroundImage: `url(${nekoFile})`,
          backgroundSize: "256px 128px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-96px -96px", // Default idle position
          cursor: "pointer",
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <CatTooltip visible={tooltipVisible} text={tooltipText} catX={catPosition.x} catY={catPosition.y} />
    </>
  );
}
