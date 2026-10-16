import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { PROCESS_STEPS } from "../data/content";
import SectionHeading from "./SectionHeading";

// The six phases of building software, as a compact grid: one screen on
// desktop, no sticky panel and no extra scroll while the ship keeps flying.
export default function Process() {
  const { t } = useTranslation();
  const ref = useJourneySection("process");

  return (
    <section ref={ref} id="process" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="lg:max-w-[70%]">
          <SectionHeading kicker={t("process_kicker")} title={t("process_title")} lead={t("process_lead")} />
          <ol className="mt-12 grid gap-3 md:grid-cols-2">
          {PROCESS_STEPS.map((n) => (
            <li key={n} className="rounded-2xl border border-fg/10 bg-surface/90 p-5 backdrop-blur-sm">
              <p className="font-mono text-[11px] tracking-[0.3em] text-accent">
                {String(n).padStart(2, "0")} / {String(PROCESS_STEPS.length).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">{t(`process_step${n}_title`)}</h3>
              <p className="mt-2 text-sm text-fg/75">{t(`process_step${n}_desc`)}</p>
              <p className="mt-3 border-t border-fg/10 pt-3 text-xs text-fg/55">
                <span className="text-signal">{t("proof")}</span> {t(`process_step${n}_proof`)}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
