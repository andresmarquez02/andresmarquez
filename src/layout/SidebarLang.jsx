import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage";

export default function SidebarLang() {
  const { t } = useTranslation();
  const { changeLanguage, supported, labels } = useLanguage();

  return (
    <div className="px-3 py-2">
      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
        {t("language")}
      </p>
      <div className="flex gap-2">
        {supported.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => changeLanguage(code)}
            className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            {t(labels[code])}
          </button>
        ))}
      </div>
    </div>
  );
}
