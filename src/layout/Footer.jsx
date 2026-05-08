import { useTranslation } from "react-i18next";
import { CONTACTS } from "../data/contacts";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 pb-10">
      <div className="w-full py-6 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
          {year} - Andres Marquez
        </span>
        <ul className="flex mt-4 sm:justify-center md:mt-0 space-x-5">
          {CONTACTS.map(({ icon, url, name }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(name)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <i className={`${icon} text-lg`} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
