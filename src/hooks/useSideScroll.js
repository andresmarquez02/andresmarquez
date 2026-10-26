import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pins `stageRef` and turns vertical scroll into a sideways slide of `trackRef`.
// On narrow screens or with reduced motion the track keeps its native horizontal scroll.
export function useSideScroll(stageRef, trackRef) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 880px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, [stageRef, trackRef]);
}
