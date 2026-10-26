import { useTranslation } from "react-i18next";
import { WHATSAPP_URL } from "../data/contacts";
import Arrow from "../components/Arrow";

const PROOF_LOGOS = [
  { src: "/images/andres.jpg", photo: true },
  { src: "/images/chevrolet.png" },
  { src: "/images/gmc.png" },
  { src: "/images/ford.png" },
];

const STATS = [
  { value: "100+", label: "hero_stat1" },
  { value: "500+", label: "hero_stat2" },
  { value: "−40%", label: "hero_stat3" },
  { value: "+80%", label: "hero_stat4" },
];

// Splits a line into words so each can blur in with its own delay.
const Words = ({ text, start = 0 }) =>
  text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`} className="ko2-w" style={{ "--wi": start + i }}>
      {word}
      {" "}
    </span>
  ));

export default function Hero() {
  const { t } = useTranslation();
  const line1 = t("hero_h_1");
  const count = line1.split(" ").length;

  return (
    <section id="top" className="ko2-hero">
      <h1 className="ko2-h1">{t("hero_rail")}</h1>
      <div className="ko2-inner">
        <header className="ko2-head">
          <p className="ko2-headline" role="presentation">
            <span className="ko2-hline">
              <Words text={line1} />
            </span>
            <span className="ko2-hline ko2-hline-accent">
              <span className="ko2-w ko2-accent" style={{ "--wi": count }}>
                {t("hero_h_accent")}
              </span>
            </span>
          </p>
          <p className="ko2-lede">
            {t("hero_lede_a")} <strong>{t("hero_lede_b")}</strong>. {t("hero_lede_c")}
          </p>
          <ul className="hero-stats">
            {STATS.map(({ value, label }) => (
              <li key={label}>
                <b>{value}</b>
                <span>{t(label)}</span>
              </li>
            ))}
          </ul>
          <div className="ko2-actions">
            <a className="ko2-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {t("hero_cta")}
              <Arrow size={18} />
            </a>
            <div className="ko2-proof">
              <span className="avatar-stack" aria-hidden>
                {PROOF_LOGOS.map(({ src, photo }) => (
                  <span key={src} className={`avatar ${photo ? "photo" : ""}`}>
                    <img src={src} alt="" width="26" height="26" />
                  </span>
                ))}
              </span>
              <span className="ko2-score">
                <span className="pulse-dot" aria-hidden />
                {t("availability")}
              </span>
              <span className="ko2-proof-label">{t("hero_proof")}</span>
            </div>
          </div>
        </header>
      </div>
      <div className="ko2-markwrap" aria-hidden>
        <p className="ko2-mark">
          <span className="ko2-mark-word">andrés</span>
        </p>
      </div>
    </section>
  );
}
