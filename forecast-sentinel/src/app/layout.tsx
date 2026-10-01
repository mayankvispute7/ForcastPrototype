import type { Metadata } from "next";
import { ForecastWorkflowProvider } from "@/context/ForecastWorkflowContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forecast Sentinel — AI Forecast Reliability Engine",
  description:
    "AI-powered forecast bust detection for medium-range weather forecasts. Operational decision-support for meteorologists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ForecastWorkflowProvider>
          {children}
        </ForecastWorkflowProvider>
      </body>
    </html>
  );
}
