import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import profileImage from "../assets/andresmarquez.jpg";
import { CONTACTS, WHATSAPP_URL } from "../data/contacts";

const NAME_LINES = ["ANDRÉS", "MÁRQUEZ"];

export default function Presentation({ start = false }) {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        normal: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduced } = ctx.conditions;
        if (reduced) {
          gsap.set("[data-anim]", { autoAlpha: 1, y: 0 });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-anim='meta']", { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.06 }, 0)
          .from("[data-anim='avatar']", { autoAlpha: 0, scale: 0.9, duration: 0.6 }, 0.05)
          .from(
            "[data-anim='name-line']",
            { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "expo.out" },
            0.15
          )
          .from("[data-anim='subtitle']", { autoAlpha: 0, y: 14, duration: 0.6 }, 0.55)
          .from(
            "[data-anim='contact']",
            { y: 12, duration: 0.45, stagger: 0.06, clearProps: "transform" },
            0.7
          );
      },
      rootRef
    );

    return () => mm.revert();
  }, [start]);

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });

      const handleMove = (e) => {
        const r = cta.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.25);
      };
      const handleLeave = () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      };
      cta.addEventListener("mousemove", handleMove);
      cta.addEventListener("mouseleave", handleLeave);
      return () => {
        cta.removeEventListener("mousemove", handleMove);
        cta.removeEventListener("mouseleave", handleLeave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="pb-16 md:pb-24">
      <div className="grid items-end gap-6 md:grid-cols-[auto_1fr]">
        <div data-anim="avatar" className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-flag-yellow via-flag-blue to-flag-red opacity-60 blur-md" />
          <img
            src={profileImage}
            alt="Andres Marquez"
            width="112"
            height="112"
            fetchPriority="high"
            decoding="async"
            className="relative size-20 rounded-full border border-fg/10 object-cover md:size-24"
          />
        </div>

        <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">
          <span data-anim="meta" className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-emerald-300">{t("availability")}</span>
          </span>
          <span data-anim="meta" className="text-fg/75">
            <span className="text-fg/45">(01)</span> FULLSTACK · LARAVEL · VUE · REACT · NEXT
          </span>
          <span data-anim="meta" className="text-fg/75">
            <span className="text-fg/45">(02)</span> BASED IN CARACAS, VE — OPEN TO REMOTE
          </span>
        </div>
      </div>

      <h1 className="mt-10 font-display font-bold leading-[0.92] tracking-[-0.02em] text-fg">
        {NAME_LINES.map((line, i) => (
          <span
            key={line}
            className="block overflow-hidden"
            style={{ fontSize: "clamp(3.25rem, 13vw, 11rem)" }}
          >
            <span data-anim="name-line" className="block">
              {line}
              {i === NAME_LINES.length - 1 && (
                <span className="ml-3 align-middle text-accent">.</span>
              )}
            </span>
          </span>
        ))}
      </h1>

      <p
        data-anim="subtitle"
        className="mt-8 max-w-3xl text-balance text-base text-fg/80 md:text-lg"
      >
        <span className="text-fg">{t("text1")}</span>{" "}
        <span className="text-accent">{t("text2")}</span>.{" "}
        <span className="text-blue-300">{t("text3")}</span>.{" "}
        <span className="text-fg/70">{t("text4")}</span>
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          ref={ctaRef}
          data-anim="contact"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition glow-accent hover:bg-accent-glow"
        >
          <i className="lab la-whatsapp text-lg" aria-hidden />
          {t("contact_me")}
          <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
        </a>
        {CONTACTS.filter((c) => !c.url.startsWith("https://wa.me")).map(
          ({ icon, url, name }) => (
            <a
              key={url}
              data-anim="contact"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2.5 text-sm text-fg/80 transition hover:border-fg/30 hover:bg-fg/10 hover:text-fg"
            >
              <i className={`${icon} text-base`} aria-hidden />
              {t(name)}
            </a>
          )
        )}
      </div>
    </section>
  );
}
