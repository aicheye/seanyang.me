"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Background from "../components/Background";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";
import ThemeButton from "../components/ThemeButton";
import songs from "../data/songs";

export default function About() {
  const [songEmbedUrl, setSongEmbedUrl] = useState("");

  useEffect(() => {
    const randomSong = songs[Math.floor(Math.random() * songs.length)].id;
    setSongEmbedUrl(`https://open.spotify.com/embed/track/${randomSong}`);
  }, []);

  const handleChangeSong = () => {
    const randomSong = songs[Math.floor(Math.random() * songs.length)].id;
    setSongEmbedUrl(`https://open.spotify.com/embed/track/${randomSong}`);
  };

  const handlePoke = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    let message = formData.get("poke-message");
    const from = formData.get("poke-from");

    if (!message.trim()) {
      message = "Poke!";
    }

    if (!from.trim()) {
      message += " - Anonymous";
    } else {
      message += ` - ${from.trim()}`;
    }

    try {
      const response = await fetch("https://api.pushover.net/1/messages.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "ac7ys5qogv32ypgqcrhzih367wg8cr",
          user: "u5wtajjrd9b3rsyf82a4ezc3y4j8gf",
          message: message.trim(),
        }),
      });

      if (response.ok) {
        alert("Poke sent! 🎉");
        event.target.reset();
      } else {
        throw new Error("Failed to send poke");
      }
    } catch (error) {
      console.error("Error sending poke:", error);
      alert("Failed to send poke. Please try again!");
    }
  };

  return (
    <>
      <Background />
      <HomeButton />
      <ThemeButton />
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex lg:flex-row flex-col items-center justify-center center flex-1 mt-18 lg:gap-0 gap-5">
          <div className="flex flex-col gap-5 h-auto w-auto ml-5 lg:mr-[0] mr-5 lg:p-10 md:p-10 p-7 rounded-xl shadow-md max-w-3xl" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
            <h1 className="lg:text-4xl md:text-4xl text-2xl font-extrabold">Nice to meet you!</h1>
            <div className="flex flex-col gap-5 lg:text-lg md:text-lg text-md" style={{ color: "var(--page-subtext)" }}>
              <p>I believe in the power of technology to create positive change and am passionate about using my skills to contribute to a more equitable and sustainable future.</p>
              <p>If you are interested in my work, feel free to check out my projects on GitHub or connect with me on LinkedIn.</p>
              <p>I am always open to new opportunities and collaborations, especially in non-profit or ESG sectors, so don't hesitate to reach out if you think we could work together!</p>
              <h1 className="lg:text-2xl md:text-2xl text-xl underline decoration-dashed font-bold">{"A few things about me"}</h1>
              <div className="flex flex-col gap-5">
                <p>
                  Hometown:{" "}
                  <span className="font-bold typed-caret sm:typed-[Toronto]">
                    <span className="sm:hidden visible">Toronto</span>
                  </span>
                </p>
                <p>
                  Pets: 🐕🐕{" "}
                  <span className="font-bold sm:typed-[2_dogs] typed-caret">
                    <span className="sm:hidden visible">2 dogs</span>
                  </span>
                </p>
                <p>
                  Favourite Games: <span className="font-bold typed-caret">Cities Skylines II, Minecraft, Overwatch</span>
                </p>
                <p>
                  Favourite Artists: <span className="font-bold typed-caret"> beabadoobee, Laufey, keshi, starfall</span>
                </p>
                <p>
                  If I could live anywhere, it would be: 🌑{" "}
                  <span className="font-bold sm:typed-[The_Moon] typed-caret">
                    <span className="sm:hidden visible">The Moon</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 h-auto w-auto">
            <div className="flex flex-col h-auto w-auto mx-5 lg:p-10 md:p-10 p-7 rounded-xl shadow-md max-w-3xl gap-3" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-subtext)" }}>
              <h1 className="lg:text-2xl md:text-2xl text-xl font-bold" style={{ color: "var(--page-text)" }}>
                Song recommendation:{" "}
              </h1>
              <div className="w-full h-20 rounded-xl overflow-hidden" style={{ backgroundColor: "var(--card-image-bg)" }}>
                {songEmbedUrl ? (
                  <iframe src={songEmbedUrl} width="100%" height="80" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ border: "none", borderRadius: "12px" }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--subtext)" }}>
                    Loading song...
                  </div>
                )}
              </div>
              <button onClick={handleChangeSong} className="px-6 py-3 rounded-lg font-medium transition-colors self-stretch sm:self-start min-w-[80px] hover:scale-105 active:scale-100 flex items-center justify-center" style={{ backgroundColor: "var(--spot-color)", color: "var(--page-bg)" }}>
                Change!
              </button>
            </div>
            <div className="flex flex-col h-auto w-auto mx-5 lg:p-10 md:p-10 p-7 rounded-xl shadow-md max-w-3xl gap-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
              <h2 className="lg:text-2xl md:text-2xl text-xl font-bold">Ping my phone!</h2>
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
                    placeholder="Your message here..."
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
                    placeholder="From:"
                    maxLength={21}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-medium transition-colors self-stretch min-w-[80px] hover:scale-105 active:scale-100 flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "var(--page-bg)",
                  }}
                >
                  Poke
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
