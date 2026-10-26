import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CONTACTS, EMAIL, WHATSAPP_URL } from "../data/contacts";
import { useInView } from "../hooks/useInView";

const FooterScene = lazy(() => import("../scene/FooterScene"));

const SOCIALS = CONTACTS.filter((c) => !c.url.startsWith("mailto:") && !c.url.startsWith("https://wa.me"));

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Footer() {
  const { t } = useTranslation();
  const [showTop, setShowTop] = useState(false);
  const [footRef, seen] = useInView(0.05);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer ref={footRef} className="site-footer">
      {seen && !reducedMotion() && (
        <div className="foot-scene" aria-hidden>
          <Suspense fallback={null}>
            <FooterScene />
          </Suspense>
        </div>
      )}

      <p className="foot-mark" aria-hidden>
        <span>andrés márquez</span>
      </p>

      <div className="foot-mid">
        <div className="foot-lede">
          <p>
            {t("contact_about")} <strong>{t("contact_lead")}</strong>
          </p>
          <div className="foot-contact">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">+58 412 929 8833</a>
            <span>{t("foot_where")}</span>
          </div>
        </div>
        <div className="foot-cta">
          <p>{t("menu_heading")}</p>
          <a className="foot-pill foot-pill--solid" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <i className="lab la-whatsapp" aria-hidden />
            {t("cta_wa")}
          </a>
          <a className="foot-pill" href={`mailto:${EMAIL}`}>
            <i className="lar la-envelope" aria-hidden />
            {t("hero_cta")}
          </a>
        </div>
      </div>

      <div className="foot-links">
        <ul>
          {SOCIALS.map(({ url, name }) => (
            <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{t(name)}</a></li>
          ))}
        </ul>
        <div className="foot-small">
          <span>© {new Date().getFullYear()} Andrés Márquez · {t("foot_rights")}</span>
          <span>{t("footer_built")}</span>
        </div>
      </div>

      <button
        type="button"
        className={`to-top ${showTop ? "is-visible" : ""}`}
        aria-label={t("foot_top")}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
