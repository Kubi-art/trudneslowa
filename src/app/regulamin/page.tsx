import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Regulamin | NOKTURN" };

// PROJEKT DOKUMENTU. Przed startem uzupełnij dane w src/lib/site.ts i daj całość do sprawdzenia prawnikowi.
export default function Page() {
  return (
    <LegalPage title="Regulamin">
      <Section title="§ 1. Postanowienia ogólne">
        <ol>
          <li>
            Regulamin określa zasady korzystania ze strony internetowej NOKTURN oraz z udostępnionych na niej usług
            świadczonych drogą elektroniczną. Jest regulaminem w rozumieniu ustawy z dnia 18 lipca 2002 r. o
            świadczeniu usług drogą elektroniczną.
          </li>
          <li>
            Usługodawcą jest <strong>{site.company}</strong>, {site.owner}, {site.address}, NIP {site.nip}, REGON{" "}
            {site.regon}, e-mail: <a href={`mailto:${site.email}`}>{site.email}</a> (dalej: „Usługodawca”).
          </li>
          <li>
            Usługa wirtualnego asystenta telefonicznego dla firm jest świadczona na podstawie odrębnej umowy
            zawieranej z klientem. Regulamin nie zastępuje tej umowy.
          </li>
        </ol>
      </Section>

      <Section title="§ 2. Definicje">
        <ul>
          <li><strong>Strona</strong>: strona internetowa NOKTURN wraz z podstronami.</li>
          <li><strong>Użytkownik</strong>: każda osoba, która korzysta ze Strony lub z linii demo.</li>
          <li>
            <strong>Linia demo</strong>: numer telefonu podany na Stronie, pod którym można porozmawiać z
            przykładowym wirtualnym asystentem.
          </li>
          <li>
            <strong>Asystent</strong>: program oparty na sztucznej inteligencji, który prowadzi rozmowy telefoniczne
            i przyjmuje zgłoszenia.
          </li>
        </ul>
      </Section>

      <Section title="§ 3. Usługi dostępne na Stronie">
        <ol>
          <li>Usługodawca udostępnia bezpłatnie: przeglądanie treści Strony, kalkulator utraconych zleceń, linię demo oraz możliwość umówienia rozmowy przez zewnętrzny kalendarz.</li>
          <li>Umowa o korzystanie ze Strony zostaje zawarta z chwilą jej otwarcia i kończy się z chwilą jej opuszczenia.</li>
          <li>Rozmowa z linią demo jest płatna według cennika operatora, z którego korzysta Użytkownik. Usługodawca nie pobiera za nią dodatkowych opłat.</li>
          <li>Wynik kalkulatora jest szacunkiem przygotowanym na podstawie danych wpisanych przez Użytkownika. Nie jest gwarancją ani obietnicą konkretnych wyników.</li>
        </ol>
      </Section>

      <Section title="§ 4. Wymagania techniczne">
        <ol>
          <li>Do korzystania ze Strony potrzebne jest urządzenie z dostępem do internetu i aktualną przeglądarką z włączoną obsługą JavaScript.</li>
          <li>Do skorzystania z linii demo potrzebny jest telefon z możliwością wykonywania połączeń.</li>
        </ol>
      </Section>

      <Section title="§ 5. Zasady korzystania">
        <ol>
          <li>Użytkownik korzysta ze Strony zgodnie z prawem i dobrymi obyczajami, bez dostarczania treści o charakterze bezprawnym.</li>
          <li>
            Na początku rozmowy z linią demo Asystent informuje, że jest wirtualnym asystentem i że rozmowa jest
            nagrywana. Kontynuując rozmowę, Użytkownik przyjmuje to do wiadomości.
          </li>
          <li>
            Linia demo służy wyłącznie do pokazania działania usługi. Nie należy jej używać do zgłaszania
            prawdziwych awarii ani sytuacji zagrażających życiu lub zdrowiu. W nagłych wypadkach dzwoń pod numer
            alarmowy 112.
          </li>
        </ol>
      </Section>

      <Section title="§ 6. Usługa NOKTURN dla firm">
        <ol>
          <li>Usługa wirtualnego asystenta telefonicznego jest kierowana do przedsiębiorców.</li>
          <li>
            Ceny i opisy na Stronie są informacją handlową i zaproszeniem do rozmów. Nie stanowią oferty w
            rozumieniu Kodeksu cywilnego. Zakres usługi, cena i warunki są ustalane w umowie z klientem. Ceny podane
            na Stronie są cenami netto.
          </li>
          <li>
            W ramach usługi Usługodawca przetwarza dane osób dzwoniących do klienta na jego polecenie, na podstawie
            umowy powierzenia przetwarzania danych osobowych zawieranej razem z umową.
          </li>
          <li>
            Wobec osób fizycznych prowadzących działalność gospodarczą, dla których umowa nie ma charakteru
            zawodowego, stosuje się przepisy o ochronie konsumentów w zakresie przewidzianym prawem.
          </li>
        </ol>
      </Section>

      <Section title="§ 7. Reklamacje">
        <ol>
          <li>Reklamacje dotyczące działania Strony lub linii demo można zgłaszać na adres <a href={`mailto:${site.email}`}>{site.email}</a>.</li>
          <li>Reklamacja powinna zawierać dane kontaktowe i opis problemu.</li>
          <li>Usługodawca odpowiada na reklamację w ciągu 14 dni od jej otrzymania, na adres, z którego została wysłana.</li>
        </ol>
      </Section>

      <Section title="§ 8. Odpowiedzialność">
        <ol>
          <li>Usługodawca dba o ciągłość działania Strony i linii demo, ale mogą wystąpić przerwy techniczne, np. z powodu prac konserwacyjnych lub awarii dostawców.</li>
          <li>Treści na Stronie mają charakter informacyjny.</li>
        </ol>
      </Section>

      <Section title="§ 9. Dane osobowe">
        <p>
          Zasady przetwarzania danych osobowych opisuje <Link href="/polityka-prywatnosci">Polityka prywatności</Link>.
        </p>
      </Section>

      <Section title="§ 10. Postanowienia końcowe">
        <ol>
          <li>Usługodawca może zmienić Regulamin z ważnych przyczyn, np. zmiany przepisów lub zakresu usług. Zmiany obowiązują od dnia publikacji na Stronie.</li>
          <li>W sprawach nieuregulowanych stosuje się przepisy prawa polskiego.</li>
          <li>Spory rozstrzyga sąd właściwy według przepisów prawa.</li>
        </ol>
      </Section>
    </LegalPage>
  );
}
