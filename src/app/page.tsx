import Link from "next/link";
import { VoiceDemo } from "@/components/voice-demo";
import { LiveDemo } from "@/components/live-demo";
import { PhoneCall } from "@/components/phone-call";
import { Calculator } from "@/components/calculator";
import { Logo } from "@/components/logo";
import { ProductDemo, Reveal } from "@/components/product-demo";
import "./redesign.css";
import { BrandScene, MobileMenu } from "@/components/brand-scene";

const features = [
  [
    "01",
    "Telefon, który ktoś odbiera.",
    "Asystentka telefoniczna",
    "Gdy pracujesz, rozmawiasz lub odpoczywasz, AI przyjmuje połączenie. Pyta o szczegóły i przygotowuje podsumowanie.",
    [
      "Odpowiedzi na pytania klientów",
      "Zebranie danych i powodu kontaktu",
      "Podsumowanie rozmowy dla Ciebie",
    ],
  ],
  [
    "02",
    "Strona, która odpowiada.",
    "Chatbot na Twoją stronę",
    "Klient nie musi szukać informacji po całej witrynie. Pyta na czacie, poznaje ofertę i zostawia zapytanie.",
    [
      "Pomoc w poznaniu Twojej oferty",
      "Odpowiedzi na podstawie wiedzy firmy",
      "Przekazanie zapytania do zespołu",
    ],
  ],
] as const;

export default function Home() {
  return (
    <div className="nk">
      <header className="nk-header">
        <nav className="nk-wrap nk-nav" aria-label="Główna">
          <Link href="/" aria-label="NOKTURN — strona główna">
            <Logo />
          </Link>
          <div className="nk-nav-links">
            <a href="#rozwiazania">Rozwiązania</a>
            <a href="#demo">Demo</a>
            <a href="#kalkulator">Kalkulator</a>
            <a href="#wdrozenie">Wdrożenie</a>
          </div>
          <MobileMenu />
          <a className="nk-button nk-button-small" href="#demo">
            Zobacz demo <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="tresc">
        <section className="nk-hero nk-wrap">
          <div className="nk-hero-copy">
            <h1>
              Dobry kontakt.
              <br />
              Nawet kiedy
              <br />
              <em>Ciebie nie ma.</em>
            </h1>
            <p className="nk-lead">
              Asystentka telefoniczna i chatbot AI dla firm.
              <br className="nk-desktop" /> Odpowiadają na pytania. Przyjmują
              zgłoszenia.
              <br className="nk-desktop" /> Dają Ci przestrzeń na Twoją pracę.
            </p>
            <div className="nk-actions">
              <a className="nk-button" href="#demo">
                Sprawdź, jak to działa <span aria-hidden="true">↗</span>
              </a>
              <a className="nk-text-link" href="#rozwiazania">
                Poznaj rozwiązania <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="nk-fine">
              Po polsku. W Twoim stylu. Z wiedzą o Twojej firmie.
            </p>
          </div>
          <div className="nk-phone-stage">
            <PhoneCall />
            <p className="nk-phone-caption">
              Przykładowy przebieg rozmowy · bez dźwięku
            </p>
          </div>
        </section>
        <section className="nk-section nk-wrap" id="rozwiazania">
          <Reveal>
            <div className="nk-section-heading">
              <div>
                <h2>
                  Klient wybiera kanał.
                  <br />
                  <span>Ty zachowujesz kontakt.</span>
                </h2>
              </div>
              <p>
                Przez telefon lub na stronie. Wybierz jedno rozwiązanie albo
                połącz oba — zależnie od tego, jak kontaktują się z Tobą
                klienci.
              </p>
            </div>
          </Reveal>
          <div className="nk-products">
            {features.map(([n, title, label, description, list], i) => (
              <Reveal key={n}>
                <article className="nk-product">
                  <div className="nk-product-label">
                    <span>{label}</span>
                  </div>
                  <div
                    className={`nk-product-visual ${i === 1 ? "nk-visual-chat" : ""}`}
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      <>
                        <div className="nk-call-disc">↗</div>
                        <div className="nk-visual-line">
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                        <span>Rozmowa → szczegóły → podsumowanie</span>
                      </>
                    ) : (
                      <>
                        <div className="nk-mini-browser">
                          <div className="nk-browser-bar">
                            <i />
                            <i />
                            <i />
                            <span>Twoja strona</span>
                          </div>
                          <div className="nk-browser-content">
                            <div className="nk-skeleton">
                              <b />
                              <i />
                              <i />
                            </div>
                            <div className="nk-mini-chat">
                              <span>W czym możemy pomóc?</span>
                              <i>Poznaj ofertę ↗</i>
                              <i>Zostaw zapytanie ↗</i>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul>
                    {list.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={i === 0 ? "#demo-glos" : "#rozmowa-ai"}
                    className="nk-text-link"
                  >
                    Zobacz przykład {i === 0 ? "rozmowy" : "czatu"}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="nk-demo-section" id="demo">
          <div className="nk-wrap">
            <Reveal>
              <div className="nk-section-heading">
                <div>
                  <h2>
                    Zadaj własne pytanie.
                    <br />
                    <span>Poznaj Maję w rozmowie.</span>
                  </h2>
                </div>
                <p>
                  Wybierz przykładową firmę. Napisz do asystentki albo porozmawiaj
                  z nią przez mikrofon — odpowiedzi powstają na żywo.
                </p>
              </div>
            </Reveal>
            <nav className="nk-demo-choices" aria-label="Wybierz sposób rozmowy"><a className="nk-button" href="#rozmowa-ai">Napisz do Mai <span aria-hidden="true">↗</span></a><a className="nk-button nk-button-ghost" href="#demo-glos">Porozmawiaj z Mają <span aria-hidden="true">↗</span></a></nav>
            <LiveDemo />
            <VoiceDemo />
            <h3 className="nk-scripted-title">Zobacz także przygotowaną symulację</h3>
            <ProductDemo />
          </div>
        </section>
        <section
          className="nk-calculator-section"
          id="kalkulator"
          aria-labelledby="calculator-heading"
        >
          <div className="nk-wrap">
            <div className="nk-section-heading">
              <h2 id="calculator-heading">
                Ile mogą być warte
                <br />
                <span>nieodebrane telefony?</span>
              </h2>
              <p>
                Zmień trzy założenia i sprawdź skalę zapytań w swojej firmie. To
                punkt wyjścia do rozmowy o wdrożeniu.
              </p>
            </div>
            <Calculator />
          </div>
        </section>
        <BrandScene src="/images/nokturn-after-hours.webp" />
        <section className="nk-section nk-wrap" id="wdrozenie">
          <Reveal>
            <div className="nk-section-heading">
              <div>
                <h2>
                  Od wiedzy o firmie
                  <br />
                  <span>do pierwszej rozmowy.</span>
                </h2>
              </div>
              <p>
                Nie musisz znać się na AI. Wspólnie ustalamy, w czym asystent ma
                pomagać i kiedy przekazać sprawę człowiekowi.
              </p>
            </div>
          </Reveal>
          <div className="nk-steps">
            {[
              [
                "01",
                "Poznajemy Twoją firmę",
                "Oferta, godziny pracy, najczęstsze pytania. Ustalamy, co AI może powiedzieć, a czego nie powinno obiecywać.",
              ],
              [
                "02",
                "Układamy i testujemy rozmowy",
                "Dopasowujemy język i scenariusze. Sprawdzasz przykłady, zanim rozwiązanie trafi do Twoich klientów.",
              ],
              [
                "03",
                "Łączymy i dopracowujemy",
                "Telefon przez przekierowanie, chatbot na stronie. Ustalamy sposób przekazywania zgłoszeń i poprawiamy szczegóły.",
              ],
            ].map(([n, t, d]) => (
              <Reveal key={n}>
                <article>
                  <span className="nk-step-number">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="nk-section nk-wrap nk-faq">
          <div>
            <h2>
              Kilka prostych
              <br />
              <span>odpowiedzi.</span>
            </h2>
          </div>
          <div>
            {[
              [
                "Czy to rozwiązanie dla mojej branży?",
                "Zaczynamy od sposobu kontaktu z klientami, a nie od etykiety branży. Najlepiej sprawdzają się powtarzalne pytania, wyjaśnianie oferty i przyjmowanie zapytań. Zakres dopasowujemy do firmy.",
              ],
              [
                "Czy mogę wybrać tylko chatbota lub tylko telefon?",
                "Tak. Są to dwa osobne rozwiązania. Możesz zacząć od jednego kanału, a drugi dodać później.",
              ],
              [
                "Czy muszę zmieniać numer telefonu?",
                "Zakładamy wykorzystanie przekierowania z Twojego numeru. Szczegóły techniczne sprawdzamy z uwzględnieniem operatora i obecnej telefonii.",
              ],
              [
                "Czy pokazane demo jest prawdziwą rozmową z AI?",
                "Czat i demo głosowe generują odpowiedzi AI na Twoje pytania, gdy są dostępne. Głos działa przez mikrofon w przeglądarce, na żywo, z automatycznym wykrywaniem końca wypowiedzi. Firmy i ceny są fikcyjne, a rezerwacje i zgłoszenia nie są realizowane. Osobno pokazujemy podpisane, przygotowane symulacje.",
              ],
              [
                "Co jest potrzebne do ustalenia ceny?",
                "Zakres odpowiedzi, wybrane kanały, przewidywana liczba rozmów i potrzebne integracje. Ten projekt prezentuje rozwiązanie; nie zawiera jeszcze oferty cenowej.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="nk-ending">
          <div className="nk-wrap">
            <h2>
              Ty zajmij się firmą.
              <br />
              <em>My zadbamy o pierwsze „dzień dobry”.</em>
            </h2>
            <a className="nk-button" href="#demo">
              Wypróbuj prezentację <span aria-hidden="true">↗</span>
            </a>
            <p className="nk-fine">
              Bezpłatne demo · bez konta · używaj fikcyjnych danych
            </p>
          </div>
        </section>
      </main>
      <footer className="nk-wrap nk-footer">
        <Logo />
        <span>Telefon i czat. Po Twojej stronie.</span>
        <nav aria-label="Informacje prawne" className="nk-legal-links"><Link href="/regulamin">Regulamin</Link><Link href="/polityka-prywatnosci">Polityka prywatności</Link></nav>
        <span>© 2026 NOKTURN</span>
      </footer>
    </div>
  );
}
