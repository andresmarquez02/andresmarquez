import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" data-section="about" className="section pb-10">
      <h2 className="text-3xl font-semibold mb-6 flex gap-x-3 items-center text-black/80 dark:text-white/80">
        {t("about_title")}
      </h2>
      <article className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <p className="text-base text-pretty whitespace-pre-line">
          {t("about_me")}
        </p>
      </article>
    </section>
  );
}
