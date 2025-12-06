"use client";

import { useState } from "react";
import { primaryEmail, socials } from "../data/socials";
import { ContactIcon, InstagramIcon, LinkedInIcon } from "./Icons";
import Tooltip from "./Tooltip";

export default function ContactCard() {
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
    <div
      className="w-full max-w-3xl mx-auto p-8 rounded-2xl shadow-lg"
      style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}
      aria-labelledby="contact-card-title"
    >
      <div className="flex items-center gap-3 mb-4">
        <ContactIcon className="w-6 h-6" />
        <h2 id="contact-card-title" className="text-2xl font-bold">Socials</h2>
      </div>
      <p className="text-lg mb-6" style={{ color: "var(--page-subtext)" }}>
        Feel free to check out what I'm up to on social media! I post about my projects, share interesting articles, and connect with fellow tech enthusiasts.
      </p>
      <p className="text-lg mb-6" style={{ color: "var(--page-subtext)" }}>
        If you want to reach me, I reply fastest via <InstagramIcon className="inline w-6 h-6" /> Instagram DMs.
        To reach me for professional inquiries, <LinkedInIcon className="inline w-6 h-6" /> LinkedIn messages and email ({primaryEmail.label}) work well too.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 rounded-lg transition-all duration-0 hover:shadow-lg hover:scale-103"
            style={{ backgroundColor: "var(--page-bg)" }}
            onMouseEnter={() => handleMouseEnter(`${s.href.replace(/^https?:\/\//, "")}`)}
            onMouseLeave={handleMouseLeave}
          >
            <s.icon className="w-6 h-6" />
            <span className="font-medium" style={{ color: "var(--page-text)" }}>{s.label}</span>
            <span className="ml-auto text-sm group-hover:translate-x-1 transition-all duration-0" style={{ color: "var(--link-color)" }}>Visit →</span>
          </a>
        ))}
      </div>

      <a
        href={primaryEmail.href}
        className="inline-flex items-center gap-3 px-5 py-3 rounded-lg font-medium mt-6 transition-all duration-0 hover:scale-105 hover:shadow-lg"
        style={{ backgroundColor: "var(--accent-color)", color: "var(--page-bg)" }}
        onMouseEnter={() => handleMouseEnter(primaryEmail.href.replace(/^mailto:/, ""))}
        onMouseLeave={handleMouseLeave}
      >
        <span>Email</span>
        <span className="opacity-80">→</span>
      </a>
      <Tooltip visible={tooltipVisible} text={tooltipText} />
    </div>
  );
}
