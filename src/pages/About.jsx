"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Background from "../components/Background";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";
import Oneko from "../components/Oneko.jsx";
import ThemeButton from "../components/ThemeButton";
import songs from "../data/songs";

let shuffled;

export default function About() {
  const [songEmbedUrl, setSongEmbedUrl] = useState("");
  const [currSongIndex, setCurrSongIndex] = useState(0);

  useEffect(() => {
    shuffled = songs
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    const currSongId = shuffled[currSongIndex].id;
    setSongEmbedUrl(`https://open.spotify.com/embed/track/${currSongId}`);
  }, []);

  const handleChangeSong = () => {
    const nextIndex = (currSongIndex + 1) % songs.length;
    setCurrSongIndex(nextIndex);
    const nextSongId = shuffled[nextIndex].id;
    setSongEmbedUrl(`https://open.spotify.com/embed/track/${nextSongId}`);
  };

  const handlePoke = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const message = formData.get("poke-message");
    const from = formData.get("poke-from");

    try {
      const response = await fetch("https://poke-289495744141.us-central1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          author: from,
        }),
      });

      if (response.ok) {
        alert("Poke sent! 🎉");
        event.target.reset();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending poke:", error);
      alert("Failed to send poke. Please try again!");
    }
  };

  return (
    <>
      <Background />
      <Oneko />
      <HomeButton />
      <ThemeButton />
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex lg:flex-row flex-col items-center justify-center center flex-1 mt-18 lg:gap-0 gap-5 sm:mb-0 mb-8">
          <div className="flex flex-col gap-5 h-auto w-auto ml-5 lg:mr-[0] mr-5 sm:p-10 p-7 rounded-xl shadow-md max-w-xl min-w-xs" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
            <h2 className="sm:text-4xl text-2xl">Nice to meet you!</h2>
            <div className="flex flex-col gap-5 sm:text-lg text-md" style={{ color: "var(--page-subtext)" }}>
              <p>I believe in the power of technology to create positive change. I'm passionate about using my skills to contribute to a more equitable and sustainable future.</p>
              <p>I'm always open to new opportunities, especially in non-profit or ESG sectors.</p>
              <p>Don't hesitate to reach out if you think we could work together!</p>
              <h2 className="sm:text-2xl text-xl underline decoration-dashed font-bold">{"A few things about me"}</h2>
              <div className="flex flex-col gap-5">
                <p>
                  Hometown:{" "}
                  <span className="font-bold sm:typed-caret sm:typed-[Toronto]">
                    <span className="sm:hidden">Toronto</span>
                  </span>
                </p>
                <p>
                  Pets: 🐕🐕{" "}
                  <span className="font-bold sm:typed-[2_dogs] sm:typed-caret">
                    <span className="sm:hidden visible">2 dogs</span>
                  </span>
                </p>
                <p>
                  Favourite Games: <br className="sm:hidden" />
                  <span className="font-bold sm:typed-caret">Cities Skylines II, Minecraft, Overwatch</span>
                </p>
                <p>
                  Favourite Artists: <br className="sm:hidden" />
                  <span className="font-bold sm:typed-caret"> beabadoobee, Laufey, keshi, starfall</span>
                </p>
                <p>
                  If I could live anywhere, it would be: 🌑{" "}
                  <span className="font-bold sm:typed-[The_Moon] sm:typed-caret">
                    <span className="sm:hidden visible">The Moon</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 h-auto w-auto">
            <div className="flex flex-col h-auto w-auto mx-5 p-7 rounded-xl shadow-md max-w-3xl gap-3 min-w-xs" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-subtext)" }}>
              <h2 className="sm:text-2xl text-xl font-bold" style={{ color: "var(--page-text)" }}>
                Song recommendation:{" "}
              </h2>
              <div className="w-full h-20 rounded-xl overflow-hidden" style={{ backgroundColor: "var(--card-image-bg)" }}>
                {songEmbedUrl ? (
                  <iframe title="Song Recommendation" src={songEmbedUrl} width="100%" height="80" loading="lazy" style={{ border: "none", borderRadius: "12px" }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--subtext)" }}>
                    Loading song...
                  </div>
                )}
              </div>
              <button onClick={handleChangeSong} className="px-6 py-3 rounded-lg font-medium transition-colors self-stretch sm:self-start hover:scale-105 active:scale-100 flex items-center justify-center cursor-pointer" style={{ backgroundColor: "var(--spot-color)", color: "var(--page-bg)" }}>
                Change!
              </button>
            </div>
            <div className="flex flex-col h-auto w-auto mx-5 p-7 rounded-xl shadow-md max-w-3xl gap-1 min-w-xs" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
              <h2 className="sm:text-2xl text-xl">Ping my phone!</h2>
              <p>
                Yes,{" "}
                <Link href="/ping.png" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--link-color)" }}>
                  really
                </Link>
                .
              </p>
              <form className="flex flex-col sm:flex-row gap-2 w-full mt-2" onSubmit={handlePoke}>
                <div className="flex flex-col gap-2 w-full">
                  <textarea
                    name="poke-message"
                    className="flex-1 min-h-12 max-h-24 p-3 border rounded-lg resize-none"
                    style={{
                      backgroundColor: "var(--page-bg)",
                      color: "var(--page-text)",
                      borderColor: "var(--subtext)",
                    }}
                    placeholder="Poke!"
                    maxLength={42}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="poke-from"
                    className="h-12 p-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--page-bg)",
                      color: "var(--page-text)",
                      borderColor: "var(--subtext)",
                    }}
                    placeholder="Anonymous"
                    maxLength={21}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-medium transition-colors self-stretch hover:scale-105 active:scale-100 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "var(--page-bg)",
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer co2="0.13" percentage="68" url="about" />
      </div>
    </>
  );
}
