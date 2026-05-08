import { useTranslation } from "react-i18next";
import profileImage from "../assets/andresmarquez.jpg";
import { CONTACTS, WHATSAPP_URL } from "../data/contacts";

export default function Presentation() {
  const { t } = useTranslation();

  return (
    <section className="section pb-10">
      <div className="flex items-center mb-4">
        <img
          className="rounded-full size-24"
          src={profileImage}
          alt="Andres Marquez"
          width="96"
          height="96"
          fetchpriority="high"
          decoding="async"
        />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ms-4 inline-flex items-center text-green-500 hover:text-white border border-green-400 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium md:text-xs px-5 py-2.5 dark:border-green-500 dark:hover:bg-green-500 dark:focus:ring-green-400 rounded-full transition"
        >
          {t("availability")}
        </a>
      </div>

      <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold pb-6 lg:pb-10">
        {t("hi")}
      </h1>

      <h2 className="text-xl lg:text-2xl text-balance max-w-[700px]">
        <span>{t("text1")}</span>
        <span className="text-yellow-500 dark:text-yellow-200">&nbsp;{t("text2")}</span>.
        <span className="text-sky-800 dark:text-sky-400">&nbsp;{t("text3")}</span>.
        <span className="text-red-800 dark:text-red-400">&nbsp;{t("text4")}</span>
      </h2>

      <nav className="flex gap-4 mt-8 flex-wrap">
        {CONTACTS.map(({ icon, url, name }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border dark:border-white/10 border-gray-300 rounded-full flex items-center gap-x-2 py-1 px-2 md:py-2 md:px-4 text-xs md:text-base text-black/70 dark:text-white transition hover:scale-110 hover:bg-white/10"
          >
            <i className={`${icon} text-base`} aria-hidden />
            {t(name)}
          </a>
        ))}
      </nav>
    </section>
  );
}
