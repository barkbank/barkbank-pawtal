import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BarkAuthProvider from "@/components/bark/bark-auth";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <BarkAuthProvider>{children}</BarkAuthProvider>
      </body>
    </html>
  );
}
