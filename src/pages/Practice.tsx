import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Question, UserAnswer, PracticeSession } from "@/types";
import { getRandomQuestions, getCategories } from "@/utils/questionUtils";
import { calculateStats } from "@/utils/statsUtils";
import questionsData from "@/data/questions.json";

const Practice = () => {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useLocalStorage<UserAnswer[]>('userAnswers', []);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const questions = questionsData as Question[];
  const categories = getCategories(questions);

  const startSession = () => {
    const sessionQuestions = getRandomQuestions(
      questions, 
      questionCount, 
      selectedCategory === 'all' ? undefined : selectedCategory
    );
    
    setSession({
      questions: sessionQuestions,
      currentIndex: 0,
      answers: [],
      isCompleted: false
    });
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const submitAnswer = () => {
    if (!session || !selectedAnswer) return;

    const currentQuestion = session.questions[session.currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timestamp: Date.now()
    };

    const newAnswers = [...session.answers, userAnswer];
    setUserAnswers(prev => [...prev, userAnswer]);
    
    setSession(prev => prev ? {
      ...prev,
      answers: newAnswers
    } : null);
    
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (!session) return;
    
    if (session.currentIndex < session.questions.length - 1) {
      setSession(prev => prev ? {
        ...prev,
        currentIndex: prev.currentIndex + 1
      } : null);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setSession(prev => prev ? {
        ...prev,
        isCompleted: true
      } : null);
    }
  };

  const resetSession = () => {
    setSession(null);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  if (!session) {
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
            <h1 className="text-4xl font-bold text-center mb-2">Practice Session</h1>
            <p className="text-muted-foreground text-center">Configure your practice session</p>
          </div>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
              <CardDescription>
                Choose your category and number of questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={startSession} className="w-full">
                Start Practice Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (session.isCompleted) {
    const stats = calculateStats(session.answers, session.questions);
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Session Complete!</CardTitle>
              <CardDescription>Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">
                  {Math.round(stats.accuracy)}%
                </div>
                <div className="text-muted-foreground">
                  {stats.correctAnswers} out of {stats.totalQuestions} correct
                </div>
              </div>

              <div className="grid gap-4">
                {Object.entries(stats.categoryStats).map(([category, categoryStats]) => (
                  <div key={category} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{category}</span>
                    <div className="text-right">
                      <div className="font-bold">{Math.round(categoryStats.accuracy)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {categoryStats.correct}/{categoryStats.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={resetSession} className="flex-1">
                  Practice Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/stats')} className="flex-1">
                  View All Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const currentAnswer = session.answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Badge variant="outline">
              Question {session.currentIndex + 1} of {session.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <div className="text-center text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>{currentQuestion.category}</Badge>
              <span className="text-sm text-muted-foreground">
                ID: {currentQuestion.id}
              </span>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "w-full justify-start text-left h-auto p-4 border-2";
                
                if (showFeedback) {
                  if (option === currentQuestion.answer) {
                    buttonClass += " border-success bg-success/10 text-success-foreground";
                  } else if (option === selectedAnswer && selectedAnswer !== currentQuestion.answer) {
                    buttonClass += " border-destructive bg-destructive/10 text-destructive-foreground";
                  } else {
                    buttonClass += " opacity-50";
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += " border-primary bg-primary/10";
                } else {
                  buttonClass += " hover:border-primary/50";
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => !showFeedback && setSelectedAnswer(option)}
                    disabled={showFeedback}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                      {showFeedback && option === currentQuestion.answer && (
                        <CheckCircle className="h-5 w-5 text-success ml-auto" />
                      )}
                      {showFeedback && option === selectedAnswer && selectedAnswer !== currentQuestion.answer && (
                        <XCircle className="h-5 w-5 text-destructive ml-auto" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {showFeedback && currentQuestion.explanation && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {!showFeedback ? (
                <Button 
                  onClick={submitAnswer} 
                  disabled={!selectedAnswer}
                  className="ml-auto"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="ml-auto">
                  {session.currentIndex < session.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Complete Session'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Practice;