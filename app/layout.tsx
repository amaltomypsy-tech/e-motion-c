import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EI Story Assessment",
  description: "Story-driven EI assessment prototype grounded in Mayer & Salovey’s model."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
