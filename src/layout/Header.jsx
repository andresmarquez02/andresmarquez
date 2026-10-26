import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import { CONTACTS, EMAIL, WHATSAPP_URL } from "../data/contacts";

const NAV = [
  { href: "#services", label: "nav_services" },
  { href: "#process", label: "nav_process" },
  { href: "#work", label: "nav_work" },
  { href: "#experience", label: "nav_experience" },
  { href: "#contact", label: "nav_contact" },
];

const SOCIALS = CONTACTS.filter((c) => !c.url.startsWith("mailto:") && !c.url.startsWith("https://wa.me"));

const Sun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function Header() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  const close = () => setOpen(false);
  const otherLang = language === "en" ? "es" : "en";

  return (
    <>
      <a className="skip-link" href="#main">{t("skip")}</a>
      <header className={`site-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-header">
          <a href="#top" className="site-logo" aria-label={t("nav_home")}>
            am<span>.</span>
          </a>
          <nav className="site-nav-center" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">{t(item.label)}</a>
            ))}
          </nav>
          <div className="site-nav-actions">
            <button type="button" className="icon-btn" onClick={() => changeLanguage(otherLang)} aria-label={`Language: ${otherLang}`}>
              {otherLang}
            </button>
            <button type="button" className="icon-btn" onClick={toggle} aria-label={theme === "dark" ? t("theme_light") : t("theme_dark")}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <button type="button" className="hamburger" aria-label={t("menu_open")} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
              <span className="hamburger-bar hamburger-bar-1" />
              <span className="hamburger-bar hamburger-bar-2" />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu-backdrop ${open ? "is-open" : ""}`} onClick={close} aria-hidden />
      <aside id="site-menu" className={`menu-drawer ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" inert={!open}>
        <button type="button" className="menu-close" aria-label={t("menu_close")} onClick={close}>
          <span />
          <span />
        </button>
        <div className="menu-scroll" data-lenis-prevent>
          <nav aria-label={t("menu_pages")}>
            <ul className="menu-nav-list">
              <li><a className="menu-nav-link" href="#top" onClick={close}>{t("nav_home")}</a></li>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a className="menu-nav-link" href={item.href} onClick={close}>{t(item.label)}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="menu-heading">{t("menu_heading")}</p>
          <p className="menu-lede">{t("menu_lede")}</p>
          <div className="menu-actions">
            <a className="menu-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <i className="lab la-whatsapp" aria-hidden />
              {t("cta_wa")}
            </a>
            <a className="menu-btn menu-btn--ghost" href={`mailto:${EMAIL}`}>
              <i className="lar la-envelope" aria-hidden />
              {t("hero_cta")}
            </a>
          </div>
          <div>
            <p className="menu-eyebrow">{t("menu_direct")}</p>
            <ul className="menu-direct">
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">+58 412 929 8833</a></li>
            </ul>
          </div>
          <div>
            <p className="menu-eyebrow">{t("menu_social")}</p>
            <ul className="menu-socials">
              {SOCIALS.map(({ url, name }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {t(name)}
                    <span aria-hidden>→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="menu-footnote">© {new Date().getFullYear()} Andrés Márquez</p>
        </div>
      </aside>
    </>
  );
}
