import type { Metadata } from "next";
import { RestaurantHero } from "@/components/Restaurant/RestaurantHero";
import { MenuWithCategories } from "@/components/Restaurant/MenuWithCategories";
import { AboutRestaurant } from "@/components/Restaurant/AboutRestaurant";
import { OurTeam } from "@/components/Restaurant/OurTeam";
import { TableReservation } from "@/components/Restaurant/TableReservation";
import { Delivery } from "@/components/Restaurant/Delivery";
import { RestaurantNavbar } from "@/components/Restaurant/RestaurantNavbar";
import { RestaurantFooter } from "@/components/Restaurant/RestaurantFooter";
import { ScrollToTop } from "@/components/Resume/ScrollToTop";

export const metadata: Metadata = {
  title: "FodiFood - Японская кухня с доставкой | Japanese Restaurant",
  description:
    "Заказывайте суши, роллы и японскую кухню с доставкой. Свежие продукты, быстрая доставка. Order sushi and Japanese cuisine online. Fresh ingredients, fast delivery.",
  keywords: [
    "суши",
    "роллы",
    "японская кухня",
    "доставка еды",
    "sushi",
    "rolls",
    "japanese food",
    "food delivery",
    "FodiFood",
  ],
  openGraph: {
    title: "FodiFood - Japanese Restaurant & Delivery",
    description:
      "Заказывайте лучшие суши и роллы с доставкой. Order the best sushi and rolls with delivery.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <RestaurantNavbar />
      <main className="pt-14 sm:pt-16 lg:pt-20">
        <RestaurantHero />
        <MenuWithCategories />
        <AboutRestaurant />
        <OurTeam />
        <TableReservation />
        <Delivery />
      </main>
      <RestaurantFooter />
      <ScrollToTop />
    </div>
  );
}
