import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GaScripts } from "@/components/scripts/ga-scripts";
import { ClarityScript } from "@/components/scripts/clarity-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GaScripts />
        <ClarityScript />
      </body>
    </html>
  );
}
