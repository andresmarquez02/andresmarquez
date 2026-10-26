import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [1, 2, 3, 4, 5];
const STEP = 1.2;

// "Sound familiar?": the headline stays pinned while the pain points appear one by one.
export default function Familiar() {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 880px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray("[data-fam-card]", rootRef.current);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: `+=${cards.length * 50}%`,
          pin: true,
          scrub: 0.6,
        },
      });
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { autoAlpha: 0, y: 36, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          i * STEP
        );
        if (i < cards.length - 1) tl.to(card, { autoAlpha: 0.28, duration: 0.6 }, i * STEP + STEP + 0.4);
      });
      tl.to({}, { duration: 0.6 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="fam" aria-labelledby="fam-title">
      <div ref={stageRef} className="fam-stage">
        <h2 id="fam-title" className="fam-title">{t("fam_title")}</h2>
        <ul className="fam-list">
          {CARDS.map((n) => (
            <li key={n} data-fam-card className="fam-card">
              <span>{t(`fam_${n}a`)}</span>
              <span>{t(`fam_${n}b`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
