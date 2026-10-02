import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Cinzel,
  Marcellus,
  Metamorphous,
  Roboto_Condensed,
} from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});
const metamorphous = Metamorphous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-metamorphous",
});
const cinzel = Cinzel({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-cinzel",
});
const narrow = Roboto_Condensed({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

/** Preserves the public page identity without inventing a canonical deployment URL. */
export const metadata: Metadata = {
  title: "WOWNILLA — Enter the Horde",
  description:
    "WOWNILLA — a community-powered meme forged in the chaos of Azeroth. Not financial advice. Just a really good meme.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23D4AF37' d='M12 1l1.6 2.2L12 5.4 10.4 3.2zM1.5 5h4.6l3.6 10.6L12 9v5.6L10 20H8.1zM22.5 5h-4.6l-3.6 10.6L12 9v5.6l2 5.4h1.9z'/%3E%3C/svg%3E",
  },
};

/** Matches the browser chrome to the original dark page background. */
export const viewport: Viewport = { themeColor: "#0B0A08" };

/** Loads shared fonts and styles once for all App Router pages. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${metamorphous.variable} ${cinzel.variable} ${narrow.variable}`}
    >
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
