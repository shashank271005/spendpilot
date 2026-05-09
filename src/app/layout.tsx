import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"),
  title: "SpendPilot - AI Spend Audit Platform",
  description: "Audit your AI tooling spend in 60 seconds and uncover unnecessary costs.",
  openGraph: {
    title: "SpendPilot - AI Spend Audit Platform",
    description: "Audit your AI tooling spend in 60 seconds and uncover unnecessary costs.",
    url: "https://spendpilot.com",
    siteName: "SpendPilot",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendPilot",
    description: "Audit your AI tooling spend in 60 seconds and uncover unnecessary costs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
