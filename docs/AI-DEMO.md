# NOKTURN — agent demo

Czat tekstowy i demo głosowe zaimplementowane. Aktywne i przetestowane z dostawcą na chronionym podglądzie feature/ai-demo. Publiczna aktywacja wymaga uzupełnienia danych operatora oraz pozostałych testów opisanych poniżej. Przygotowane symulacje są odrębne.

Maja obsługuje fikcyjne firmy Czysty Kąt, Studio Forma i Prosty Bilans. Wiedza i zasady: src/lib/demo-agent.ts. GPT-5 mini przez Responses API, store:false, bez narzędzi i rzeczywistych działań. Treść renderowana jako tekst. Zmiana branży czyści kontekst.

## Konfiguracja Vercel

Sekrety serwerowe (bez NEXT_PUBLIC):
- OPENAI_API_KEY: klucz projektu OpenAI.
- UPSTASH_REDIS_REST_URL i UPSTASH_REDIS_REST_TOKEN: trwała baza Redis podłączona do projektu. Integracja Vercel może zamiast nich ustawić KV_REST_API_URL i KV_REST_API_TOKEN — te nazwy również są obsługiwane. Nie używać tokena READ_ONLY.
- DEMO_LIMIT_SECRET: losowy sekret minimum 32 znaki.
- DEMO_ENABLED=true: dopiero po konfiguracji i testach.

Nie zapisywać kluczy w Git ani czacie. Po zmianie konfiguracji wykonać ponowne wdrożenie.

## Limity

Redis jest wymagany; pamięć procesu nie chroni wielu instancji Vercel. Błąd konfiguracji lub bazy blokuje płatne zapytanie. Atomowy skrypt rezerwuje slot przed OpenAI: 10 prób na adres IP przez 24 h, jedno równoległe zapytanie i 100 prób łącznie na środowisko. Błędy dostawcy też zużywają slot. Globalna pula NIE odnawia się automatycznie. Limit prób nie jest gwarancją kosztu w USD.

Redis zawiera liczniki i HMAC adresu IP, bez surowego IP i rozmów. Wspólna sieć ma wspólny limit. Klucz globalny: nokturn:demo:v1:production:total. Preview ma osobną pulę. TTL odwiedzającego 86400 s, blokady 40 s. Timeout OpenAI 30 s, max 800 tokenów wyjścia wraz z rozumowaniem, 700 znaków pytania, 12000 znaków historii i 32000 bajtów request body. Nie kasować globalnego licznika bez świadomego odnowienia budżetu. Nie zmieniać modelu na droższy bez przeliczenia kosztów.

## Weryfikacja

node --test tests/demo-agent.test.cjs
npm run lint
npm run build

Testy używają atrap OpenAI, nie zużywają kredytów. Przed publiczną aktywacją: realna odpowiedź, odmowa prawdziwej rezerwacji, próba zmiany instrukcji, limit wielu instancji na Redis, test UI na telefonie.

## Publikacja i dane

Przed aktywacją uzupełnić dane administratora i politykę: wiadomości trafiają do OpenAI; store:false nie znosi retencji bezpieczeństwa dostawcy. Opisać Redis, HMAC adresu IP, retencję i cel limitowania. Obecne dokumenty robocze opisują także rzeczywisty czat i głos, ale wymagają danych operatora. UI uprzedza o AI, fikcyjnych danych i wysyłce do OpenAI. Potwierdzenie zasad demo nie zastępuje określenia podstawy prawnej.

## Głos

Rozmowa turami zaimplementowana — szczegóły w aktualizacji poniżej. Strumieniowy Realtime i połączenia telefoniczne nie są wdrożone.

## Aktualizacja 27.10.2026 — demo głosowe

Zaimplementowano /api/demo/voice i nagrywanie w AudioWorklet. Po kliknięciu użytkownik nagrywa 1–20 s; serwer przyjmuje wyłącznie kanoniczny WAV PCM16 mono 16 kHz i oblicza długość z rzeczywistych bajtów. JSON ograniczony do 900 KB. Przetwarzanie: gpt-transcribe → wspólne generateDemoAnswer (gpt-5-mini) → gpt-4o-mini-tts/coral. TTS czyta maksymalnie 1200 znaków; awaria TTS zwraca odpowiedź tekstową bez płatnego ponawiania. To rozmowa turami, nie połączenie PSTN ani strumieniowy Realtime.

VOICE_DEMO_ENABLED=true włącza głos dodatkowo do DEMO_ENABLED. Domyślnie wyłączony. Czat i głos współdzielą istniejące liczniki (bez resetowania puli). Blokada głosu 100 s, tekstu 40 s; zwalnianie porównuje losowy token właściciela, żeby spóźnione żądanie nie usuwało nowej blokady. Timeouty usług 20+30+20 s, funkcji 90 s. Klient nie zapisuje nagrań na dysku; anulowanie zamyka mikrofon, porzucenie komponentu również. Po limicie czasu nagranie jest automatycznie wysyłane, zgodnie z informacją w polityce.

Model gpt-4o-mini-tts jest oznaczony jako deprecated w katalogu OpenAI. Przed długoterminowym uruchomieniem należy potwierdzić datę wyłączenia i migrację generowania mowy. Dostępność transkrypcji i TTS potwierdzona rzeczywistym testem na kluczu projektu 27.10.2026.

Wyniki lokalne: 5 testów przechodzi (walidacja rozmów, błędy dostawcy, konfiguracja Marketplace, rzeczywista długość WAV, przepływ głosowy i fallback TTS), lint i build. Są to testy z atrapami, nie dowód jakości głosu ani połączenia produkcyjnego. Rzeczywiste testy dostawcy wykonano przez autoryzowany, czasowy dostęp do podglądu (wyniki poniżej). Nadal brak oceny odsłuchowej, testu fizycznego mikrofonu i testu mobilnego. Nie wyłączać Deployment Protection w celu testowania.

Polityka i regulamin rozszerzone o dane głosu, transkrypcję, OpenAI i Redis. Wciąż wymagają danych operatora, kontaktu oraz potwierdzenia retencji infrastruktury i warunków transferów. Nie oznaczać dokumentów jako finalnych przed uzupełnieniem.

Źródła sprawdzone 27.10.2026:
- https://developers.openai.com/api/docs/guides/speech-to-text
- https://developers.openai.com/api/docs/guides/text-to-speech
- https://developers.openai.com/api/docs/guides/your-data
- https://eur-lex.europa.eu/eli/reg/2016/679/oj

## Weryfikacja rzeczywista 27.10.2026

- Czat API: HTTP 200, poprawna cena czyszczenia kanapy od 180 zł i dojazd na Mokotów.
- Interfejs czatu: zgoda, wysłanie pytania i wyświetlenie odpowiedzi; Maja odmówiła potwierdzenia prawdziwej rezerwacji bez dostępu do kalendarza.
- Głos API: syntetyczny WAV z pytaniem o cenę kanapy → poprawna transkrypcja → odpowiedź po polsku → MP3 438528 bajtów, 27,408 s. To test serwera, nie fizycznego mikrofonu ani jakości odsłuchowej.
- Wykorzystano trzy rzeczywiste próby ze wspólnego licznika preview; pozostało 7 prób w testowanej puli odwiedzającego. Liczników nie resetowano.
- Flagi DEMO_ENABLED i VOICE_DEMO_ENABLED włączone wyłącznie dla feature/ai-demo. Produkcja pozostaje wyłączona.

28.10.2026: rozdzielono klasę głównego panelu głosu (nk-voice-demo) od istniejącej dekoracji nagłówka (nk-voice), usuwając dziedziczone zwężenie i obrót panelu.
