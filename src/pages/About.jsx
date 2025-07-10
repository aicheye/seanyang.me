"use client";

import Background from "../components/Background";
import Blurb from "../components/Blurb";
import Footer from "../components/Footer";
import HomeButton from "../components/HomeButton";
import ThemeButton from "../components/ThemeButton";
import songs from "../data/songs";

export default function About() {
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  const songEmbedUrl = `https://open.spotify.com/embed/track/${randomSong}`;

  return (
    <>
      <Background />
      <HomeButton />
      <ThemeButton />
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex flex-col items-center justify-center gap-4 center flex-1">
          <div className="flex flex-col gap-5 h-auto w-auto mx-5 mt-20 px-10 py-10 rounded-xl shadow-md max-w-3xl" style={{ backgroundColor: "var(--card-bg)", color: "var(--page-text)" }}>
            <h1 className="lg:text-4xl md:text-4xl text-2xl font-extrabold">Nice to meet you!</h1>
            <div className="flex flex-col gap-5 lg:text-lg md:text-lg text-md" style={{ color: "var(--page-subtext)" }}>
              <div>
                <Blurb />.
              </div>
              <p>I believe in the power of technology to create positive change and am passionate about using my skills to contribute to a more equitable and sustainable future.</p>
              <h1 className="lg:text-2xl md:text-2xl text-xl underline decoration-dashed font-bold">{"A few things about me"}</h1>
              <div className="flex flex-col gap-5">
                <p>
                  Hometown: <span className="font-bold typed-caret typed-[Toronto]"></span>
                </p>
                <p>
                  Favourite Games: <span className="font-bold typed-caret">Cities Skyilines II, Minecraft, Overwatch</span>
                </p>
                <p>
                  Favourite Artists: <span className="font-bold typed-caret"> beabadoobee, Laufey, keshi, starfall</span>
                </p>
                <p>
                  Song Recommendation:{" "}
                  <a href="/about" className="italic">
                    (Refresh to change!)
                  </a>
                  <iframe style={{ borderRadius: "12px", marginTop: "8px" }} src={songEmbedUrl} id="recs" width="100%" height="80" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
