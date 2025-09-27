import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Stats from "./pages/Stats";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import ThemeToggle from "@/components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/practice" element={<Practice />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/stats" element={<Stats />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ThemeToggle />
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
