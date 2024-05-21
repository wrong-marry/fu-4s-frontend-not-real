import { useLoaderData } from "react-router-dom";
import MultipleChoices from "../../../components/study-mode/learn/MultipleChoices";

export interface QuizData {
  answers: any;
  userId: number | null;
  userImg: string | null;
  quizId: number | null;
  userName: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  quizName: string | null;
  rate: number | undefined;
  numberOfQuestions: number | null;
  createAt: string | null;
  view: number | null;
  timeRecentViewQuiz: string | number | null;
  questions:
    | [
        {
          questionContent: string | null;
          answers: [
            {
              content: string | null;
              isCorrect: boolean | null;
            }
          ];
        }
      ]
    | null;
}

export const INCORRECT_SENTENCES = [
  "No sweat, you're still learning 😊",
  "No worries! Mistakes happen; let's try again!",
  "It's okay! Learning is about progress.",
  "Not quite there, but every mistake is progress. Let's move on!",
  "Mistakes happen; you're doing great. On to the next one!",
  "Incorrect, but that's okay. Every mistake is a chance to learn!",
];

export const CORRECT_SENTENCES = [
  "Fantastic! You nailed it! Great job!",
  "Well done! You got it right. Keep it up!",
  "Perfect! You've got the hang of it. Awesome!",
  "Excellent! Correct answer. Keep going strong!",
  "Bravo! Right on target. You're on fire!",
];

function LearnPage() {
  const quizData = useLoaderData() as QuizData;

  return <>{quizData && <MultipleChoices data={quizData} />}</>;
}

export default LearnPage;
