import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { useJourneySection } from "../hooks/useJourneySection";
import { WHATSAPP_URL } from "../data/contacts";

const LINES = ["hero_line1", "hero_line2", "hero_line3"];
const PILLS = [1, 2, 3, 4, 5];

export default function Hero() {
  const { t } = useTranslation();
  const ref = useJourneySection("hero", undefined, { start: "top top" });

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-hero-line]", { yPercent: 105, duration: 1, stagger: 0.08 })
          .from("[data-hero-fade]", { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.06 }, 0.3);
      },
      ref
    );
    return () => mm.revert();
  }, [ref]);

  return (
    <section ref={ref} id="hero" className="relative flex min-h-[100dvh] items-end pb-20 md:items-center md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 pt-28">
        {/* Text in the left ~65% of the screen; the rocket owns the right-hand column. */}
        <div className="lg:max-w-[70%]">
          <p data-hero-fade className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {t("availability")}
          </p>
          <p data-hero-fade className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/50">
            {t("hero_kicker")}
          </p>
          <h1
            className="mt-8 font-display font-bold leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.75rem, 8vw, 7.25rem)" }}
          >
            {LINES.map((key, i) => (
              <span key={key} className="block overflow-hidden pb-[0.06em]">
                <span
                  data-hero-line
                  className={`block ${
                    i === LINES.length - 1
                      ? "bg-gradient-to-r from-accent to-signal bg-clip-text text-transparent"
                      : "text-fg"
                  }`}
                >
                  {t(key)}
                </span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mt-8 max-w-xl text-pretty text-base text-fg/75 md:text-lg">
            {t("hero_lead")}
          </p>
          <ul data-hero-fade className="mt-6 flex max-w-xl flex-wrap gap-2">
            {PILLS.map((n) => (
              <li
                key={n}
                className="rounded-full border border-fg/15 bg-bg/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-fg/70"
              >
                {t(`hero_pill${n}`)}
              </li>
            ))}
          </ul>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition glow-accent hover:bg-accent-glow"
            >
              <i className="lab la-whatsapp text-lg" aria-hidden />
              {t("contact_me")}
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg/60 transition hover:text-fg"
            >
              {t("hero_scroll")}
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
