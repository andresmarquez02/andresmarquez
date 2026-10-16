import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { STACK_GROUPS } from "../data/content";
import SectionHeading from "./SectionHeading";

export default function Stack() {
  const { t } = useTranslation();
  const ref = useJourneySection("stack");

  return (
    <section ref={ref} id="stack" className="relative py-12 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-bg/80 p-5 backdrop-blur-sm md:p-6 lg:max-w-[70%]">
          <SectionHeading kicker={t("stack_kicker")} title={t("stack_title")} lead={t("stack_lead")} />
          <dl className="mt-10 space-y-6">
            {STACK_GROUPS.map((group) => (
              <div key={group.key} className="border-t border-fg/10 pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg/50">{t(group.key)}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-fg/5 px-2.5 py-1 text-xs text-fg/85">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
