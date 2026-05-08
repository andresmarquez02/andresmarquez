import { useTranslation } from "react-i18next";

export default function SidebarItem({ item, onNavigate }) {
  const { t } = useTranslation();

  return (
    <li>
      <a
        href={item.url}
        aria-label={t(item.label)}
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 hover:text-yellow-600 dark:hover:text-yellow-200 transition"
      >
        {item.icon && <i className={`${item.icon} text-xl`} aria-hidden />}
        <span>{t(item.label)}</span>
      </a>
    </li>
  );
}
