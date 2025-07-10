import { faAddressBook, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function ContactButton() {
  const [icon, setIcon] = useState(faAddressBook);

  return (
    <>
      <Link
        href="#contact"
        className="fixed lg:top-6 lg:right-24 md:top-6 md:right-24 top-4 right-18 lg:w-12 lg:h-12 md:w-12 md:h-12 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "var(--button-bg)",
          color: "var(--contact-button-icon)",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--button-hover)";
          setIcon(faArrowDown);
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "var(--button-bg)";
          setIcon(faAddressBook);
        }}
        aria-label="Contact"
      >
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </Link>
    </>
  );
}
