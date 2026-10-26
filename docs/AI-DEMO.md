# NOKTURN — agent demo

Czat tekstowy zaimplementowany, domyślnie wyłączony. Głos nadal jest przygotowaną symulacją.

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

Przed aktywacją uzupełnić dane administratora i politykę: wiadomości trafiają do OpenAI; store:false nie znosi retencji bezpieczeństwa dostawcy. Opisać Redis, HMAC adresu IP, retencję i cel limitowania. Obecne dokumenty robocze opisują symulację i wymagają aktualizacji. UI uprzedza o AI, fikcyjnych danych i wysyłce do OpenAI. Potwierdzenie zasad demo nie zastępuje określenia podstawy prawnej.

## Głos

Następny etap: Realtime przez WebRTC, osobny limit kosztów oraz serwerowe zakończenie sesji. Jeszcze niewdrożony. Timer w przeglądarce nie jest twardym ograniczeniem kosztu.
