import type { Metadata } from "next";
import VerticalPage from "@/components/VerticalPage";

export const metadata: Metadata = {
  title: "Dentists",
  description:
    "Helora answers dental phones — new patients, emergencies, hygiene, insurance — on the number you already have.",
};

export default function DentistsPage() {
  return <VerticalPage id="dentists" />;
}
