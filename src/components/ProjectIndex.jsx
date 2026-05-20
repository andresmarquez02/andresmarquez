export default function ProjectIndex({ projects }) {
  return (
    <ul className="border-t border-fg/10">
      {projects.map((project, i) => (
        <li
          key={project.id}
          data-project-card
          className="border-b border-fg/10"
        >
          <a
            href={project.urlProject}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-6 transition-colors hover:bg-fg/[0.04]"
          >
            <span className="font-mono text-xs text-fg/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-display text-2xl font-medium text-fg transition-colors group-hover:text-accent md:text-4xl">
              {project.title}
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-fg/40 md:inline">
              {project.categories.join(" · ")}
            </span>
            <span className="font-mono text-xs text-fg/50">{project.year}</span>
            <span className="text-fg/40 transition-all group-hover:translate-x-1 group-hover:text-accent">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
