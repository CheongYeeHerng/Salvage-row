import type { Metadata } from "next";
import { Bitter, Inter, Alfa_Slab_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const display = Bitter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const brand = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Salvage Row — a secondhand marketplace",
  description:
    "A demo secondhand marketplace with natural-language search and catalogue Q&A.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <Header />
        <main className="max-w-content mx-auto px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
