"use client";

import { useState } from "react";
import { WebsiteCarbonBadge } from "react-websitecarbon-badge";
import useThemeStore from "../stores/ThemeStore";
import { ExternalLinkIcon, GitHubIcon, InstagramIcon, LetterboxdIcon, LinkedInIcon } from "./Icons";
import Tooltip from "./Tooltip";

export default function Footer({ co2 = "0.03", percentage = "93", url = "" }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const isLightMode = useThemeStore((state) => state.isLightMode);

  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      <footer className="py-8 flex flex-col items-center gap-2 sm:gap-4 z-10">
        <div id="contact" className="flex sm:flex-row flex-col sm:gap-4 gap-1 items-center" style={{ color: "var(--page-text)" }}>
          <div className="flex sm:gap-4 gap-2 items-center">
            <span className="text-4xl flex sm:gap-2 items-center">
              <a href="https://github.com/aicheye/" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("github.com/aicheye")} onMouseLeave={handleMouseLeave}>
                <GitHubIcon className="w-10 h-10" />
              </a>
              <a href="https://www.linkedin.com/in/syang07/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("linkedin.com/in/syang07")} onMouseLeave={handleMouseLeave}>
                <LinkedInIcon className="w-10 h-10" />
              </a>
              <a href="https://www.instagram.com/seanyang_esports_gaming/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("instagram.com/seanyang_esports_gaming")} onMouseLeave={handleMouseLeave}>
                <InstagramIcon className="w-10 h-10" />
              </a>
              <a href="https://letterboxd.com/aicheye/" aria-label="Letterboxd" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("letterboxd.com/aicheye")} onMouseLeave={handleMouseLeave}>
                <LetterboxdIcon className="w-10 h-10" />
              </a>
            </span>
            <span>·</span>
            <a href="mailto:sean@seanyang.me" aria-label="Email" className="text-lg underline" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center" style={{ height: "32px" }}>
                sean@seanyang.me
              </div>
            </a>
          </div>
          <span className="hidden sm:block">·</span>
          <a href="https://docs.seanyang.me/resume/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline text-lg flex items-center gap-2">
            <div className="flex items-center justify-center gap-2" style={{ height: "32px" }}>
              View Resumé <ExternalLinkIcon className="w-6 h-6" />
            </div>
          </a>
        </div>
        <div className="items-center text-md" style={{ color: "var(--page-text)" }}>
          <WebsiteCarbonBadge dark={!isLightMode} co2={co2} percentage={percentage} url={"seanyang-me" + (url ? `-${url}` : "")} />
        </div>

        <div className="text-md" style={{ color: "var(--copyright-text)" }}>
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center justify-center" style={{ height: "32px" }}>
              © {new Date().getFullYear()} Sean Yang (MIT License)
            </div>
          </a>
        </div>
      </footer>

      <Tooltip visible={tooltipVisible} text={tooltipText} />
    </>
  );
}
