import { useTranslation } from "react-i18next";
import Project from "./Project";

const PROJECTS = [
  {
    id: "drive-iag",
    title: "Drive IAG",
    urlProject: "https://driveiag.com/",
    image: "images/drive-iag.png",
    categories: ["Website", "Software"],
  },
  {
    id: "gonorth",
    title: "Go North Surrey GM",
    urlProject: "https://gonorthsurreygm.ca/",
    image: "images/gonorth.png",
    categories: ["Website", "Vehicles"],
  },
  {
    id: "dropanas",
    title: "Dropanas",
    urlProject: "https://dropanas.com/",
    image: "images/dropanas.png",
    categories: ["Website", "E-commerce"],
  },
  {
    id: "expresso",
    title: "Expresso",
    urlProject: "https://expressomarket.netlify.app/",
    urlCode: "https://github.com/andresmarquez02/expresso",
    image: "images/expresso.png",
    categories: ["Website", "Services"],
  },
];

export default function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" data-section="projects" className="section pb-24">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-black/80 dark:text-white/80">
        {t("title_projects")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PROJECTS.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
