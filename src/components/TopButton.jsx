import Link from "next/link";
import { ArrowUpIcon } from "./Icons";

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
        aria-label="Back to top"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </Link>
    </>
  );
}
