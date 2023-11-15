import { Providers } from "./Provider";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Inventory",
  description: "Generated by create next app",
};

import { Inter } from "next/font/google";
const fonts = Inter({ subsets: ["latin"] });

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fonts.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
