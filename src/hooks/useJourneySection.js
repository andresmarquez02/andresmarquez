import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "../scene/journey";

gsap.registerPlugin(ScrollTrigger);

// Publishes how far the viewport's centre line has crossed this section
// (0 = section top at the centre, 1 = section bottom at the centre) to the 3D
// scene through `journey.section[id]`. Sections are contiguous, so exactly one
// of them is "in progress" at any time. The hero passes start: "top top": its top
// is already above the centre line at scroll 0, so the default would begin at 0.5.
export function useJourneySection(id, onProgress, { start = "top center" } = {}) {
  const ref = useRef(null);
  const callback = useRef(onProgress);

  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const publish = (self) => {
      journey.section[id] = self.progress;
      callback.current?.(self.progress);
    };
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end: "bottom center",
      onUpdate: publish,
      onRefresh: publish,
    });
    return () => trigger.kill();
  }, [id, start]);

  return ref;
}
