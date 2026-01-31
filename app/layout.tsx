import type { Metadata } from "next";
import { Outfit, Titan_One } from "next/font/google";
import "./globals.css";

// Enable static generation for better performance
export const dynamic = 'auto';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-titan-one",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CANZZY | The Tangy Candy Revolution",
  description: "Experience the tangy revolution of CANZZY.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/SmoothScroll";
import { ScrollProvider } from "@/context/ScrollContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${titanOne.variable} antialiased`}>
        <ThemeProvider>
          <ScrollProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
