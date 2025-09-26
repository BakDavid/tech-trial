import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <p className="text-xl text-muted-foreground">
                        Oops! Page not found
                    </p>
                    <p className="text-sm text-muted-foreground">
                        The page "{location.pathname}" doesn't exist.
                    </p>
                </div>
                <Button asChild>
                    <a href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Return to Home
                    </a>
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
