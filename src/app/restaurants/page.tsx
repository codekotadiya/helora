import type { Metadata } from "next";
import VerticalPage from "@/components/VerticalPage";

export const metadata: Metadata = {
  title: "Restaurants",
  description:
    "Helora takes restaurant reservations, waitlists, and private dining so hosts stay on the floor.",
};

export default function RestaurantsPage() {
  return <VerticalPage id="restaurants" />;
}
