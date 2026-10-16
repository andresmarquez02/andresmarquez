import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { CONTACTS, WHATSAPP_URL } from "../data/contacts";
import SectionHeading from "./SectionHeading";

// Immersive: extra scroll room (sticky panel) while the ship's particles
// rebuild into the portrait on the right.
export default function Contact({ immersive }) {
  const { t } = useTranslation();
  const ref = useJourneySection("contact");

  return (
    <section ref={ref} id="contact" className={`relative ${immersive ? "h-[160vh]" : "py-28"}`}>
      <div className={`flex items-end pb-12 md:items-center md:pb-0 ${immersive ? "sticky top-0 h-[100dvh]" : ""}`}>
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-xl rounded-3xl bg-bg/70 p-5 backdrop-blur-sm md:p-6">
            <SectionHeading kicker={t("contact_kicker")} title={t("contact_title")} lead={t("contact_lead")} />
            <div className="mt-8 flex items-center gap-4">
              <img
                src="/images/andres.jpg"
                alt={t("photo_alt")}
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-full border border-fg/15 object-cover object-[50%_15%]"
              />
              <p className="text-sm text-fg/70 md:text-base">{t("contact_about")}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition glow-accent hover:bg-accent-glow"
              >
                <i className="lab la-whatsapp text-lg" aria-hidden />
                {t("contact_me")}
              </a>
              {CONTACTS.filter((c) => !c.url.startsWith("https://wa.me")).map(({ icon, url, name }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2.5 text-sm text-fg/80 transition hover:border-fg/30 hover:bg-fg/10 hover:text-fg"
                >
                  <i className={`${icon} text-base`} aria-hidden />
                  {t(name)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
