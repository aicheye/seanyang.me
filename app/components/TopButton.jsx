import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

config.autoAddCss = false;

export default function TopButton() {
  return (
    <>
      <Link
        href="#top"
        className="fixed lg:top-6 lg:right-42 md:top-6 md:right-42 top-4 right-32 lg:w-12 lg:h-12 md:w-12 md:h-12 w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "var(--button-bg)",
          color: "var(--contact-button-icon)",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--button-hover)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "var(--button-bg)";
        }}
        aria-label="Contact"
      >
        <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
      </Link>
    </>
  );
}
