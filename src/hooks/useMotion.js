import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Page-wide GSAP motion: titles slide in word by word, cards rise in as a group,
// tilt cards follow the pointer. Everything is skipped under reduced motion.
export function useMotion(language) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray("[data-split]").forEach((title) => {
          const words = title.querySelectorAll(".sw-i");
          gsap.fromTo(
            words,
            { yPercent: 115, rotate: 5 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.07,
              scrollTrigger: { trigger: title, start: "top 88%", once: true },
            }
          );
        });

        const rise = gsap.utils.toArray("[data-rise]");
        if (rise.length) {
          gsap.set(rise, { autoAlpha: 0, y: 56 });
          ScrollTrigger.batch(rise, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
          });
        }

        gsap.utils.toArray("[data-slide]").forEach((track) => {
          gsap.fromTo(
            track,
            { xPercent: Number(track.dataset.from) },
            {
              xPercent: Number(track.dataset.to),
              ease: "none",
              scrollTrigger: { trigger: track.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });

      // Tilt: subtle 3D follow on hover, only for real pointers.
      const cleanups = [];
      if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll("[data-tilt]").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
          gsap.set(card, { transformPerspective: 900 });
          const move = (e) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        });
      }

      return () => {
        ctx.revert();
        cleanups.forEach((fn) => fn());
      };
    });
    return () => mm.revert();
  }, [language]);
}
