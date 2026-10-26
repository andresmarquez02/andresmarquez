import { useTranslation } from "react-i18next";
import Split from "../components/Split";
import Arrow from "../components/Arrow";
import { EMAIL, WHATSAPP_URL } from "../data/contacts";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="hcta" aria-labelledby="cta-title">
      <h2 id="cta-title" className="hcta-h" data-split>
        <span><Split text={t("cta_h_1")} /></span>
        <span><Split text={t("cta_h_2")} /></span>
        <span className="hx-accent"><Split text={t("cta_h_accent")} /></span>
      </h2>
      <div className="hcta-side" data-rise>
        <p>{t("contact_lead")}</p>
        <div className="hcta-links">
          <a className="hx-arrow-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            {t("cta_wa")}
            <Arrow />
          </a>
          <a className="hcta-tel" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>
    </section>
  );
}
