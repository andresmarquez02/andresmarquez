import { useTranslation } from "react-i18next";

export default function Experience({ experience }) {
  const { t } = useTranslation();

  return (
    <li data-exp-item className="relative mb-12 ps-8">
      <span
        aria-hidden
        className="absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(252,211,77,0.15)]"
      />
      <time className="font-mono text-xs uppercase tracking-widest text-accent/80">
        {t(experience.date)}
      </time>
      <h3 className="mt-2 font-display text-lg font-semibold text-fg md:text-xl">
        {t(experience.title)}
      </h3>
      <p className="mt-2 max-w-3xl text-pretty text-sm leading-relaxed text-fg/70 md:text-base">
        {t(experience.description)}
      </p>
    </li>
  );
}
