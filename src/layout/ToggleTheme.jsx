import { useTheme } from "../hooks/useTheme";

export default function ToggleTheme() {
  const { isDark, toggle } = useTheme();

  return (
    <label className="switch ms-2" aria-label="Toggle color theme">
      <input type="checkbox" checked={isDark} onChange={toggle} />
      <span className="slider" />
    </label>
  );
}
