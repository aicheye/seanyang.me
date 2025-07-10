import "./globals.css";

export const metadata = {
  title: "Sean Yang",
  description: "Sean Yang's personal website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
