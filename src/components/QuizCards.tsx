"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Chapter, Question } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";


type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [questions, setQuestions] = React.useState<
    Record<string, boolean | null>>({});
    const [options, setOptions] = React.useState<Record<string, string>>({});
    
  const checkAnswer = React.useCallback(() => {
    const newQuestionState = { ...questions };
    chapter.questions.forEach((question) => {
      const user_answer = options[question.id];
      if (!user_answer) return;
      if (user_answer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
      setQuestions(newQuestionState);
    });
  }, [options, questions, chapter.questions]);
  return (
    <div className="flex-[1] mt-16 ml-8">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <div className="mt-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div
              className={cn("p-3 mt-4 border border-secondary rounded-lg", {
                "bg-green-700": questions[question.id] === true,
                "bg-red-700": questions[question.id] === false,
                "bg-secondary": questions[question.id] === null,
              })}
              key={question.id}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setOptions((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={option}
                          id={question.id + index.toString()}
                        />
                        <Label htmlFor={question.id + index.toString()}>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="w-full mt-2" size="lg" onClick={checkAnswer}>
        Review Answers
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCards;