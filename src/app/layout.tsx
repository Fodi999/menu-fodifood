"use client";

import "./globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-900">
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </body>
    </html>
  );
}



