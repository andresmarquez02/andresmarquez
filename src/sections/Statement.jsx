import { useTranslation } from "react-i18next";
import Split from "../components/Split";

const Marquee = ({ text, tone, from, to }) => {
  const seg = text.repeat(4);
  return (
    <div className={`mqv-line mqv-line-${tone}`}>
      <div className="mqv-track" data-slide data-from={from} data-to={to}>
        <span className="mqv-seg">{seg}</span>
        <span className="mqv-seg" aria-hidden>{seg}</span>
      </div>
    </div>
  );
};

export default function Statement() {
  const { t } = useTranslation();

  return (
    <>
      <section className="jt" aria-labelledby="statement-title">
        <div className="st-wrap">
          <h2 id="statement-title" className="st-title" data-split>
            <Split text={`${t("st_h_1")} ${t("st_h_2")}`} /> <span className="hx-accent"><Split text={t("st_h_accent")} /></span>
          </h2>
          <div className="st-copy">
            <p data-rise>{t("st_p1")}</p>
            <p data-rise>{t("st_p2")}</p>
          </div>
        </div>
      </section>
      <section className="mqv" aria-hidden>
        <div className="mqv-lines">
          <Marquee text={t("mq_1")} tone="ink" from={0} to={-28} />
          <Marquee text={t("mq_2")} tone="dim" from={-28} to={0} />
        </div>
        <div className="mqv-media">
          <div className="mqv-shot" data-i="0">
            <img src="/images/andres-image1.jpeg" alt="" loading="lazy" decoding="async" width="1219" height="1290" style={{ objectPosition: "50% 20%" }} />
          </div>
          <div className="mqv-shot" data-i="1">
            <img src="/images/andres-image2.jpeg" alt="" loading="lazy" decoding="async" width="594" height="949" style={{ objectPosition: "50% 45%" }} />
          </div>
        </div>
      </section>
    </>
  );
}
