import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Brain, Code, Database, Globe, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Brain,
            title: "Smart Questions",
            description:
                "Curated IT interview questions covering all major topics",
        },
        {
            icon: TrendingUp,
            title: "Track Progress",
            description:
                "Monitor your performance and identify areas for improvement",
        },
        {
            icon: Code,
            title: "Multiple Categories",
            description:
                "Data Structures, Algorithms, System Design, and Web Development",
        },
        {
            icon: Users,
            title: "Practice Mode",
            description:
                "Randomized questions to test your knowledge effectively",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-primary mb-4">
                            <Brain className="h-8 w-8" />
                            <span className="text-2xl font-bold">
                                InterviewAce
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text">
                            Master IT Interviews
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Practice with curated interview questions, track
                            your progress, and ace your next tech interview with
                            confidence.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 animate-slide-up"
                            onClick={() => navigate("/practice")}
                        >
                            Start Practicing
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 animate-slide-up"
                            onClick={() => navigate("/learn")}
                        >
                            Learn
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 animate-slide-up"
                            onClick={() => navigate("/stats")}
                        >
                            View Stats
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 animate-fade-in">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-2 hover:border-primary/50 transition-colors duration-300"
                        >
                            <CardHeader className="text-center">
                                <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                                <CardTitle className="text-lg">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Stats Preview */}
                <div className="mt-20 text-center animate-fade-in">
                    <h2 className="text-3xl font-bold mb-8">
                        Ready to Level Up?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="space-y-2">
                            <Database className="h-8 w-8 mx-auto text-primary" />
                            <div className="text-3xl font-bold">50+</div>
                            <div className="text-muted-foreground">
                                Practice Questions
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Code className="h-8 w-8 mx-auto text-primary" />
                            <div className="text-3xl font-bold">4</div>
                            <div className="text-muted-foreground">
                                Categories
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Globe className="h-8 w-8 mx-auto text-primary" />
                            <div className="text-3xl font-bold">100%</div>
                            <div className="text-muted-foreground">
                                Free to Use
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
