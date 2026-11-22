import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FixMate — Broken device? Fixed.",
    template: "%s · FixMate",
  },
  description:
    "Book verified technicians for smartphone, laptop, AC and home appliance repairs. Track every job and pay only after it's fixed.",
  keywords: ["repair", "technician", "device repair", "home appliance", "Bangladesh", "FixMate"],
  openGraph: {
    title: "FixMate — Broken device? Fixed.",
    description: "Verified technicians. Trackable jobs. Pay after service.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
