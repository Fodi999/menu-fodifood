import "./globals.css";
import { Providers } from "./providers";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <AnimatedBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



