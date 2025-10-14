import React from "react";
import { useTranslation } from "react-i18next";

export default function Project({ project }) {
  const { t } = useTranslation(["lang"]);

  return (
    <article className="group relative">
      {/* Contenedor de la imagen con bordes redondeados especiales */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300">
        <img
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={project.image}
          loading="lazy"
        />
        
        {/* Tags de categorías - posicionados arriba a la izquierda */}
        {project.categories && project.categories.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {project.categories.map((category, key) => (
              <span
                key={key}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        {/* Botón circular con flecha - abajo a la derecha */}
        <a
          href={project.urlProject}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-xl"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>

      {/* Título del proyecto */}
      <h3 className="mt-4 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        {project.title}
      </h3>
    </article>
  );
}
