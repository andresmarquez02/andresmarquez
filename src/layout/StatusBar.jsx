import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "experience", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
];

export default function StatusBar() {
  const [section, setSection] = useState("Intro");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = SECTIONS.find((s) => s.id === visible.target.id);
          if (match) setSection(match.label);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-20 hidden md:top-20 md:block"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/45">
        <div className="flex items-center gap-3">
          <span className="text-fg/70">{section}</span>
          <span aria-hidden className="h-px w-8 bg-fg/15" />
          <span className="tabular-nums text-fg/55">
            {progress.toFixed(0).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
