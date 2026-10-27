import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Regulamin | NOKTURN", robots: { index: false } };

export default function Page() {
  return <LegalPage title="Regulamin strony internetowej">
    <Section title="1. Operator i zakres regulaminu">
      <p>Operatorem strony NOKTURN jest {site.owner}, adres kontaktowy: {site.address}. Kontakt: {site.email}.</p>
      <p>Regulamin określa zasady bezpłatnego korzystania z treści strony, interaktywnych prezentacji i kalkulatora. Nie reguluje przyszłych płatnych usług asystenta telefonicznego ani chatbota — ich zakres i warunki wymagają odrębnej umowy.</p>
    </Section>
    <Section title="2. Dostępne funkcje">
      <ul>
        <li>Informacje o koncepcji asystentki telefonicznej i chatbota dla firm.</li>
        <li>Symulacje przygotowanych rozmów i przykładowych podsumowań. Nie łączą się z modelem AI, nie wykonują połączeń, nie nagrywają dźwięku i nie wysyłają zgłoszeń.</li>
        <li>Demonstracje czatu i głosu AI, gdy są włączone. Odpowiedzi powstają automatycznie i mogą zawierać błędy. Rozmowa głosowa odbywa się przez krótkie nagrania w przeglądarce. Limit to 20 sekund na nagranie i 10 prób czatu i głosu łącznie z jednej sieci w ciągu 24 godzin. Dostępność zależy również od wspólnej puli prób; nie odnawia się ona automatycznie. Nieudane zapytania do dostawcy mogą zużyć próbę.</li>
        <li>Kalkulator wartości potencjalnych zleceń. Wynik wynika z ustawionych przez użytkownika założeń i nie stanowi gwarancji przychodu, oszczędności ani efektów wdrożenia.</li>
      </ul>
      <p>Strona nie umożliwia zakupu, płatności, zakładania konta ani zawarcia umowy o wdrożenie. Przykłady rozmów są fikcyjne i nie potwierdzają rzeczywistych rezerwacji.</p>
    </Section>
    <Section title="3. Korzystanie ze strony">
      <p>Do korzystania potrzebne są urządzenie z dostępem do internetu i aktualna przeglądarka. Funkcje interaktywne wymagają JavaScript. Demo głosowe wymaga również mikrofonu i udzielenia przeglądarce dostępu do niego. Użytkownik może korzystać z czatu bez mikrofonu. Operator nie pobiera opłat; koszty dostępu do internetu wynikają z umowy użytkownika z jego dostawcą.</p>
      <p>Bezpłatne korzystanie rozpoczyna się z chwilą otwarcia strony i kończy po jej opuszczeniu. Nie wymaga rejestracji ani wypowiedzenia. Regulamin można zapisać lub wydrukować za pomocą przeglądarki.</p>
      <p>W demonstracjach należy używać fikcyjnych danych. Nie służą do rzeczywistych rezerwacji, porad specjalistycznych ani zgłaszania sytuacji awaryjnych. Zabronione jest dostarczanie treści bezprawnych, zakłócanie działania strony oraz próby nieuprawnionego dostępu do jej infrastruktury.</p>
    </Section>
    <Section title="4. Reklamacje">
      <p>Problemy z działaniem strony można zgłaszać na adres {site.email}. W zgłoszeniu należy opisać problem i podać adres umożliwiający odpowiedź. Pomocne są data zdarzenia i nazwa przeglądarki.</p>
      <p>Operator odpowiada na reklamację w ciągu 14 dni od otrzymania zgłoszenia. Korzystanie z tej procedury nie ogranicza ustawowych praw użytkownika.</p>
    </Section>
    <Section title="5. Dostępność i prawa użytkownika">
      <p>Strona może być czasowo niedostępna z powodu awarii lub prac technicznych. Operator dokłada starań, aby informacje były aktualne i funkcje działały prawidłowo. Żadne postanowienie regulaminu nie wyłącza odpowiedzialności, której nie można wyłączyć na podstawie prawa.</p>
      <p>Regulamin nie ogranicza praw konsumentów ani innych osób objętych ochroną wynikającą z bezwzględnie obowiązujących przepisów.</p>
    </Section>
    <Section title="6. Prywatność i zmiany">
      <p>Zasady przetwarzania danych opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.</p>
      <p>Zmiany funkcjonalności lub przepisów mogą wymagać aktualizacji regulaminu. Nową wersję udostępniamy z datą aktualizacji; zmiany nie działają wstecz. W sprawach nieuregulowanych stosuje się właściwe przepisy prawa, a właściwość sądu wynika z tych przepisów.</p>
    </Section>
  </LegalPage>;
}
