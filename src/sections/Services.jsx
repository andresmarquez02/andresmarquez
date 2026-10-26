import { useTranslation } from "react-i18next";
import Split from "../components/Split";
import Arrow from "../components/Arrow";
import { GraphicCode, GraphicN8n, GraphicTerminal, GraphicTests } from "../components/ServiceGraphics";
import { WHATSAPP_URL } from "../data/contacts";

const ITEMS = [
  { id: "a", Graphic: GraphicCode, href: "#work" },
  { id: "b", Graphic: GraphicN8n, href: "#work" },
  { id: "c", Graphic: GraphicTerminal, href: "#process" },
  { id: "d", Graphic: GraphicTests, href: "#work" },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="svc2" aria-labelledby="svc-title">
      <div className="svc2-grid">
        <div className="svc2-left">
          <h2 id="svc-title" className="svc2-heading" data-split>
            <span><Split text={t("svc_h_1")} /></span>
            <span className="hx-accent"><Split text={t("svc_h_accent")} /></span>
          </h2>
          <div className="svc2-left-foot">
            <p className="svc2-note">{t("svc_note")}</p>
            <a className="hx-arrow-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {t("svc_cta")}
              <Arrow />
            </a>
          </div>
        </div>
        <ol className="svc2-items">
          {ITEMS.map(({ id, Graphic, href }) => (
            <li key={id} className="svc2-item" data-rise>
              <span className="svc2-index" aria-hidden>{id.toUpperCase()}/</span>
              <div className="svc2-content">
                <h3 className="svc2-title">{t(`svc_${id}_title`)}</h3>
                <p className="svc2-statement">{t(`svc_${id}_text`)}</p>
                <div className="svc2-graphic"><Graphic t={t} /></div>
                <ul className="svc2-tags">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="svc2-tag">{t(`svc_${id}_t${n}`)}</li>
                  ))}
                </ul>
                <a className="svc2-more" href={href}>
                  {t("svc_more")}
                  <span aria-hidden>→</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
