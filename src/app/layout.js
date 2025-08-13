import useThemeStore from "../stores/ThemeStore";
import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Sean Yang",
    default: "Sean Yang",
  },
  description: "Sean Yang's personal website",
  authors: "Sean Yang",

  openGraph: {
    title: "Sean Yang",
    description: "Sean Yang's personal website",
    url: "https://seanyang.me",
    siteName: "Sean Yang",
    images: [
      {
        url: "https://seanyang.me/favicon.png",
        width: 299,
        height: 299,
      },
    ],
    locale: "en_US",
    type: "website",
    titleLength: 100,
    descriptionLength: 500,
  },
};

export const generateViewport = () => {
  const isLightMode = useThemeStore.getState().isLightMode;

  return {
    themeColor: isLightMode ? "rgb(229, 229, 229)" : "rgb(10, 10, 10)",
    colorScheme: isLightMode ? "light" : "dark",
  };
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased scroll-smooth" data-theme={useThemeStore.getState().isLightMode ? "light" : "dark"}>
      <head>
        <link rel="preload" href="/fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
