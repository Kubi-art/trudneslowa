# NOKTURN — czat i rozmowa na żywo

## Stan 29.10.2026

Czat generuje rzeczywiste odpowiedzi. Panel głosowy zastąpiono WebRTC / OpenAI Realtime: mikrofon, automatyczne wykrywanie końca wypowiedzi, przerywanie odpowiedzi, wyciszenie, zakończenie, licznik i transkrypcja. Przygotowana symulacja pozostaje osobno oznaczona. Brak PSTN, połączeń telefonicznych, kalendarza i rzeczywistych zgłoszeń.

Modele: tekst `gpt-5-mini` (Responses, store:false), głos `gpt-realtime-2.1-mini`, głos syntetyczny `marin`, pomocnicza transkrypcja `gpt-transcribe` z językiem polskim. Nie trenujemy własnego modelu.

## Konfiguracja

Sekrety serwerowe: OPENAI_API_KEY, DEMO_LIMIT_SECRET (minimum 32 znaki), UPSTASH_REDIS_REST_URL/TOKEN albo KV_REST_API_URL/TOKEN z integracji Vercel. Nie używać tokena READ_ONLY. Nie ujawniać kluczy w Git, czacie ani przeglądarce.

- DEMO_ENABLED=true: aktywacja czatu i bazowej konfiguracji.
- REALTIME_DEMO_ENABLED=true: dodatkowo aktywuje rozmowę na żywo.
- VOICE_DEMO_ENABLED jest historyczne; stary POST /api/demo/voice zawsze zwraca 410 i nie wywołuje dostawcy.
- Flagi aktywowane wyłącznie na preview feature/ai-demo. Produkcja nie jest aktywowana.

Po zmianie konfiguracji wymagane nowe wdrożenie. Route /api/demo/realtime ma maxDuration=180; wymagane wsparcie Next after() na hostingu i czas funkcji wystarczający na zestawienie, 120 sekund nadzoru i zakończenie. Vercel utrzymuje after() przez waitUntil. Należy sprawdzić watchdog na rzeczywistym wdrożeniu przed publicznym startem.

## Ochrona kosztów

Czat: istniejąca pula 100 prób na środowisko, 10 pytań na sieć/24h, blokada jednego zapytania, 700 znaków pytania, 800 tokenów odpowiedzi łącznie z rozumowaniem. Starych liczników nie resetowano.

Głos: osobna, nieodnawiana automatycznie pula **10 sesji na środowisko**, jedna próba na sieć/24h. Rezerwacja w atomowym Lua przed utworzeniem płatnej sesji. Nieudane zestawienie po rezerwacji także zużywa próbę. Klucze nokturn:realtime:v1:{preview|production}:total, visitor:{HMAC}, paused. Bez surowego IP ani rozmów w Redis.

Serwer tworzy jedną sesję z SDP i stałą konfiguracją — nie wydaje klientowi klucza API ani tokena do tworzenia dodatkowych sesji. Przed przekazaniem odpowiedzi SDP podłącza własny kanał kontrolny WebSocket. Nadzorca zamyka połączenie po 120 sekundach od utworzenia sesji, przy utracie kanału kontrolnego, zmianie konfiguracji, błędzie dostawcy, próbie 13. odpowiedzi albo po 12000 łącznych rozliczonych tokenów raportowanych w response.done. Odpowiedź modelu ma limit 500 tokenów, historia po instrukcjach 4000. Limity użycia mogą zakończyć demo przed 2 minutami. Limit czasu obejmuje negocjację połączenia.

Zakończenie w UI zatrzymuje wszystkie ścieżki mikrofonu, odtwarzacz, data channel i WebRTC, oraz wywołuje serwerowe hangup podpisanym, krótkotrwałym tokenem ograniczonym do jednej rozmowy. Anulowanie oczekującej zgody na mikrofon zatrzymuje także ścieżki przyznane później. Opuszczenie strony wykonuje ten sam cleanup. Serwer działa niezależnie od timera przeglądarki.

Hangup jest ponawiany do 3 razy; brak potwierdzenia włącza blokadę nowych sesji w Redis. Awaria procesu hostingowego lub dostawcy może uniemożliwić wykonanie watchdog/hangup. Nie jest to gwarantowany limit wydatków w USD. Licznik tokenów jest reaktywny, więc ostatnia odpowiedź może przekroczyć próg. Ustawić również limit wydatków w projekcie dostawcy; nie zwiększać puli bez pomiaru usage. Brak automatycznych ponowień płatnego tworzenia sesji.

## Dane i instrukcje

Wspólne fikcyjne firmy i zasady w src/lib/demo-agent.ts. Maja nie potwierdza rzeczywistych rezerwacji i nie prosi o dane osobowe. Treść wyświetlana jako tekst. Serwer nadzorujący otrzymuje zdarzenia sesji, ale nie zapisuje transkrypcji ani nagrań. Loguje wyłącznie techniczny powód zakończenia i zbiorcze liczby odpowiedzi/tokenów. WebRTC wysyła audio bezpośrednio do OpenAI. Transkrypcja jest pomocnicza i może różnić się od tego, co usłyszał model.

Przed publiczną aktywacją uzupełnić dane operatora, kontakt, retencję infrastruktury oraz warunki przetwarzania i transferów. Dokumenty opisują nowy przepływ, ale nadal są robocze. store:false dotyczy czatu Responses, nie stanowi obietnicy braku retencji bezpieczeństwa u dostawcy ani ustawienia sesji Realtime.

## Weryfikacja

Polecenia: `node --test tests/*.test.cjs`, `npm run lint`, `npm run build`.

27.10: rzeczywisty czat API odpowiedział poprawnie o cenie i dojeździe. UI poprawnie odmówiło prawdziwej rezerwacji. Historyczny pipeline WAV → transkrypcja → tekst → MP3 zwrócił poprawną odpowiedź i MP3 27,408 s. Nie dowodzi to działania nowego WebRTC.

29.10: 9 testów lokalnych przechodzi, w tym kontrola podpisów zakończenia, odrzucenie nieprawidłowego origin/body/branży, brak płatnego wywołania przed limitem, niezależne zamknięcie przez serwer, zmiana konfiguracji, próg tokenów, blokada po niepotwierdzonym hangup i anulowanie zgody na mikrofon. Build i TypeScript przechodzą. Rzeczywisty test nowego WebRTC, jakości odsłuchu i telefonu musi zostać udokumentowany oddzielnie — nie oznaczać go jako wykonany na podstawie atrap.

Źródła integracji sprawdzone 29.10.2026:
- https://developers.openai.com/api/docs/guides/voice-webrtc
- https://developers.openai.com/api/docs/guides/voice-server-controls
- https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create
- https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup
- node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md

### Diagnostyka podglądu

W teście 29.10 zestawienie sesji zwróciło 502; nie potwierdzono jeszcze rozmowy Realtime. Przeglądarka testowa nie ma mikrofonu. Dodano diagnostykę etapu i kodu błędu bez treści użytkownika oraz uzbrojenie watchdog na zdarzeniu WebSocket open (bez czekania na media peer).

Operator może jednorazowo odblokować wyłącznie preview, ustawiając nową wartość REALTIME_RECOVERY_ID. Atomowy skrypt zapisuje wykorzystany identyfikator i usuwa wyłącznie klucz paused — nigdy liczniki total/visitor. Ta sama wartość nie działa ponownie, a produkcja ignoruje to ustawienie. Używać dopiero po sprawdzeniu przyczyny i upewnieniu się, że poprzednia sesja już nie działa.

### Live verification 2026-10-29
Preview real WebRTC synthetic-audio test reached the model: server recorded two responses (2710 total tokens) and a time_limit shutdown after 120 seconds. Client-side audio/transcript log was not recovered before the ephemeral sandbox expired, so audible playback quality is NOT yet verified. A subsequent browser stop attempted a second hangup and paused the pool. Shared 10-minute successful-hangup confirmations now make repeated stops idempotent; regression tested across separate module instances. The preview remains paused pending a controlled follow-up test. Production AI remains disabled.

Follow-up on bb75d36 PASSED: real WebRTC connected in 1.6 seconds, synthetic spoken question was transcribed, model answered the fictional offer correctly, client received 5989 audio frames (1099 non-silent), server closed channel at 121.4 seconds including setup, repeated signed stop returned HTTP 200. Sandbox explicitly stopped. Preview pool is available again, original counters preserved. Tightened the greeting to a fixed brief Polish introduction and replies to 35 words, with an 800-token ceiling to reduce cutoff risk; this prompt refinement has not had another billed test. Actual user microphone/mobile acoustic quality remains unverified.
