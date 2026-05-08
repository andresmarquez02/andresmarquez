import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ItemNav from "./ItemNav";
import SidebarItem from "./SidebarItem";
import SidebarLang from "./SidebarLang";
import SetLang from "./SetLang";
import ToggleTheme from "./ToggleTheme";

const SCROLL_THRESHOLD = 10;
const SCROLLED_NAV_CLASS =
  "md:shadow md:dark:shadow-gray-700 bg-neutral-200/70 dark:bg-black/50 backdrop-blur-xl";

const NAV_ITEMS = [
  { url: "#experience", label: "experience", icon: "las la-laptop" },
  { url: "#projects", label: "projects", icon: "las la-project-diagram" },
  { url: "#about", label: "about", icon: "las la-user" },
  { url: "mailto:andres03marquez@gmail.com", label: "contact", icon: "lar la-envelope" },
];

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSidebarOpen]);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const navClass = isScrolled || isSidebarOpen ? SCROLLED_NAV_CLASS : "";

  return (
    <>
      <header className="h-16 md:h-20 md:flex justify-center items-center mx-auto md:pt-6 sticky top-0 w-full z-20">
        <nav
          aria-label="Main"
          className={`${navClass} w-full md:w-3/4 lg:w-8/12 xl:w-6/12 h-full md:rounded-full md:px-6 px-3 py-1 md:my-2 transition-all duration-150 ease-in`}
        >
          <ul className="hidden md:flex h-full flex-wrap flex-row items-center justify-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.url}>
                <ItemNav item={item} />
              </li>
            ))}
            <li>
              <ToggleTheme />
            </li>
            <li>
              <SetLang />
            </li>
          </ul>
          <div className="md:hidden h-full flex flex-row items-center justify-end">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
              className="hover:bg-white/10 hover:text-yellow-200 p-1 rounded-full px-2 sm:px-3 transition ease-in text-2xl ms-2"
            >
              <i className={isSidebarOpen ? "las la-times" : "las la-bars"} aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      <aside
        id="mobile-sidebar"
        {...(!isSidebarOpen ? { inert: "" } : {})}
        className={`md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-full z-10 transition-transform duration-200 ease-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-neutral-200/95 dark:bg-black/80 backdrop-blur-xl px-4 py-6 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <SidebarItem key={item.url} item={item} onNavigate={closeSidebar} />
            ))}
            <li className="flex items-center gap-3 px-3 py-3">
              <ToggleTheme />
              <span>{t("change_theme")}</span>
            </li>
          </ul>
          <SidebarLang />
        </div>
      </aside>
    </>
  );
}
