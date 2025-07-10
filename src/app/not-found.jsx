import Link from "next/link";
import Background from "../components/Background";
import Footer from "../components/Footer";
import ThemeButton from "../components/ThemeButton";

export default function NotFound() {
  return (
    <>
      <ThemeButton />
      <Background />
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-center flex-1 mx-6">
          <div className="flex flex-col items-center text-center gap-10">
            <div className="lg:text-6xl md:text-6xl text-4xl" style={{ fontWeight: 800 }}>
              Error 404
            </div>
            <div className="lg:text-2xl md:text-2xl text-lg flex lg:flex-row md:flex-row flex-col items-center justify-center lg:gap-4 md:gap-4 gap-10">
              <p>The page you are looking for does not exist.</p>
              <Link href="/" className="hover:scale-110 transition-transform duration-100">
                <img className="inline w-10 h-10 align-middle" src="favicon.ico" alt="Favicon" />
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
