"use client";

import Background from "../components/Background";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";
import ThemeButton from "../components/ThemeButton";

export default function About() {
  return (
    <>
      <Background />
      <HomeButton />
      <ThemeButton />
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex flex-col items-center justify-center gap-4 text-center flex-1">
          <h1>About Me</h1>
          <p>This is the about page.</p>
        </div>
        <Footer />
      </div>
    </>
  );
}
