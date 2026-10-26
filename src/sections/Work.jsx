import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Arrow from "../components/Arrow";
import Split from "../components/Split";
import { GraphicN8n, GraphicPipeline } from "../components/ServiceGraphics";
import { PROJECTS } from "../data/content";
import { WHATSAPP_URL } from "../data/contacts";

gsap.registerPlugin(ScrollTrigger);

// Projects scroll sideways while the section is pinned, alternating light and dark panels.
// The screenshot inside each frame scrolls as its panel crosses the screen, and the giant
// name swings in and out around its top-left corner.
export default function Work() {
  const { t } = useTranslation();
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 880px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const panels = gsap.utils.toArray(".pf-panel", track);
      const distance = () => track.scrollWidth - window.innerWidth;

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        const title = panel.querySelector(".pf-title");
        const frame = panel.querySelector(".pf-frame");
        const img = panel.querySelector(".pf-frame img");
        const link = { containerAnimation: slide, scrub: true };

        // Same choreography as sixo.agency: the name pivots on a point just above its top-left
        // corner. Entering, it starts upright against the panel's left edge (reading top to
        // bottom); leaving, it swings up against the right edge (reading bottom to top).
        // expo.inOut keeps it upright most of the way and flips it fast mid-screen.
        // Order matters: the exit tween must be created first so it records the resting pose
        // as its start; the entrance tween then pre-rotates the title for the first frame.
        gsap.to(title, {
          rotation: -90,
          x: () => window.innerWidth - title.offsetHeight,
          y: () => title.offsetHeight,
          ease: "expo.inOut",
          scrollTrigger: { ...link, trigger: panel, start: "left 0%", end: "left -100%", invalidateOnRefresh: true },
        });
        gsap.from(title, {
          rotation: 90,
          x: () => title.offsetHeight,
          y: () => -window.innerHeight + title.offsetHeight,
          ease: "expo.inOut",
          scrollTrigger: { ...link, trigger: panel, start: "left 100%", end: "left 0%", invalidateOnRefresh: true },
        });
        // The screenshot scrolls for the whole time its panel is on screen.
        if (img && frame) {
          gsap.fromTo(
            img,
            { y: 0 },
            {
              y: () => -Math.max(0, img.offsetHeight - frame.clientHeight),
              ease: "none",
              scrollTrigger: { ...link, trigger: panel, start: i === 0 ? "left 0%" : "left 100%", end: "right 0%", invalidateOnRefresh: true },
            }
          );
        }
        gsap.from(panel.querySelectorAll(".pf-left > *"), {
          autoAlpha: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 80%", once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title">
      <div className="wk-head">
        <h2 id="work-title" data-split>
          <Split text={t("work_h_1")} /> <span className="hx-accent"><Split text={t("work_h_accent")} /></span>
        </h2>
        <p>{t("work_lede")}</p>
        <a className="hx-arrow-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          {t("work_cta")}
          <Arrow />
        </a>
      </div>
      <div ref={pinRef} className="pf-pin">
        <div ref={trackRef} className="pf-track">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              id={`project-${p.id}`}
              className={`pf-panel ${i % 2 === 0 ? "pf-panel--light" : "pf-panel--dark"}`}
              style={{ "--pf-chars": p.big.length }}
            >
              <div className="pf-body">
                <div className="pf-left">
                  <p className="pf-label">
                    {String(i + 1).padStart(2, "0")}/ {t(`proj_${p.id}_name`)}
                  </p>
                  <h3 className="pf-copy">{t(`proj_${p.id}_desc`)}</h3>
                  <p className="pf-scope">{t(`proj_${p.id}_tag`)}</p>
                  <ul className="pf-tools">
                    {p.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  {p.url ? (
                    <a className="pf-visit" href={p.url} target="_blank" rel="noopener noreferrer">
                      {t("view")}
                      <Arrow size={16} />
                    </a>
                  ) : (
                    <span className="pf-visit pf-visit--off">{t("proj_private")}</span>
                  )}
                </div>
                <div className="pf-media">
                  {p.visual ? (
                    <figure className="pf-frame pf-frame--visual">
                      {p.visual === "n8n" ? <GraphicN8n /> : <GraphicPipeline />}
                    </figure>
                  ) : (
                    <figure className="pf-frame">
                      <img
                        src={`/images/projects/${p.image}.jpg`}
                        alt={t(`proj_${p.id}_name`)}
                        loading="lazy"
                        decoding="async"
                        width="1100"
                        height="2400"
                      />
                    </figure>
                  )}
                </div>
              </div>
              <p className="pf-title" aria-hidden>{p.big}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
