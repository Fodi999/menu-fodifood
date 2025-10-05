import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-gray-100 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



