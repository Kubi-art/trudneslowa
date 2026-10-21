import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Polityka prywatności | NOKTURN", robots: { index: false } };

export default function Page() {
  return <LegalPage title="Polityka prywatności">
    <p>Dokument dotyczy obecnej strony informacyjnej NOKTURN, jej symulacji i kalkulatora. Uruchomienie rzeczywistych rozmów AI będzie wymagało osobnego opisania przetwarzania danych przed udostępnieniem tej funkcji.</p>
    <Section title="1. Administrator danych">
      <p>Administratorem danych jest {site.company}, {site.owner}, adres: {site.address}. Kontakt w sprawach danych osobowych: {site.email}.</p>
    </Section>
    <Section title="2. Co dzieje się z danymi na stronie">
      <p>Strona jest utrzymywana na platformie Vercel. Wyświetlenie strony wiąże się z przetwarzaniem danych połączenia, w tym adresu IP, żądanego adresu strony, czasu żądania i informacji przesyłanych przez przeglądarkę. Służą one dostarczeniu strony, diagnostyce oraz ochronie przed nadużyciami.</p>
      <p>Podstawą przetwarzania danych technicznych jest prawnie uzasadniony interes administratora polegający na udostępnianiu i zabezpieczaniu strony (art. 6 ust. 1 lit. f RODO).</p>
      <p>Ustawienia kalkulatora i wybory w symulacji pozostają w pamięci przeglądarki na czas działania strony. Kod tych funkcji nie wysyła ich do serwera i nie zapisuje ich w localStorage ani plikach cookies. Przykładowe nazwiska i rozmowy nie pochodzą od rzeczywistych klientów.</p>
      <p>Obecna strona nie udostępnia formularza kontaktowego, aktywnego chatbota, linii telefonicznej ani kalendarza rezerwacji. Nie pobiera nagrań głosu.</p>
    </Section>
    <Section title="3. Kontakt z administratorem">
      <p>Jeżeli wyślesz wiadomość e-mail, przetwarzane będą Twój adres, treść wiadomości i inne dobrowolnie podane dane, aby odpowiedzieć na pytanie lub reklamację. Podstawą jest prawnie uzasadniony interes w obsłudze korespondencji (art. 6 ust. 1 lit. f RODO), a w przypadku działań przed zawarciem umowy na Twoje żądanie — art. 6 ust. 1 lit. b RODO.</p>
      <p>Podanie danych w korespondencji jest dobrowolne, ale adres zwrotny i opis sprawy są potrzebne do odpowiedzi. Do korzystania z symulacji i kalkulatora nie trzeba podawać danych osobowych.</p>
    </Section>
    <Section title="4. Odbiorcy, retencja i transfery danych">
      <p>Dostawcą infrastruktury strony jest Vercel Inc. Dane techniczne mogą być dostępne temu dostawcy i podmiotom obsługującym jego infrastrukturę. Dane korespondencji będą również przetwarzane przez dostawcę wybranej skrzynki pocztowej.</p>
      <p><strong>Do potwierdzenia przed publikacją:</strong> dostawca poczty, okres przechowywania korespondencji, plan Vercel i retencja logów oraz obowiązujące warunki powierzenia i ewentualnego przekazywania danych poza EOG. Te informacje muszą odpowiadać rzeczywistej konfiguracji usług.</p>
    </Section>
    <Section title="5. Prawa dotyczące danych">
      <p>Na warunkach określonych w RODO masz prawo dostępu do danych, sprostowania, usunięcia i ograniczenia przetwarzania. Możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie z przyczyn związanych z Twoją szczególną sytuacją. Prawo do przenoszenia danych przysługuje, gdy spełnione są warunki art. 20 RODO.</p>
      <p>Wnioski kieruj na adres administratora podany powyżej. Odpowiedź jest udzielana co do zasady w ciągu miesiąca; jeśli zachodzą ustawowe przesłanki przedłużenia, otrzymasz informację o przyczynach i terminie.</p>
      <p>Możesz również złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Informacje o sposobie składania skarg znajdują się na <a href="https://uodo.gov.pl/">uodo.gov.pl</a>.</p>
      <p>W ramach obecnej strony nie podejmujemy zautomatyzowanych decyzji wywołujących skutki prawne lub podobnie istotne skutki dla użytkownika i nie prowadzimy profilowania.</p>
    </Section>
    <Section title="6. Cookies i zasoby strony">
      <p>W kodzie strony nie wdrożono analityki, pikseli reklamowych ani marketingowych plików cookies. Zdjęcie i font są dostarczane wraz ze stroną, bez osadzania filmów i zewnętrznych kalendarzy. Mechanizmy infrastruktury i zabezpieczeń wymagają sprawdzenia na domenie produkcyjnej przed publikacją ostatecznej wersji tego dokumentu.</p>
    </Section>
    <Section title="7. Aktualizacje">
      <p>Dokument będzie aktualizowany przy zmianie zakresu przetwarzania lub dostawców. Data aktualizacji widnieje u góry. Przed uruchomieniem funkcji AI opiszemy jej dostawców, dane, cele, podstawy i okresy przetwarzania.</p>
    </Section>
  </LegalPage>;
}
