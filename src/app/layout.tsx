import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import BarkAuthProvider from "@/components/bark/bark-auth";
import RootHeader from "@/app/_components/root-header";
import RootFooter from "@/app/_components/root-footer";
import clsx from "clsx";

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
      <body
        className={clsx(siteFont.className, "flex min-h-screen flex-col justify-between")}
      >
        <BarkAuthProvider>
          <RootHeader />
          {children}
          <RootFooter />
        </BarkAuthProvider>
      </body>
    </html>
  );
}
