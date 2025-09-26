import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored === "light" || stored === "dark") return stored;
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggle = useCallback(() => {
        setThemeState((t) => (t === "dark" ? "light" : "dark"));
    }, []);

    const setTheme = useCallback((value: Theme) => {
        setThemeState(value);
    }, []);

    return { theme, toggle, setTheme } as const;
}
