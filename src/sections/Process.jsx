import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Split from "../components/Split";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

// A timeline: the line fills as you scroll and the step you are reading lights up.
export default function Process() {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-proc-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: listRef.current, start: "top 62%", end: "bottom 62%", scrub: true },
          }
        );
        gsap.utils.toArray("[data-proc-row]").forEach((row) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            end: "bottom 62%",
            toggleClass: { targets: row, className: "is-active" },
          });
          gsap.from(row, {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          });
        });
        gsap.from("[data-proc-head]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
        });
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="process" className="proc" aria-labelledby="proc-title">
      <div className="proc-grid">
        <div className="proc-left">
          <h2 id="proc-title" className="proc-title" data-split>
            <Split text={t("proc_title_1")} /> <span className="hx-accent"><Split text={t("proc_title_accent")} /></span>
          </h2>
          <p className="proc-rail" data-proc-head>{t("process_lead")}</p>
        </div>
        <ol ref={listRef} className="proc-list">
          <span className="proc-track" aria-hidden>
            <span className="proc-line" data-proc-line />
          </span>
          {PROCESS_STEPS.map((n) => (
            <li key={n} className="proc-row" data-proc-row>
              <span className="proc-n" aria-hidden>{String(n).padStart(2, "0")}</span>
              <div>
                <h3>{t(`process_step${n}_title`)}</h3>
                <p>{t(`process_step${n}_desc`)}</p>
                <p className="proc-proof">
                  <b>{t("proof")}</b> {t(`process_step${n}_proof`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
