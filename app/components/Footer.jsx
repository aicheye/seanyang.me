"use client";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <>
      <footer className="mt-auto py-8 flex flex-col items-center gap-2 z-10">
        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2 items-center mb-4" style={{ color: "var(--page-text)" }}>
          <div className="flex lg:gap-4 md:gap-4 gap-2 items-center">
            <span className="lg:text-3xl md:text-3xl text-2xl flex gap-2 lg:gap-4 md:gap-4 items-center">
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
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline lg:text-lg md:text-lg text-md flex items-center gap-2">
            View Resumé
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
          </a>
        </div>
        <div className="text-sm" style={{ color: "var(--muted-text)" }}>
          © {new Date().getFullYear()} Sean Yang{" "}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
            (CC BY-NC-SA 4.0)
          </a>
        </div>
      </footer>
    </>
  );
}
