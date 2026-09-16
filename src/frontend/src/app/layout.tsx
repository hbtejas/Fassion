import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATELIER VOGUE · AI Fashion Stylist & Wardrobe Intelligence",
  description: "Real-time AI fashion recommendations, wardrobe discovery, and virtual styling powered by vector search and generative vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-[#f1f3f7] antialiased selection:bg-[#d4af37]/30 selection:text-[#fcebc2]">
        {children}
      </body>
    </html>
  );
}
