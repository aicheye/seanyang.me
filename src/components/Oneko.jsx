"use client";

import { useEffect, useRef, useState } from "react";
import useOnekoStore from "../stores/OnekoStore.jsx";
import CatTooltip from "./CatTooltip.jsx";

export default function Oneko({ nekoFile = "/oneko.gif" }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [tooltipText, setTooltipText] = useState("Click me! 🐱");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 32, y: 32 });
  const [isMounted, setIsMounted] = useState(false);

  const nekoRef = useRef(null);
  const animationRef = useRef(null);

  const nekoPosX = useRef(32);
  const nekoPosY = useRef(32);
  const mousePosX = useRef(useOnekoStore.getState().pos.x);
  const mousePosY = useRef(useOnekoStore.getState().pos.y);
  const frameCount = useRef(0);
  const idleTime = useRef(0);
  const idleAnimation = useRef(null);
  const idleAnimationFrame = useRef(0);
  const lastFrameTimestamp = useRef(null);

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
    if (isTouchDevice) {
      idle();
      return;
    }

    frameCount.current += 1;
    const diffX = nekoPosX.current - mousePosX.current;
    const diffY = nekoPosY.current - mousePosY.current;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation.current = null;
    idleAnimationFrame.current = 0;

    if (idleTime.current > 1) {
      setSprite("alert", 0);
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

    useOnekoStore.getState().setPos({ x: nekoPosX.current, y: nekoPosY.current });
    setCatPosition({ x: nekoPosX.current, y: nekoPosY.current });

    if (nekoRef.current) {
      nekoRef.current.style.left = `${nekoPosX.current - 16}px`;
      nekoRef.current.style.top = `${nekoPosY.current - 16}px`;
    }
  };

  const onAnimationFrame = (timestamp) => {
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
    if (!isMounted) return;

    const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);

    const storedPos = useOnekoStore.getState().pos;
    nekoPosX.current = storedPos.x || 32;
    nekoPosY.current = storedPos.y || 32;
    setCatPosition({ x: nekoPosX.current, y: nekoPosY.current });

    const handleMouseMove = (event) => {
      mousePosX.current = event.clientX;
      mousePosY.current = event.clientY;
    };

    if (!window.matchMedia("(pointer: coarse)").matches) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    animationRef.current = requestAnimationFrame(onAnimationFrame);

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
    try {
      const response = await fetch("https://api.seanyang.me/cat", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Click response data:", data);
        const count = data.count;
        setTooltipText(`Meow 💗 Global Click #${count.toLocaleString()}`);
        setTooltipVisible(true);

        if (isTouchDevice) {
          setTimeout(() => {
            setTooltipVisible(false);
          }, 2000);
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending click:", error);
      setTooltipText("Meow 💗 Click failed - try again!");
      setTooltipVisible(true);
      if (isTouchDevice) {
        setTimeout(() => {
          setTooltipVisible(false);
        }, 2000);
      }
    }
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
          pointerEvents: "auto",
          imageRendering: "pixelated",
          left: `${nekoPosX.current - 16}px`,
          top: `${nekoPosY.current - 16}px`,
          zIndex: 2147483647,
          backgroundImage: `url(${nekoFile})`,
          backgroundSize: "256px 128px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-96px -96px",
          cursor: "pointer",
        }}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        fetchPriority="high"
      />
      <CatTooltip visible={tooltipVisible} text={tooltipText} catX={catPosition.x} catY={catPosition.y} />
    </>
  );
}
