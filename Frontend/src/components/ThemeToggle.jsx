import React, { useEffect, useState } from "react";

const ThemeToggle = ({ floating }) => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className={
        floating
          ? "fixed top-4 right-4 z-50 bg-sidebar-accent text-sidebar-accent-foreground dark:bg-sidebar-primary dark:text-sidebar-primary-foreground px-3 py-2 rounded shadow transition-colors duration-200 hover:bg-sidebar-accent-foreground hover:text-sidebar-accent"
          : "w-full my-4 bg-sidebar-accent text-sidebar-accent-foreground dark:bg-sidebar-primary dark:text-sidebar-primary-foreground px-3 py-2 rounded transition-colors duration-200 hover:bg-sidebar-accent-foreground hover:text-sidebar-accent"
      }
      aria-label="Toggle theme"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle; 