import Image from "next/image";
import { useState } from "react";
import useThemeStore from "../stores/ThemeStore";
import Tooltip from "./Tooltip";

export default function Blurb() {
  const isLightMode = useThemeStore((state) => state.isLightMode);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      <span>
        I'm a coder,{" "}
        <a href="https://en.wikipedia.org/wiki/Sustainable_urbanism" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("🌿 Read more")} onMouseLeave={handleMouseLeave} aria-label="Sustainable urbanism">
          sustainable urbanist
        </a>
        , and advocate for{" "}
        <a href="https://en.wikipedia.org/wiki/Democratic_socialism" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("🌹 Read more")} onMouseLeave={handleMouseLeave} aria-label="Democratic socialism">
          economic justice
        </a>{" "}
        studying Software Engineering{" "}
        <a href="https://se-webring.xyz/" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("⭕ Visit webring")} onMouseLeave={handleMouseLeave} aria-label="SE Webring">
          {isLightMode ? <Image src="/webring_logo_b.svg" alt="SE Webring" className="inline lg:h-6 md:h-6 h-5.25 w-auto pb-1.5 pt-0.5" width={24} height={24} /> : <Image src="/webring_logo_w.svg" alt="SE Webring" className="inline lg:h-6 md:h-6 h-5.25 pb-1.5 pt-0.5" width={24} height={24} />}
        </a>{" "}
        at the University of Waterloo
      </span>
      <Tooltip visible={tooltipVisible} text={tooltipText} />
    </>
  );
}
