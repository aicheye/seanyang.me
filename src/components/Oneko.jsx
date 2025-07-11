"use client";

import { useEffect, useRef, useState } from "react";
import { useSupabaseClickCounter } from "../hooks/useSupabaseClickCounter.js";
import useOnekoStore from "../stores/OnekoStore.jsx";
import CatTooltip from "./CatTooltip.jsx";

export default function Oneko({ initialX = useOnekoStore.getState().pos.x, initialY = useOnekoStore.getState().pos.y, nekoFile = "/oneko.gif" }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [catPosition, setCatPosition] = useState({ x: initialX, y: initialY });

  // Supabase click counter
  const { incrementClick } = useSupabaseClickCounter();

  const nekoRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef({ x: initialX, y: initialY });
  const mouseRef = useRef({ x: initialX, y: initialY }); // Initialize to neko's position
  const stateRef = useRef({
    frameCount: 0,
    idleTime: 0,
    idleAnimation: null,
    idleAnimationFrame: 0,
    lastFrameTimestamp: null,
  });
  const [isMounted, setIsMounted] = useState(false);

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
    stateRef.current.idleAnimation = null;
    stateRef.current.idleAnimationFrame = 0;
  };

  const idle = () => {
    const state = stateRef.current;
    const pos = positionRef.current;

    state.idleTime += 1;

    // every ~ 20 seconds
    if (state.idleTime > 10 && Math.floor(Math.random() * 200) === 0 && state.idleAnimation === null) {
      let availableIdleAnimations = ["sleeping", "scratchSelf"];
      if (pos.x < 32) {
        availableIdleAnimations.push("scratchWallW");
      }
      if (pos.y < 32) {
        availableIdleAnimations.push("scratchWallN");
      }
      if (pos.x > window.innerWidth - 32) {
        availableIdleAnimations.push("scratchWallE");
      }
      if (pos.y > window.innerHeight - 32) {
        availableIdleAnimations.push("scratchWallS");
      }
      state.idleAnimation = availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)];
    }

    switch (state.idleAnimation) {
      case "sleeping":
        if (state.idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(state.idleAnimationFrame / 4));
        if (state.idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(state.idleAnimation, state.idleAnimationFrame);
        if (state.idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    state.idleAnimationFrame += 1;
  };

  const frame = () => {
    const state = stateRef.current;
    const pos = positionRef.current;
    const mouse = mouseRef.current;

    state.frameCount += 1;
    const diffX = pos.x - mouse.x;
    const diffY = pos.y - mouse.y;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 96) {
      idle();
      return;
    }

    state.idleAnimation = null;
    state.idleAnimationFrame = 0;

    if (state.idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      state.idleTime = Math.min(state.idleTime, 7);
      state.idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, state.frameCount);

    pos.x -= (diffX / distance) * nekoSpeed;
    pos.y -= (diffY / distance) * nekoSpeed;

    pos.x = Math.min(Math.max(16, pos.x), window.innerWidth - 16);
    pos.y = Math.min(Math.max(16, pos.y), window.innerHeight - 16);

    useOnekoStore.getState().setPos(pos);
    setCatPosition({ x: pos.x, y: pos.y }); // Update state for tooltip

    if (nekoRef.current) {
      nekoRef.current.style.left = `${pos.x - 16}px`;
      nekoRef.current.style.top = `${pos.y - 16}px`;
    }
  };

  const onAnimationFrame = (timestamp) => {
    const state = stateRef.current;

    // Stop execution if component is unmounted
    if (!nekoRef.current) {
      return;
    }

    if (!state.lastFrameTimestamp) {
      state.lastFrameTimestamp = timestamp;
    }

    if (timestamp - state.lastFrameTimestamp > 100) {
      state.lastFrameTimestamp = timestamp;
      frame();
    }

    animationRef.current = requestAnimationFrame(onAnimationFrame);
  };

  useEffect(() => {
    // Only run if mounted and not in reduced motion
    if (!isMounted) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      return;
    }

    // Set initial position
    positionRef.current = { x: initialX, y: initialY };

    // Initialize mouse position to current mouse position or neko position
    const getCurrentMousePosition = () => {
      // Try to get current mouse position, fallback to neko position
      mouseRef.current = { x: initialX, y: initialY };
    };

    getCurrentMousePosition();

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
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
  }, [initialX, initialY, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleClick = async () => {
    const newCount = await incrementClick();
    setTooltipText(`Meow 💗 Global Click #${newCount}`);
    setTooltipVisible(true);
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
          imageRendering: "crisp-edges",
          position: "fixed",
          pointerEvents: "auto", // Enable pointer events for clicking
          left: `${initialX - 16}px`,
          top: `${initialY - 16}px`,
          zIndex: 2147483647,
          backgroundImage: `url(${nekoFile})`,
          backgroundSize: "256px 128px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-96px -96px", // Default idle position
          cursor: "pointer", // Show pointer cursor on hover
        }}
        onClick={handleClick}
        onMouseLeave={() => {
          setTooltipVisible(false);
        }}
      />
      <CatTooltip visible={tooltipVisible} text={tooltipText} catX={catPosition.x} catY={catPosition.y} />
    </>
  );
}
