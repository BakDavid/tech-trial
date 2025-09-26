import { Question } from '@/types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(
  questions: Question[], 
  count: number, 
  category?: string
): Question[] {
  const filteredQuestions = category 
    ? questions.filter(q => q.category === category)
    : questions;
  
  const shuffled = shuffleArray(filteredQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getCategories(questions: Question[]): string[] {
  const categories = [...new Set(questions.map(q => q.category))];
  return categories.sort();
}