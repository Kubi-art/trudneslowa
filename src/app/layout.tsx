import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "NOKTURN | Asystentka telefoniczna i chatbot AI",
  description:
    "Poznaj demo NOKTURN: asystentka telefoniczna i chatbot AI dla Twojej firmy. Dwa kanały kontaktu, czytelne zgłoszenia.",
  openGraph: {
    title: "NOKTURN | Telefon i chatbot AI",
    description:
      "Zobacz, jak telefon AI i chatbot pomagają przyjmować zapytania klientów. Interaktywna prezentacja NOKTURN.",
    locale: "pl_PL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111110",
  // potrzebne, żeby env(safe-area-inset-bottom) działało na iPhonie (pasek na dole ekranu)
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={GeistSans.variable}>
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
        >
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
