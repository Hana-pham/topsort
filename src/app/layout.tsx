import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Topsort — Integration Health Dashboard",
  description: "Concept integration health dashboard built on Topsort's public v2 API architecture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
