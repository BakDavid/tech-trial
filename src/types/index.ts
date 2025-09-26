export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  categoryStats: Record<string, {
    total: number;
    correct: number;
    accuracy: number;
  }>;
  lastUpdated: number;
}

export interface PracticeSession {
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  isCompleted: boolean;
}