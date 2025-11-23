import "./globals.css";
import { Providers } from "./providers";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dmytro Fomin - Szef Kuchni / Chef",
    template: "%s | Dmytro Fomin Chef",
  },
  description: "Profesjonalny kucharz z 20-letnim doświadczeniem w pracy w restauracjach międzynarodowych. Specjalizacja w kuchni autorskiej i owocach morza.",
  keywords: ["chef", "kucharz", "Gdańsk", "portfolio", "culinary", "resume", "szef kuchni", "professional chef", "doświadczenie kulinarne"],
  authors: [{ name: "Dmytro Fomin", url: "https://fodifood.com" }],
  creator: "Dmytro Fomin",
  publisher: "Dmytro Fomin",
  metadataBase: new URL("https://fodifood.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://fodifood.com",
    title: "Dmytro Fomin - Szef Kuchni / Professional Chef",
    description: "Profesjonalny kucharz z 20-letnim doświadczeniem w pracy w restauracjach międzynarodowych w Polsce, Litwie, Estonii, Niemczech, Francji i Kanadzie.",
    siteName: "Dmytro Fomin Chef Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dmytro Fomin - Professional Chef",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dmytro Fomin - Szef Kuchni / Chef",
    description: "Profesjonalny kucharz z 20-letnim doświadczeniem międzynarodowym",
    images: ["/og-image.jpg"],
    creator: "@fodifood",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // добавьте свой код
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="antialiased">
        <AnimatedBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



