'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: QuizQuestion[]; 
  onComplete: (score: number) => void;
  isReadOnly?: boolean;
}

export default function Quiz({ questions = [], onComplete, isReadOnly = false }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
        <p>No quiz has been added for this course yet.</p>
      </div>
    );
  }

  const handleSelect = (index: number, value: string) => {
    if (isReadOnly) return;
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim() === q.correctAnswer?.trim()) correctCount++;
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore);
  };

  if (submitted) {
    return (
      <Card className="text-center p-8 bg-green-50 border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Quiz Completed!</h2>
        <p className="text-4xl font-bold text-green-600 mb-4">{score}%</p>
        <p className="text-gray-600">Your score has been recorded.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Retake Quiz
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        {isReadOnly && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded mb-4">
          Admin View: You can preview the questions but cannot submit scores.
        </div>
      )}
      {questions.map((q, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-lg">Question {i + 1}: {q.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(val) => handleSelect(i, val)}>
              {q.options.map((opt) => (
                <div key={opt} className="flex items-center space-x-2 space-y-2">
                  <RadioGroupItem value={opt} id={`q${i}-${opt}`} />
                  <Label htmlFor={`q${i}-${opt}`} className="cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        onClick={handleSubmit} 
        disabled={Object.keys(answers).length !== questions.length}
      >
        Submit Quiz
      </Button>
    </div>
  );
}