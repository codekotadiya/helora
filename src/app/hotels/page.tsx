import type { Metadata } from "next";
import VerticalPage from "@/components/VerticalPage";

export const metadata: Metadata = {
  title: "Hotels",
  description:
    "Helora covers the hotel front desk after hours — rooms, concierge, groups — with a clean handoff to staff.",
};

export default function HotelsPage() {
  return <VerticalPage id="hotels" />;
}
