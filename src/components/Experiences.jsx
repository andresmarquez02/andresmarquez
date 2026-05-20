import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./Experience";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  { id: "exp5", date: "date_exp5", title: "title_exp5", description: "description_exp5" },
  { id: "exp0", date: "date_exp0", title: "title_exp0", description: "description_exp0" },
  { id: "exp0", date: "date_exp0", title: "title_exp0", description: "description_exp0" },
  { id: "exp1", date: "date_exp1", title: "title_exp1", description: "description_exp1" },
  { id: "exp2", date: "date_exp2", title: "title_exp2", description: "description_exp2" },
  { id: "exp3", date: "date_exp3", title: "title_exp3", description: "description_exp3" },
  { id: "exp4", date: "date_exp4", title: "title_exp4", description: "description_exp4" },
];

export default function Experiences() {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-section-title]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        });
        gsap.from("[data-exp-item]", {
          autoAlpha: 0,
          x: -32,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
        });
        gsap.fromTo(
          "[data-exp-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          }
        );
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="experience"
      data-section="experience"
      className="scroll-mt-24 pb-28"
    >
      <div className="mb-12 flex items-end justify-between">
        <h2
          data-section-title
          className="font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
        >
          {t("title_exp")}
        </h2>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-fg/40 md:block">
          (01) WORK
        </span>
      </div>
      <ol className="relative ms-3">
        <span
          data-exp-line
          aria-hidden
          className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-flag-yellow/70 via-flag-blue/50 to-flag-red/40"
        />
        {EXPERIENCES.map((experience, i) => (
          <Experience key={`${experience.id}-${i}`} experience={experience} />
        ))}
      </ol>
    </section>
  );
}
