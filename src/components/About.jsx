import Image from "../assets/image_about.png";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation(["lang"]);

  return (
    <section
      id="about"
      data-section="about"
      className="section pb-10"
    >
      <h2 className="text-3xl font-semibold mb-6 flex gap-x-3 items-center text-black/80 dark:text-white/80">
        {t("about_title")}
      </h2>
      <article className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="[&amp;>p]:mb-4 [&amp;>p>strong]:text-yellow-400 [&amp;>p>strong]:font-semibold text-base text-pretty order-2 md:order-1">
          {t("about_me")}
        </div>
      </article>
    </section>
  );
}
