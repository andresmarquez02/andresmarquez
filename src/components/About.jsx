import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
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

        const text = rootRef.current?.querySelector("[data-about-text]");
        if (!text) return;
        const original = text.textContent.trim().replace(/\s+/g, " ");
        const words = original.split(" ");
        text.innerHTML = words
          .map((w) => `<span class="opacity-30">${w}</span>`)
          .join(" ");
        gsap.to(text.querySelectorAll("span"), {
          opacity: 1,
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        });
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [t]);

  return (
    <section
      ref={rootRef}
      id="about"
      data-section="about"
      className="scroll-mt-24 pb-28"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <span className="mb-4 hidden font-mono text-xs uppercase tracking-widest text-fg/40 md:block">
              (03) ABOUT
            </span>
            <h2
              data-section-title
              className="font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
            >
              {t("about_title")}
            </h2>
          </div>
        </div>
        <div className="md:col-span-8">
          <p
            data-about-text
            key={t("about_me")}
            className="text-pretty break-words text-lg leading-relaxed text-fg md:text-2xl"
          >
            {t("about_me")}
          </p>
        </div>
      </div>
    </section>
  );
}
