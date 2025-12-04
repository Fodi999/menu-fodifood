"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { CartProvider } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RestaurantProvider>
        <CartProvider>
            {children}
          <Cart />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </RestaurantProvider>
    </ThemeProvider>
  );
}
