import type { Metadata } from "next";
import {  Montserrat } from "next/font/google";
import "./globals.css";
import BarkAuthProvider from "@/components/bark/bark-auth";

const siteFont = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bark Bank Pawtal",
  description: "Bark Bank Pawtal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={siteFont.className}>
        <BarkAuthProvider>{children}</BarkAuthProvider>
      </body>
    </html>
  );
}
