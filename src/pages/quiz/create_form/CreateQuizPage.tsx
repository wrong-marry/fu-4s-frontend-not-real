import axios from "axios";
import QuizCreateForm from "../../../components/quiz/QuizCreateForm";
import { useActionData } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
export interface Answer {
  quizAnswerId: number;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  quizQuestionId: number;
  question: string;
  answers: Answer[];
}

export interface QuizForm {
  categoryName: string;
  title: string;
  description: string;
  questions: Question[];
}
function CreateQuizPage() {
  const actionData = useActionData() as {
    error: boolean;
    msg: string;
  };
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.msg);
    }
    if (!actionData?.error) {
      toast.success(actionData?.msg);
    }
  }, [actionData]);

  return <QuizCreateForm />;
}
async function action({ request }: { request: Request }) {
  try {
    const { method } = request;
    const formData = await request.formData();
    const { userId, title, description, questions, categoryId } =
      Object.fromEntries(formData) as {
        userId: string;
        categoryId: string;
        title: string;
        description: string;
        questions: string;
      };
    const url = {
      POST: "http://localhost:8080/api/v1/quiz/create-quiz-set",
    };
    const payload = {
      POST: {
        userId: Number(userId),
        categoryId: Number(categoryId),
        title: title,
        description: description,
        questions: questions ? JSON.parse(questions) : "",
      },
    };

    const errorMsg = {
      POST: "Cannot create quiz. Please try again.",
    };

    const successMsg = {
      POST: "Quiz created successfully",
    };

    let res;

    if (method !== "DELETE") {
      res = await axios.request({
        method,
        url: url[method as keyof typeof url],
        data: payload[method as keyof typeof payload],
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      });
    }

    if (res?.status !== 200) {
      return {
        error: true,
        msg: errorMsg[method as keyof typeof errorMsg],
      };
    } else {
      return {
        error: false,
        msg: successMsg[method as keyof typeof successMsg],
      };
    }
  } catch (error) {
    return {
      error: true,
      msg: "Server error",
    };
  }
}

async function getCategoriesList() {
  try {
    const res = await axios
      .get("http://localhost:8080/api/v1/admin/get-all-category", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("AT"),
        },
      })
      .catch(() => {
        throw new Error("Something went wrong when fetching data");
      });
    return res.data;
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export { action as createQuizAction, getCategoriesList };
export default CreateQuizPage;
