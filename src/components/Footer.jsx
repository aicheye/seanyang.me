"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Tooltip from "./Tooltip";

config.autoAddCss = false;

export default function Footer() {
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
      <footer className="mt-auto py-8 flex flex-col items-center gap-2 z-10">
        <div id="contact" className="flex sm:flex-row flex-col sm:gap-4 gap-2 items-center" style={{ color: "var(--page-text)" }}>
          <div className="flex sm:gap-4 gap-2 items-center">
            <span className="sm:text-3xl text-2xl flex gap-2 sm:gap-4 items-center">
              <a href="https://github.com/aicheye/" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("github.com/aicheye")} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/syang07/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" onMouseEnter={() => handleMouseEnter("linkedin.com/in/syang07")} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </span>
            <span>·</span>
            <a href="mailto:contact@seanyang.me" aria-label="Email" className="sm:text-lg text-md underline" target="_blank" rel="noopener noreferrer">
              contact@seanyang.me
            </a>
          </div>
          <span className="hidden lg:block md:block">·</span>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline sm:text-lg text-md flex items-center gap-2">
            View Resumé
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
          </a>
        </div>
        <div className="text-sm" style={{ color: "var(--copyright-text)" }}>
          © {new Date().getFullYear()} Sean Yang{" "}
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
            (MIT)
          </a>
        </div>
      </footer>

      <Tooltip tooltipVisible={tooltipVisible} text={tooltipText} />
    </>
  );
}
