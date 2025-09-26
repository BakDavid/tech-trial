import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserAnswer } from "@/types";
import { calculateStats } from "@/utils/statsUtils";
import questionsData from "@/data/questions.json";

const Stats = () => {
  const navigate = useNavigate();
  const [userAnswers] = useLocalStorage<UserAnswer[]>('userAnswers', []);
  
  const questions = questionsData;
  const stats = calculateStats(userAnswers, questions);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-success";
    if (accuracy >= 60) return "text-warning";
    return "text-destructive";
  };

  if (userAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-center mb-2">Your Statistics</h1>
          </div>

          <Card className="text-center animate-fade-in">
            <CardHeader>
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle>No Data Yet</CardTitle>
              <CardDescription>
                Start practicing to see your performance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/practice')}>
                Start Your First Practice Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-center mb-2">Your Statistics</h1>
          <p className="text-muted-foreground text-center">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Questions answered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAccuracyColor(stats.accuracy)}`}>
                {Math.round(stats.accuracy)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.correctAnswers} correct out of {stats.totalQuestions}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDate(stats.lastUpdated)}
              </div>
              <p className="text-xs text-muted-foreground">
                Latest activity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>
              See how you're performing in different areas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(stats.categoryStats).map(([category, categoryStats]) => (
              <div key={category} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">{category}</h3>
                    <Badge variant="outline">
                      {categoryStats.correct}/{categoryStats.total}
                    </Badge>
                  </div>
                  <div className={`text-lg font-bold ${getAccuracyColor(categoryStats.accuracy)}`}>
                    {Math.round(categoryStats.accuracy)}%
                  </div>
                </div>
                <Progress 
                  value={categoryStats.accuracy} 
                  className="h-2"
                />
                <div className="text-sm text-muted-foreground">
                  {categoryStats.correct} correct answers out of {categoryStats.total} questions
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center animate-fade-in">
          <Button onClick={() => navigate('/practice')}>
            Continue Practicing
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
                localStorage.removeItem('userAnswers');
                window.location.reload();
              }
            }}
          >
            Reset Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Stats;