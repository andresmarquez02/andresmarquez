import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LINES = [
  { k: "LOCATION", v: "CARACAS, VE" },
  { k: "STATUS", v: "AVAILABLE" },
  { k: "ROLE", v: "FULLSTACK DEV" },
];

export default function Curtain({ onDone }) {
  const rootRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHidden(true);
      onDone?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setHidden(true);
          onDone?.();
        },
      });

      tl.set("[data-curtain-line]", { autoAlpha: 0, x: -8 })
        .to("[data-curtain-logo]", { autoAlpha: 1, duration: 0.4 })
        .to(
          "[data-curtain-line]",
          { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.12 },
          ">-0.1"
        )
        .to("[data-curtain-line]", { autoAlpha: 0.4, duration: 0.3 }, "+=0.4")
        .to(
          "[data-curtain-top]",
          { yPercent: -100, duration: 0.9, ease: "expo.inOut" },
          "+=0.1"
        )
        .to(
          "[data-curtain-bottom]",
          { yPercent: 100, duration: 0.9, ease: "expo.inOut" },
          "<"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <div
        data-curtain-top
        className="absolute inset-x-0 top-0 h-1/2 bg-bg"
      />
      <div
        data-curtain-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-bg"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            data-curtain-logo
            className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-fg/80 opacity-0"
          >
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
            AM
          </div>
          <ul className="space-y-1 font-mono text-[11px] tracking-widest text-fg/60">
            {LINES.map(({ k, v }) => (
              <li key={k} data-curtain-line className="opacity-0">
                <span className="text-fg/30">&gt;</span>{" "}
                <span className="inline-block w-24 text-fg/40">{k}</span>
                <span className="text-accent">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
