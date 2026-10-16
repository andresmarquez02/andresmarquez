import { useTranslation } from "react-i18next";
import { AI_CONTEXT, AI_SESSION } from "../data/content";

// A terminal showing how an AI session is run: real commands, real conventions.
// It replaces a generic row of "pillar" cards: it shows the method instead of listing it.
export default function AgentSession() {
  const { t } = useTranslation();

  return (
    <figure className="mt-10 overflow-hidden rounded-2xl border border-fg/15 bg-bg/80 shadow-[0_0_70px_-25px_rgba(252,211,77,0.35)]">
      <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-fg/20" />
        <span aria-hidden className="size-2.5 rounded-full bg-fg/20" />
        <span aria-hidden className="size-2.5 rounded-full bg-fg/20" />
        <figcaption className="ms-3 font-mono text-[11px] tracking-wide text-fg/40">~/erp — claude</figcaption>
      </div>
      <div className="space-y-4 p-4 font-mono text-[12.5px] leading-6 md:p-5 md:text-[13px]">
        <ol className="space-y-1.5">
          {AI_SESSION.map(({ cmd, note }) => (
            <li key={cmd} className="flex flex-wrap items-baseline gap-x-3">
              <span aria-hidden className="text-accent">
                ›
              </span>
              <span className="font-semibold text-fg">{cmd}</span>
              <span className="text-fg/45"># {t(note)}</span>
            </li>
          ))}
        </ol>
        <dl className="space-y-1.5 border-t border-dashed border-fg/15 pt-4">
          {AI_CONTEXT.map(({ label, text }) => (
            <div key={label} className="flex gap-x-3">
              <dt className="w-12 shrink-0 text-signal">{label}</dt>
              <dd className="text-fg/75">{t(text)}</dd>
            </div>
          ))}
        </dl>
        <p aria-hidden className="text-accent">
          ›<span className="ms-2 inline-block h-4 w-2 translate-y-0.5 bg-accent/80 motion-safe:animate-pulse" />
        </p>
      </div>
    </figure>
  );
}
