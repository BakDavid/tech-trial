import { UserAnswer, UserStats, Question } from '@/types';

export function calculateStats(answers: UserAnswer[], questions: Question[]): UserStats {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const categoryStats: Record<string, { total: number; correct: number; accuracy: number }> = {};

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const category = question.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0, accuracy: 0 };
      }
      categoryStats[category].total++;
      if (answer.isCorrect) {
        categoryStats[category].correct++;
      }
    }
  });

  // Calculate accuracy for each category
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
  });

  return {
    totalQuestions,
    correctAnswers,
    accuracy,
    categoryStats,
    lastUpdated: Date.now()
  };
}