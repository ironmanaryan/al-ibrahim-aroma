"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

type Theme = "dark" | "light";

const STORAGE_KEY = "aia_theme";
const META_COLORS: Record<Theme, string> = { dark: "#0B0B0B", light: "#F3EFE8" };

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be blocked */
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", META_COLORS[next]);
  };

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "light"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <Sun className="theme-toggle__sun" size={17} />
      <Moon className="theme-toggle__moon" size={16} />
    </button>
  );
}
