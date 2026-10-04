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
    icon: { url: "/assets/wownilla-mug-icon.png", type: "image/png" },
    apple: "/assets/wownilla-mug-apple.png",
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
