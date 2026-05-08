import { useEffect, useState } from "react";

const STORAGE_KEY = "color-theme";
const DARK = "dark";
const LIGHT = "light";

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === DARK || stored === LIGHT) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
};

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === DARK);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((current) => (current === DARK ? LIGHT : DARK));

  return { theme, isDark: theme === DARK, toggle };
}
