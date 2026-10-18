import Link from "next/link";
import {
  ArrowsLeftRight,
  ChatCircleText,
  EnvelopeSimple,
  MapPinArea,
  PhoneX,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import { site } from "@/lib/site";
import { PhoneCall } from "@/components/phone-call";
import { Calculator } from "@/components/calculator";
import { NightCity } from "@/components/night-city";
import { AmberGlow } from "@/components/ui/amber-glow";
import { TextReveal } from "@/components/ui/text-reveal";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { images } from "@/lib/images";

function StepImage({ src, alt, children }: { src: string; alt: string; children?: React.ReactNode }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      {children && <div className="absolute inset-x-5 bottom-5">{children}</div>}
    </div>
  );
}

const steps = [
  {
    title: "1. Rozmawiamy 15 minut",
    description: "Mówisz, czym się zajmujesz, gdzie jeździsz, ile bierzesz za dojazd i o co pytać klienta. Resztę ustawiamy my.",
    content: (
      <StepImage src={images.tradesmanCall} alt="Fachowiec rozmawia przez telefon przy swoim busie">
        <div className="flex flex-col gap-2 text-[14px] leading-snug">
          <p className="max-w-[80%] self-start rounded-2xl bg-[#2c2c2e] px-3.5 py-2.5 text-parchment">Ile bierzesz za dojazd w nocy i do jakich miejscowości jeździsz?</p>
          <p className="max-w-[80%] self-end rounded-2xl bg-amber px-3.5 py-2.5 text-ink">150 zł, Nowy Dwór i 25 km dookoła.</p>
        </div>
      </StepImage>
    ),
  },
  {
    title: "2. Włączasz przekierowanie",
    description: "Numer zostaje Twój. Wpisujesz jeden kod w telefonie: gdy nie odbierasz, rozmowę przejmuje NOKTURN. Działa w każdej sieci.",
    content: (
      <StepImage src={images.dialing} alt="Dłonie wpisujące kod na klawiaturze telefonu">
        <code className="block rounded-2xl bg-[#0b0b0d]/90 px-4 py-3 text-center font-mono text-[17px] tracking-wide text-parchment">
          **61*<span className="text-amber">numer NOKTURNA</span>#
        </code>
      </StepImage>
    ),
  },
  {
    title: "3. Dostajesz SMS-y",
    description: "Co się stało, gdzie i jak pilne. Telefon budzi Cię tylko wtedy, gdy naprawdę trzeba. Oddzwaniasz, kiedy możesz.",
    content: (
      <StepImage src={images.bedsideSms} alt="Telefon na szafce nocnej wyświetla powiadomienie">
        <div className="rounded-2xl bg-[#f2f2f4] px-3.5 py-3 text-[14px] leading-snug text-ink shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <strong className="font-semibold">Pilne:</strong> zatrzaśnięte drzwi, Kwiatowa 9, klient czeka na klatce.
        </div>
      </StepImage>
    ),
  },
];

const pill =
  "inline-flex min-h-12 items-center rounded-full px-[26px] font-semibold transition-transform duration-200 ease-apple active:scale-95";
const h2 =
  "text-balance text-[clamp(32px,4.4vw,56px)] font-semibold leading-[1.07] tracking-[-0.03em]";
const wrap = "mx-auto max-w-[1080px] px-5";

const missedCalls = [
  ["Nieznany", "komórka", "3:14"],
  ["Nieznany", "komórka", "3:16"],
  ["+48 512 ••• •••", "komórka", "6:52"],
  ["Nieznany", "komórka", "7:05"],
];

const withoutUs = [
  ["3:14", "Telefon dzwoni w kurtce na krześle. Śpisz."],
  ["3:15", "Klient nie zostawia wiadomości."],
  ["3:16", "Dzwoni do następnej firmy z Google. Ta odbiera."],
  ["7:40", "Widzisz nieodebrane połączenie. Oddzwaniasz, ale jest po wszystkim."],
];
const withUs = [
  ["3:14", "NOKTURN odbiera po pierwszym sygnale."],
  ["3:15", "Klient zakręca zawór i podaje adres."],
  ["3:15", "Twój telefon budzi SMS z opisem awarii."],
  ["3:20", "Oddzwaniasz i potwierdzasz przyjazd."],
];

const features = [
  { Icon: ChatCircleText, title: "Rozmawia po polsku", text: "Naturalnie i spokojnie, bez menu „wciśnij 1”. Rozumie też zdenerwowanego klienta.", span: "lg:col-span-2" },
  { Icon: WarningCircle, title: "Odróżnia pilne od zwykłych", text: "Zalanie oznacza jako pilne. Wymianę baterii w przyszłym tygodniu po prostu zapisuje.", span: "" },
  { Icon: UsersThree, title: "Kilka rozmów naraz", text: "Gdy po burzy dzwoni pięć osób, każda słyszy odpowiedź, a nie sygnał zajętości.", span: "" },
  { Icon: MapPinArea, title: "Zna Twoje ceny i rejon", text: "Mówi tylko to, co mu przekażesz: koszt dojazdu, godziny, miejscowości.", span: "" },
  { Icon: ArrowsLeftRight, title: "Przełącza do Ciebie", text: "Gdy klient chce rozmawiać z człowiekiem, a Ty możesz odebrać, łączy rozmowę.", span: "" },
  { Icon: EnvelopeSimple, title: "Zapis każdej rozmowy", text: "Poza SMS-em dostajesz mailem pełny zapis, więc wiesz dokładnie, co klient powiedział.", span: "lg:col-span-2" },
];

const faq = [
  ["Czy klient wie, że rozmawia z AI?", "Tak. Asystent mówi o tym na początku i informuje o nagrywaniu, bo tego wymaga prawo."],
  ["Czy muszę zmieniać numer?", "Nie. Włączasz przekierowanie, gdy nie odbierasz. Jak odbierzesz sam, nic się nie zmienia."],
  ["Co, jeśli czegoś nie zrozumie?", "Zapisze numer i to, co usłyszał, a w SMS-ie dopisze, żeby oddzwonić."],
  ["Mogę zrezygnować?", "Tak, z miesięcznym wypowiedzeniem. Wyłączasz przekierowanie i gotowe."],
];

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />

      <header className="sticky top-0 z-40 bg-black/75 backdrop-blur-xl backdrop-saturate-150">
        <nav aria-label="Główna" className="mx-auto flex h-12 max-w-[1080px] items-center justify-between gap-4 px-5">
          <Link href="/" className="text-[15px] font-semibold tracking-[0.08em] text-parchment">
            NOKTURN
          </Link>
          <div className="flex items-center gap-5 text-[13px]">
            <a href="#jak" className="hidden text-[#d2d2d7] hover:text-white sm:inline">Jak działa</a>
            <a href="#kalkulator" className="hidden text-[#d2d2d7] hover:text-white sm:inline">Kalkulator</a>
            <a href="#cennik" className="hidden text-[#d2d2d7] hover:text-white sm:inline">Cennik</a>
            <a href={site.calendlyUrl} className="inline-flex min-h-[30px] items-center rounded-full bg-amber px-3.5 font-semibold text-ink transition-transform active:scale-95">
              Umów rozmowę
            </a>
          </div>
        </nav>
      </header>

      <main id="tresc">
        {/* HERO: noc nad osiedlem, jedno światło, telefon */}
        <section className="relative overflow-hidden bg-[#09090b] text-parchment">
          <AmberGlow />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-90">
            <NightCity density={0.045} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent" />

          <div className={`${wrap} relative grid items-center gap-14 pb-24 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-32 lg:pt-28`}>
            <div className="text-center lg:text-left">
              <p className="mb-3 text-[19px] font-semibold text-amber">Pogotowie, ślusarz, laweta. Całą dobę.</p>
              <TextReveal
                as="h1"
                startOnView={false}
                text="Odbiera, kiedy Ty nie możesz."
                className="text-balance text-[clamp(46px,7vw,84px)] font-semibold leading-[1.02] tracking-[-0.04em]"
              />
              <p className="mx-auto mt-6 max-w-[30ch] text-[clamp(20px,2.2vw,24px)] leading-[1.35] text-muted-dark lg:mx-0">
                Klient dzwoni o 3 w nocy. Po minucie masz SMS z adresem i opisem awarii.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3.5 lg:justify-start">
                <a href={`tel:${site.demoPhone}`} className={`${pill} bg-amber text-ink`}>Zadzwoń do demo</a>
                <a href="#jak" className="text-[19px] text-amber hover:underline">Zobacz, jak to działa ›</a>
              </div>
            </div>
            <div className="relative">
              <PhoneCall />
            </div>
          </div>
        </section>

        {/* ZDJĘCIE: rośnie na cały ekran przy przewijaniu */}
        <ScrollExpandMedia
          mediaType="video"
          mediaSrc={images.plumberVideo}
          posterSrc={images.plumberPoster}
          bgImageSrc={images.nightBlocks}
          alt="Hydraulik pod zlewem, obok na podłodze dzwoni telefon"
          title="Ty pracujesz. My odbieramy."
          date="Telefon dzwoni, a Ty masz ręce pod zlewem."
          scrollToExpand="Przewiń w dół"
          textBlend
        />

        {/* NIEODEBRANE: statystyka + lista jak w telefonie */}
        <section className="bg-parchment py-28">
          <div className={`${wrap} grid items-center gap-14 md:grid-cols-2`}>
            <div>
              <p className="text-[clamp(96px,14vw,184px)] font-semibold leading-[0.9] tracking-[-0.05em]">34%</p>
              <TextReveal
                as="h2"
                text="firm w Polsce nie odebrało telefonu od klienta."
                className={`${h2} mt-5 max-w-[18ch] text-[clamp(28px,3.2vw,40px)]`}
              />
              <p className="mt-4 max-w-[40ch] text-[19px] text-muted">
                Klient w awarii nie zostawia wiadomości. Dzwoni do następnej firmy z listy.
              </p>
              <p className="mt-6 text-xs text-[#86868b]">Źródło: raport Fachowcy.pl Ventures, badanie 400 firm.</p>
            </div>

            <div className="mx-auto w-full max-w-[420px] rounded-[28px] bg-white p-2 shadow-[0_30px_60px_-30px_rgba(29,29,31,0.35)]">
              <div className="rounded-[22px] bg-white px-5 pb-4 pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-[28px] font-semibold tracking-[-0.03em]">Ostatnie</p>
                  <p className="text-[15px] font-semibold text-[#ff3b30]">Nieodebrane</p>
                </div>
                <ul className="mt-3 divide-y divide-hairline">
                  {missedCalls.map(([who, kind, time]) => (
                    <li key={time} className="flex items-center gap-3 py-3">
                      <PhoneX size={20} weight="fill" className="shrink-0 text-[#ff3b30]" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#ff3b30]">{who}</p>
                        <p className="text-[13px] text-muted">{kind}</p>
                      </div>
                      <span className="tabular-nums text-[15px] text-muted">{time}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-center text-[13px] text-muted">Tak wygląda telefon fachowca rano. Każda pozycja to klient, który zadzwonił gdzie indziej.</p>
              </div>
            </div>
          </div>
        </section>

        {/* KALKULATOR */}
        <section id="kalkulator" className="dot-grid scroll-mt-12 bg-white py-28">
          <div className={wrap}>
            <h2 className={`${h2} mx-auto max-w-[20ch] text-center`}>Policz, ile tracisz.</h2>
            <p className="mx-auto mb-14 mt-3.5 max-w-[36ch] text-center text-[21px] text-muted">Przesuń suwaki, żeby zobaczyć swoje liczby.</p>
            <Calculator />
          </div>
        </section>

        {/* JAK DZIAŁA: kroki z przypiętym zdjęciem */}
        <section id="jak" className="scroll-mt-12 bg-graphite text-parchment">
          <div className="mx-auto max-w-[1080px] px-5 pt-28">
            <h2 className={`${h2} mx-auto max-w-[18ch] text-center`}>Działa w tydzień. Ty nic nie ustawiasz.</h2>
          </div>
          <StickyScroll content={steps} />
          <div className="h-20" />
        </section>

        {/* PORÓWNANIE */}
        <section className="bg-parchment py-28">
          <div className={wrap}>
            <h2 className={`${h2} mx-auto max-w-[18ch] text-center`}>Ta sama noc. Dwa zakończenia.</h2>
            <p className="mx-auto mb-14 mt-3.5 max-w-[34ch] text-center text-[21px] text-muted">Klient dzwoni o 3:14, bo zalało mu łazienkę.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-6 rounded-[22px] bg-white px-8 py-9">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-muted">Bez NOKTURNA</h3>
                <ol className="flex flex-col gap-[18px]">
                  {withoutUs.map(([t, s]) => (
                    <li key={t + s} className="grid grid-cols-[56px_1fr] gap-3">
                      <span className="font-semibold tabular-nums text-[#86868b]">{t}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-auto border-t border-hairline pt-5 font-semibold">Zlecenie u konkurencji.</p>
              </div>
              <div className="relative flex flex-col gap-6 overflow-hidden rounded-[22px] bg-[#09090b] px-8 py-9 text-parchment">
                <AmberGlow className="opacity-40" />
                <h3 className="relative text-2xl font-semibold tracking-[-0.02em] text-amber">Z NOKTURNEM</h3>
                <ol className="relative flex flex-col gap-[18px]">
                  {withUs.map(([t, s]) => (
                    <li key={t + s} className="grid grid-cols-[56px_1fr] gap-3">
                      <span className="font-semibold tabular-nums text-amber">{t}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <p className="relative mt-auto border-t border-[#3a3a3c] pt-5 font-semibold">Zlecenie Twoje.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FUNKCJE */}
        <section className="relative overflow-hidden bg-black py-28 text-parchment">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,165,36,0.16),transparent_70%)]" aria-hidden="true" />
          <div className={`${wrap} relative`}>
            <h2 className={`${h2} mx-auto mb-16 max-w-[20ch] text-center`}>Co robi przy telefonie.</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ Icon, title, text, span }) => (
                <div key={title} className={`flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-7 ${span}`}>
                  <Icon size={34} weight="light" className="text-amber" aria-hidden="true" />
                  <h3 className="text-[21px] font-semibold">{title}</h3>
                  <p className="text-muted-dark">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CENNIK */}
        <section id="cennik" className="scroll-mt-12 bg-white py-28 text-center">
          <div className={wrap}>
            <h2 className={`${h2} mx-auto max-w-[18ch]`}>Jedna cena. Wszystko po naszej stronie.</h2>
            <div className="mx-auto mt-12 max-w-[760px] rounded-[30px] bg-parchment px-6 py-12 sm:px-12">
              <p className="text-[21px] font-semibold">NOKTURN 24/7</p>
              <p className="mt-1.5 text-[clamp(56px,7vw,80px)] font-semibold leading-[1.05] tracking-[-0.04em]">{site.priceMonthly} zł</p>
              <p className="mt-1.5 text-muted">miesięcznie netto. Wdrożenie {site.priceSetup} zł.</p>
              <ul className="mt-10 grid gap-6 text-left sm:grid-cols-2">
                {[
                  ["Całą dobę", "także w weekendy i święta"],
                  ["SMS po każdej rozmowie", "w kilka sekund od rozłączenia"],
                  ["Pod Twoją branżę", "zmiany i poprawki bez dopłat"],
                  ["Bez umowy na lata", "miesiąc wypowiedzenia"],
                ].map(([a, b]) => (
                  <li key={a} className="flex flex-col gap-1 border-t border-hairline pt-4">
                    <strong className="font-semibold">{a}</strong>
                    <span className="text-muted">{b}</span>
                  </li>
                ))}
              </ul>
              <a href={site.calendlyUrl} className={`${pill} mt-11 bg-ink text-parchment`}>Umów rozmowę</a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-parchment py-28">
          <div className={wrap}>
            <h2 className={`${h2} mb-14 text-center`}>Pytania i odpowiedzi</h2>
            <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
              {faq.map(([q, a]) => (
                <div key={q} className="border-t border-[#d2d2d7] pt-6">
                  <h3 className="mb-2 text-[21px] font-semibold">{q}</h3>
                  <p className="text-muted">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAŁ: znowu noc nad osiedlem */}
        <section id="kontakt" className="relative overflow-hidden bg-[#09090b] pb-48 pt-32 text-center text-parchment">
          <AmberGlow />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]">
            <NightCity density={0.06} />
          </div>
          <div className={`${wrap} relative`}>
            <TextReveal
              as="h2"
              text="Następny nocny telefon może być do Ciebie."
              className={`${h2} mx-auto max-w-[16ch] text-[clamp(36px,5.4vw,64px)] leading-[1.05]`}
            />
            <p className="mx-auto mt-[18px] max-w-[36ch] text-[21px] text-muted-dark">15 minut rozmowy. Pokażemy to na Twoim przykładzie.</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3.5">
              <a href={site.calendlyUrl} className={`${pill} bg-amber text-ink`}>Umów rozmowę</a>
              <a href={`tel:${site.demoPhone}`} className="text-[19px] text-amber hover:underline">Zadzwoń do demo ›</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-parchment px-5 pb-10 pt-6 text-xs leading-relaxed text-muted">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-3">
          <p className="border-b border-[#d2d2d7] pb-3">
            Rozmowy prowadzi wirtualny asystent. Klient jest o tym informowany na początku połączenia.
          </p>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
            <span>Copyright 2026 NOKTURN. {site.company}, NIP {site.nip}.</span>
            <nav aria-label="Informacje prawne" className="flex flex-wrap gap-x-5 gap-y-2 text-[#424245]">
              <Link href="/polityka-prywatnosci" className="hover:underline">Polityka prywatności</Link>
              <Link href="/regulamin" className="hover:underline">Regulamin</Link>
              <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
