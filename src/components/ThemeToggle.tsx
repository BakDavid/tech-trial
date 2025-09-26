import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
    const { theme, toggle } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="fixed bottom-6 right-6 rounded-full"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    );
};

export default ThemeToggle;
