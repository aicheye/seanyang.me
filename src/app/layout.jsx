import useThemeStore from "../stores/ThemeStore";
import "./globals.css";

export const metadata = {
  title: "Sean Yang",
  description: "Sean Yang's personal website",
  authors: "Sean Yang",
};

export const viewport = {
  themeColor: "var(--page-bg)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased scroll-smooth" data-theme={useThemeStore.getState().isLightMode ? "light" : "dark"}>
      <body>{children}</body>
    </html>
  );
}
