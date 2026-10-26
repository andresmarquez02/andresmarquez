import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Split from "../components/Split";
import { EXPERIENCES } from "../data/content";
import { useSideScroll } from "../hooks/useSideScroll";

// "Role · Company (Country - Mode)" -> company on top, then role and where it was.
const splitTitle = (title) => {
  const [role, rest = ""] = title.split("·").map((part) => part.trim());
  const [, company = rest, place] = rest.match(/^(.*?)\s*\((.*)\)$/) ?? [];
  return { company, role: place ? `${role} · ${place}` : role };
};

export default function Experience() {
  const { t } = useTranslation();
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  useSideScroll(stageRef, trackRef);

  return (
    <section id="experience" className="rev" aria-labelledby="exp-title">
      <div ref={stageRef} className="side-stage">
        <div className="rev-head">
          <h2 id="exp-title" data-split>
            <Split text={t("exp_title")} /> <span className="hx-accent"><Split text={t("exp_accent")} /></span>
          </h2>
          <p>{t("exp_lede")}</p>
        </div>
        <ul ref={trackRef} className="side-track">
          {EXPERIENCES.map((e, i) => {
            const { role, company } = splitTitle(t(e.title));
            return (
              <li key={e.id} className="rev-card" tabIndex={0} data-tilt>
                <div className="rev-top">
                  <span className="rev-date">{t(e.date)}</span>
                  <span className="rev-n" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="rev-who">
                  <span className="rev-badge" aria-hidden>{company.charAt(0).toUpperCase()}</span>
                  <div>
                    <b>{company}</b>
                    <small>{role}</small>
                  </div>
                </div>
                <p>{t(e.description)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
