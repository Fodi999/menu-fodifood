import "./globals.css";
import { Providers } from "./providers";
import LayoutContent from "@/components/LayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] text-gray-100">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}



