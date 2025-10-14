import Project from "./Project";
import { useTranslation } from "react-i18next";

export default function Projects() {
  const { t, i18n } = useTranslation(["lang"]);

  const projects = [
    {
      title: 'Drive IAG',
      description: 'description_project1',
      urlCode: '',
      urlProject: 'https://driveiag.com/',
      image: 'images/drive-iag.png',
      categories: ['Website', 'Software']
    },
    {
      title: 'Go North Surrey GM',
      description: 'description_project1',
      urlCode: '',
      urlProject: 'https://gonorthsurreygm.ca/',
      image: 'images/gonorth.png',
      categories: ['Website', 'Vehicles']
    },
    {
      title: 'Dropanas',
      description: 'description_project1',
      urlCode: '',
      urlProject: 'https://dropanas.com/',
      image: 'images/dropanas.png',
      categories: ['Website', 'E-commerce']
    },
    {
      title: 'Expresso',
      description: 'description_project2',
      urlCode: 'https://github.com/andresmarquez02/expresso',
      image: 'images/expresso.png',
      urlProject: 'https://expressomarket.netlify.app/',
      categories: ['Website', 'Services']
    },
  ]
  return (
    <section
      id="projects"
      data-section="projects"
      className="section pb-24"
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-black/80 dark:text-white/80">
        {t("title_projects")}
      </h2>
      
      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project, key) => (
          <Project key={key} project={project} />
        ))}
      </div>
    </section>
  );
}
