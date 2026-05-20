import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectIndex from "./ProjectIndex";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "kenk-nappford",
    title: "Kenk Napp Ford",
    year: "2026",
    urlProject: "https://www.kenknappford.com/",
    image: "images/kenk-nappford.png",
    categories: ["Website", "Vehicles"],
    featured: true,
  },
  {
    id: "iag-group",
    title: "IAG Group",
    year: "2025",
    urlProject: "https://iagcanada.com/",
    image: "images/iag-group.png",
    categories: ["Website", "Vehicles"],
    featured: true,
  },
  {
    id: "drive-iag",
    title: "Drive IAG",
    year: "2024",
    urlProject: "https://driveiag.com/",
    image: "images/drive-iag.png",
    categories: ["Website", "Software"],
    featured: true,
  },
  {
    id: "gonorth",
    title: "Go North Surrey GM",
    year: "2024",
    urlProject: "https://gonorthsurreygm.ca/",
    image: "images/gonorth.png",
    categories: ["Website", "Vehicles"],
  },
  {
    id: "Leadbox",
    title: "Leadbox",
    year: "2024",
    urlProject: "https://leadboxhq.com/",
    image: "images/leadbox.png",
    categories: ["Website"],
    featured: true,
  },
  {
    id: "dropanas",
    title: "Dropanas",
    year: "2024",
    urlProject: "https://dropanas.com/",
    image: "images/dropanas.png",
    categories: ["Website", "E-commerce"],
  },
  {
    id: "expresso",
    title: "Expresso",
    year: "2023",
    urlProject: "https://expressomarket.netlify.app/",
    urlCode: "https://github.com/andresmarquez02/expresso",
    image: "images/expresso.png",
    categories: ["Website", "Services"],
  },
  {
    id: "vulister",
    title: "Vulister",
    year: "2022",
    urlProject: "https://www.vulistersgt.com/vulister/public/",
    image: "images/vulister.png",
    categories: ["Website", "Services"],
  },
  {
    id: "multiparadise",
    title: "Multiparadise",
    year: "2020",
    urlProject: "https://multiparadise.com/public/",
    image: "images/multiparadise.png",
    categories: ["Website", "Services"],
  },
];

export default function Projects() {
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
        gsap.from("[data-project-card]", {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        });
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="projects"
      data-section="projects"
      className="scroll-mt-24 pb-28"
    >
      <div className="mb-8">
        <h2
          data-section-title
          className="font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
        >
          {t("title_projects")}
        </h2>
      </div>

      <ProjectIndex projects={PROJECTS} />
    </section>
  );
}
