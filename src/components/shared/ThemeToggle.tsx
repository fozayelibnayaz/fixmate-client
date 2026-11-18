"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn btn-ghost" style={{ padding: "8px 10px" }} aria-label="Toggle theme">
      <span>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</span>
    </button>
  );
}
