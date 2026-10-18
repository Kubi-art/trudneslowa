import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Polityka prywatności | NOKTURN" };

export default function Page() {
  return <LegalPage title="Polityka prywatności" />;
}
