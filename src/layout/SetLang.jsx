import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function SetLang() {
  const { language, changeLanguage, supported } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const select = (lang) => {
    changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative ms-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 px-2 sm:px-3 text-sm sm:text-base uppercase rounded-full hover:bg-white/10 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {language}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 mt-2 min-w-[6rem] rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden"
        >
          {supported.map((lang) => (
            <li key={lang} role="option" aria-selected={lang === language}>
              <button
                type="button"
                onClick={() => select(lang)}
                className="w-full text-left px-4 py-2 text-sm uppercase hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {lang}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
