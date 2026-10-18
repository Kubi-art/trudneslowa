import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Polityka prywatności | NOKTURN" };

// PROJEKT DOKUMENTU. Przed startem uzupełnij dane w src/lib/site.ts, potwierdź listę dostawców
// i okresy przechowywania, a całość daj do sprawdzenia prawnikowi.
export default function Page() {
  return (
    <LegalPage title="Polityka prywatności">
      <p>
        Ten dokument wyjaśnia, jakie dane osobowe zbieramy w związku ze stroną NOKTURN, linią demonstracyjną
        i współpracą z naszymi klientami, w jakim celu to robimy i jakie prawa Ci przysługują. Stosujemy
        rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
      </p>

      <Section title="1. Kto jest administratorem danych">
        <p>
          Administratorem danych jest <strong>{site.company}</strong>, {site.owner}, {site.address}, NIP {site.nip},
          REGON {site.regon} (dalej: „my” lub „NOKTURN”).
        </p>
        <p>
          We wszystkich sprawach dotyczących danych osobowych napisz do nas na adres{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </Section>

      <Section title="2. Jakie dane zbieramy i skąd">
        <ul>
          <li>
            <strong>Kontakt z nami</strong> (e-mail, telefon): imię i nazwisko, adres e-mail, numer telefonu, nazwa
            firmy i treść wiadomości.
          </li>
          <li>
            <strong>Umówienie rozmowy</strong> przez zewnętrzny kalendarz (Calendly): imię, adres e-mail, numer
            telefonu i informacje o Twojej firmie, które podasz w formularzu.
          </li>
          <li>
            <strong>Rozmowa z linią demo</strong>: numer telefonu, z którego dzwonisz, nagranie głosu, zapis
            (transkrypcja) rozmowy oraz informacje, które podasz w trakcie rozmowy. Na początku połączenia
            asystent informuje, że jest wirtualnym asystentem i że rozmowa jest nagrywana.
          </li>
          <li>
            <strong>Wizyta na stronie</strong>: dane techniczne zapisywane automatycznie przez serwer, m.in.
            adres IP, typ przeglądarki i czas wizyty.
          </li>
          <li>
            <strong>Współpraca z klientami</strong>: dane osób reprezentujących firmę klienta i dane potrzebne do
            umowy i faktur.
          </li>
        </ul>
      </Section>

      <Section title="3. Po co przetwarzamy dane i na jakiej podstawie">
        <ul>
          <li>
            Odpowiedź na zapytanie, przygotowanie oferty i umówienie rozmowy: działania przed zawarciem umowy na
            Twoje żądanie (art. 6 ust. 1 lit. b RODO) oraz nasz prawnie uzasadniony interes w kontakcie z osobami,
            które się do nas zgłaszają (art. 6 ust. 1 lit. f RODO).
          </li>
          <li>Zawarcie i wykonanie umowy z klientem (art. 6 ust. 1 lit. b RODO).</li>
          <li>
            Prowadzenie księgowości i wystawianie faktur: obowiązek prawny (art. 6 ust. 1 lit. c RODO).
          </li>
          <li>
            Obsługa linii demo, czyli pokazanie, jak działa usługa, oraz poprawianie jakości rozmów: nasz prawnie
            uzasadniony interes (art. 6 ust. 1 lit. f RODO).
          </li>
          <li>
            Bezpieczeństwo strony oraz ustalenie, dochodzenie i obrona roszczeń: nasz prawnie uzasadniony interes
            (art. 6 ust. 1 lit. f RODO).
          </li>
        </ul>
      </Section>

      <Section title="4. Komu przekazujemy dane">
        <p>
          Dane mogą trafiać do firm, które świadczą dla nas usługi i przetwarzają dane w naszym imieniu, na
          podstawie umów powierzenia. Są to w szczególności:
        </p>
        <ul>
          <li>dostawca hostingu strony (Vercel Inc.),</li>
          <li>dostawca kalendarza do umawiania rozmów (Calendly LLC),</li>
          <li>
            dostawcy technologii, na której działa asystent: obsługa połączeń telefonicznych, rozpoznawanie i
            synteza mowy oraz model językowy [UZUPEŁNIJ LISTĘ DOSTAWCÓW, np. Vapi, operator numerów, dostawca głosu],
          </li>
          <li>dostawca poczty e-mail i biuro rachunkowe.</li>
        </ul>
        <p>Danych nie sprzedajemy i nie przekazujemy ich do celów marketingowych innych firm.</p>
      </Section>

      <Section title="5. Przekazywanie danych poza Europejski Obszar Gospodarczy">
        <p>
          Część naszych dostawców ma siedzibę w Stanach Zjednoczonych. W takim przypadku dane są przekazywane na
          podstawie decyzji Komisji Europejskiej w sprawie odpowiedniego stopnia ochrony (EU-U.S. Data Privacy
          Framework) albo standardowych klauzul umownych przyjętych przez Komisję Europejską. Na Twoją prośbę
          przekażemy informacje o zastosowanych zabezpieczeniach.
        </p>
      </Section>

      <Section title="6. Jak długo przechowujemy dane">
        <ul>
          <li>Zapytania i korespondencja bez zawarcia umowy: do 12 miesięcy od ostatniego kontaktu.</li>
          <li>Nagrania i zapisy rozmów z linią demo: [30 dni], chyba że wcześniej zgłosisz sprzeciw.</li>
          <li>Dane z umowy: przez czas jej trwania, a potem do upływu terminów przedawnienia roszczeń.</li>
          <li>Dokumenty księgowe: przez 5 lat od końca roku, w którym minął termin płatności podatku.</li>
          <li>Dane techniczne serwera: zgodnie z ustawieniami dostawcy hostingu, zwykle kilka dni.</li>
        </ul>
      </Section>

      <Section title="7. Twoje prawa">
        <p>Masz prawo do:</p>
        <ul>
          <li>dostępu do swoich danych i otrzymania ich kopii,</li>
          <li>sprostowania danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>przeniesienia danych, gdy przetwarzamy je na podstawie umowy,</li>
          <li>
            sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie, w tym wobec
            nagrywania rozmów z linią demo,
          </li>
          <li>
            złożenia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli
            uważasz, że naruszamy przepisy.
          </li>
        </ul>
        <p>
          Aby skorzystać z tych praw, napisz na <a href={`mailto:${site.email}`}>{site.email}</a>. Odpowiemy w
          ciągu miesiąca.
        </p>
      </Section>

      <Section title="8. Czy musisz podawać dane">
        <p>
          Podanie danych jest dobrowolne, ale bez nich nie odpowiemy na zapytanie, nie umówimy rozmowy ani nie
          zawrzemy umowy. Do zawarcia umowy i wystawienia faktury potrzebne są dane wymagane przepisami.
        </p>
      </Section>

      <Section title="9. Asystent AI a decyzje o Tobie">
        <p>
          Rozmowy prowadzi wirtualny asystent oparty na sztucznej inteligencji. Asystent przyjmuje i zapisuje
          zgłoszenia, ale nie podejmuje wobec Ciebie decyzji, które wywołują skutki prawne lub w podobny sposób
          istotnie na Ciebie wpływają (art. 22 RODO). Nie profilujemy dzwoniących.
        </p>
      </Section>

      <Section title="10. Rozmowy obsługiwane dla naszych klientów">
        <p>
          Gdy NOKTURN odbiera telefony w imieniu firmy, która jest naszym klientem, administratorem danych osób
          dzwoniących jest ta firma. My przetwarzamy te dane wyłącznie na jej polecenie, na podstawie umowy
          powierzenia przetwarzania danych (art. 28 RODO). W sprawie tych danych skontaktuj się z firmą, do której
          dzwoniłeś.
        </p>
      </Section>

      <Section title="11. Pliki cookies">
        <p>
          Strona nie używa plików cookies analitycznych ani marketingowych i nie śledzi Cię między stronami.
          Mogą działać wyłącznie mechanizmy techniczne niezbędne do wyświetlenia strony. Kalendarz do umawiania
          rozmów otwiera się na stronie Calendly, która stosuje własną politykę prywatności i cookies.
        </p>
      </Section>

      <Section title="12. Zmiany polityki">
        <p>
          Możemy aktualizować ten dokument, np. gdy zmienią się przepisy albo nasi dostawcy. Aktualna wersja jest
          zawsze dostępna na tej stronie, a data ostatniej zmiany jest podana na górze.
        </p>
      </Section>
    </LegalPage>
  );
}
