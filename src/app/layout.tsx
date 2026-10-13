import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

import { getAssetPath } from "@/lib/getAssetPath";

export const metadata: Metadata = {
  title: "32 Smiles Multispeciality Dental Clinic | Advanced Dental Care & Implant Centre",
  description: "32 Smiles Multispeciality Dental Clinic provides expert comprehensive dental treatments including Dental Implants, Root Canal Treatment, Orthodontics, Teeth Whitening, Cosmetic Dentistry, and Laser Dental Care.",
  keywords: [
    "32 Smiles",
    "32 Smiles Multispeciality Dental Clinic",
    "Multispeciality Dental Clinic",
    "Dental Clinic",
    "Dentist",
    "Dental Implants",
    "Root Canal Treatment",
    "Teeth Alignment",
    "Orthodontics",
    "Cosmetic Dentistry",
    "Teeth Whitening",
    "Laser Dentistry",
  ],
  icons: {
    icon: [
      { url: getAssetPath("/favicon.ico"), sizes: "any" },
      { url: getAssetPath("/favicon-16x16.png"), sizes: "16x16", type: "image/png" },
      { url: getAssetPath("/favicon-32x32.png"), sizes: "32x32", type: "image/png" },
      { url: getAssetPath("/favicon-48x48.png"), sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: getAssetPath("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: getAssetPath("/manifest.webmanifest"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
