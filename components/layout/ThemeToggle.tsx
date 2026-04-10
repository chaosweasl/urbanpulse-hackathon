"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return null;
}
