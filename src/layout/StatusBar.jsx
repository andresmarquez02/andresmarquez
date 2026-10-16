import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "process", label: "Process" },
  { id: "automation", label: "AI" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
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
        const current = entries.find((e) => e.isIntersecting);
        const match = current && SECTIONS.find((s) => s.id === current.target.id);
        if (match) setSection(match.label);
      },
      // A zero-height band at mid-screen: works for sections taller than the
      // viewport (process is 600vh), where a ratio threshold never fires.
      { rootMargin: "-50% 0px -50% 0px" }
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
