import { useTranslation } from "react-i18next";

export default function ItemNav({ item }) {
  const { t } = useTranslation();

  return (
    <a
      href={item.url}
      className="hover:bg-white/10 hover:text-yellow-500 p-1 rounded-full px-2 sm:px-3 transition ease-in text-sm sm:text-base capitalize ms-2"
    >
      {t(item.label)}
    </a>
  );
}
