import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://helora.vercel.app"),
  title: {
    default: "Helora — The front desk that thinks",
    template: "%s · Helora",
  },
  description:
    "Keep your existing number. Helora is the AI voice receptionist for dentists, restaurants, and hotels — one product, templates you adopt or rewrite.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Helora — The front desk that thinks",
    description:
      "Your existing number. An AI that actually thinks. For dentists, restaurants, and hotels.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
