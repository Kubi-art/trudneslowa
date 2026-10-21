import Link from "next/link";
import { Logo } from "@/components/logo";
import { ProductDemo, Reveal, SignalArt } from "@/components/product-demo";
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
            <a href="#wdrozenie">Jak zaczynamy</a>
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
            <p className="nk-eyebrow">
              <span className="nk-status" /> TWÓJ KONTAKT Z KLIENTEM. TAKŻE PO
              GODZINACH.
            </p>
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
          <div
            className="nk-hero-art"
            aria-label="Przykład: telefon i czat przekazują zapytania do firmy"
          >
            <div className="nk-art-grid" />
            <div className="nk-orbit nk-orbit-one" />
            <div className="nk-orbit nk-orbit-two" />
            <div className="nk-core">
              <span className="nk-core-mark">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="nk-float nk-voice">
              <div className="nk-card-top">
                <span className="nk-icon">↗</span>
                <span>
                  Asystentka telefoniczna<small>Przykładowe połączenie</small>
                </span>
                <span className="nk-status" />
              </div>
              <SignalArt />
              <p>„Dzień dobry, w czym mogę pomóc?”</p>
            </div>
            <div className="nk-float nk-chat">
              <div className="nk-card-top">
                <span className="nk-icon">⌁</span>
                <span>
                  Chatbot na stronie
                  <small>Pomoc w zasięgu jednej wiadomości</small>
                </span>
              </div>
              <p className="nk-bubble">Czy mogę zapytać o ofertę?</p>
              <p className="nk-bubble nk-answer">
                Jasne. Powiedz, czego potrzebujesz.
              </p>
            </div>
            <div className="nk-float nk-notification">
              <span className="nk-check">✓</span>
              <div>
                Wszystko, co warto wiedzieć.
                <small>Nowe zapytanie. Szczegóły w jednym miejscu.</small>
              </div>
            </div>
            <span className="nk-art-caption">
              DWA KANAŁY. JEDEN SPOKOJNIEJSZY DZIEŃ.
            </span>
          </div>
        </section>
        <div className="nk-strip">
          <div className="nk-wrap">
            <span>Dobry kontakt nie kończy się o 17:00.</span>
            <span>
              Telefon <b>↗</b>
            </span>
            <span>
              Czat <b>↗</b>
            </span>
            <span>
              Twoja firma <b>✓</b>
            </span>
          </div>
        </div>
        <section className="nk-section nk-wrap" id="rozwiazania">
          <Reveal>
            <div className="nk-section-heading">
              <div>
                <p className="nk-eyebrow">01 / ROZWIĄZANIA</p>
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
                    <span>{n}</span>
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
                    href={i === 0 ? "#demo-telefon" : "#demo-czat"}
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
                  <p className="nk-eyebrow">02 / ZOBACZ W PRAKTYCE</p>
                  <h2>
                    Mniej opowiadania.
                    <br />
                    <span>Więcej pokazania.</span>
                  </h2>
                </div>
                <p>
                  Wybierz branżę i kanał. Zobacz, jak pytanie klienta zamienia
                  się w czytelne zgłoszenie dla Twojej firmy.
                </p>
              </div>
            </Reveal>
            <ProductDemo />
          </div>
        </section>
        <BrandScene src="/images/nokturn-after-hours.webp" />
        <section className="nk-section nk-wrap" id="wdrozenie">
          <Reveal>
            <div className="nk-section-heading">
              <div>
                <p className="nk-eyebrow">03 / PROSTY POCZĄTEK</p>
                <h2>
                  Twoja wiedza.
                  <br />
                  <span>Nasz sposób na jej użycie.</span>
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
        <section className="nk-control-section">
          <div className="nk-wrap nk-control">
            <Reveal>
              <p className="nk-eyebrow">AUTOMATYZACJA Z WYRAŹNYMI GRANICAMI</p>
              <h2>
                Twoja firma.
                <br />
                Twoje zasady.
                <br />
                <span>Twój spokojniejszy dzień.</span>
              </h2>
              <p>
                Dobry asystent wie także, kiedy poprosić o pomoc. Projektujemy
                rozmowy tak, aby człowiek pozostał częścią obsługi.
              </p>
            </Reveal>
            <div className="nk-control-list">
              {[
                [
                  "Wiedza, którą zatwierdzasz",
                  "Odpowiedzi opieramy na materiałach Twojej firmy. Zakres informacji ustalamy podczas wdrożenia.",
                ],
                [
                  "Jasne przekazanie do człowieka",
                  "Gdy sprawa wykracza poza scenariusz, asystent zbiera szczegóły do dalszego kontaktu.",
                ],
                [
                  "Kontakt w stylu Twojej marki",
                  "Spokojny, konkretny lub bardziej swobodny. Sposób rozmowy dopasowujemy do Twoich klientów.",
                ],
              ].map(([t, d]) => (
                <div key={t}>
                  <span className="nk-check">✓</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="nk-section nk-wrap nk-faq">
          <div>
            <p className="nk-eyebrow">WARTO WIEDZIEĆ</p>
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
                "Nie. To interaktywna symulacja przygotowanych scenariuszy. Pokazuje projekt obsługi i przykładowe podsumowania. Nie wykonuje połączeń ani nie wysyła danych.",
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
            <p className="nk-eyebrow">
              NOKTURN / ZAWSZE JEST SPOSÓB, BY ODPOWIEDZIEĆ
            </p>
            <h2>
              Ty zajmij się firmą.
              <br />
              <em>My zadbamy o pierwsze „dzień dobry”.</em>
            </h2>
            <a className="nk-button" href="#demo">
              Wypróbuj prezentację <span aria-hidden="true">↗</span>
            </a>
            <p className="nk-fine">
              Wersja demonstracyjna · bez logowania i podawania danych
            </p>
          </div>
        </section>
      </main>
      <footer className="nk-wrap nk-footer">
        <Logo />
        <span>Telefon i czat. Po Twojej stronie.</span>
        <span>© 2026 NOKTURN · Demo koncepcji</span>
      </footer>
    </div>
  );
}
