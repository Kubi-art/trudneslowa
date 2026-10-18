import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "NOKTURN | Odbiera telefony, kiedy Ty nie możesz",
  description:
    "Wirtualny asystent dla pogotowia hydraulicznego, ślusarzy i pomocy drogowej. Odbiera telefony całą dobę i wysyła Ci SMS ze zgłoszeniem.",
  openGraph: {
    title: "NOKTURN | Odbiera, kiedy Ty nie możesz",
    description: "Telefon od klienta o 3 w nocy. Zgłoszenie u Ciebie w SMS-ie po minucie.",
    locale: "pl_PL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>
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
