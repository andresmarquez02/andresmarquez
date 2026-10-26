import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const readTheme = () => document.documentElement.dataset.theme === "light" ? "light" : "dark";

// The theme is set before first paint by an inline script in index.html;
// this hook keeps React in sync and persists the visitor's choice.
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage can be blocked; the toggle still works for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((prev) => (prev === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
