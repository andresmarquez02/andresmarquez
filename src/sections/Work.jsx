import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import BrandsCarousel from "../components/BrandsCarousel";
import Experiences from "../components/Experiences";
import Projects from "../components/Projects";

export default function Work() {
  const { t } = useTranslation();
  const ref = useJourneySection("work");

  return (
    <section ref={ref} id="work" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{t("work_kicker")}</p>
        <div className="mt-6 rounded-3xl bg-bg/95 p-6 backdrop-blur-md md:p-10 lg:max-w-[70%]">
          <BrandsCarousel />
          <div className="mt-16">
            <Experiences />
          </div>
          <Projects />
        </div>
      </div>
    </section>
  );
}
