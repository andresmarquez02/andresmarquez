import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "HERO" },
  { id: "experience", label: "WORK" },
  { id: "projects", label: "PROJECTS" },
  { id: "about", label: "ABOUT" },
];

const formatTime = (date) =>
  date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Caracas",
  });

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [section, setSection] = useState("HERO");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

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
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            LIVE
          </span>
          <span className="text-fg/30">·</span>
          <span>CARACAS</span>
          <span className="text-fg/30">·</span>
          <span className="tabular-nums text-fg/60">{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-accent">{section}</span>
          <span className="text-fg/30">·</span>
          <span className="tabular-nums text-fg/60">
            {progress.toFixed(0).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
