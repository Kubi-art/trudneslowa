import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Regulamin | NOKTURN" };

export default function Page() {
  return <LegalPage title="Regulamin" />;
}
