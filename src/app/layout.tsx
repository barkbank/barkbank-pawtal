import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import BarkAuthProvider from "@/components/bark/bark-auth";
import RootHeader from "@/app/_components/root-header";
import RootFooter from "@/app/_components/root-footer";
import clsx from "clsx";
import { Toaster } from "@/components/ui/toaster";
import { Tracker } from "./_components/tracker";
import { GoogleAnalytics } from "@next/third-parties/google";
import APP from "@/lib/app";

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
  const measurementId = APP.getGoogleAnalyticsMeasurementId();
  return (
    <html lang="en">
      <body
        className={clsx(
          siteFont.className,
          "flex min-h-screen flex-col justify-between",
        )}
      >
        <BarkAuthProvider>
          <RootHeader />
          {children}
          <RootFooter />
          <Toaster />
          <Tracker />
        </BarkAuthProvider>
      </body>
      <GoogleAnalytics gaId={measurementId} />
    </html>
  );
}
