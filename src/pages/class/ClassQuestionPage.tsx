import { Params, redirect } from "react-router-dom";
import axios from "axios";
import ClassQuestionDetail from "../../components/class/question-details/ClassQuestionDetail";
export interface Question {
  classQuestionId: number;
  userId: number;
  title: string;
  content: string;
  createAt: Date;
  userName: string;
  answered: boolean;
  userFirstName: string;
  userLastName: string;
  classroomAnswerResponse?: {
    content: string;
    userId: number;
  };
}

export interface RepliesComment {
  userName: string;
  content: string;
  userId: number;
  replyCommentId: number;
  commentId: number;
}

export interface Comments {
  commentId: number;
  questionId: number;
  userName: string;
  userId: number;
  content: string;
  replyComments: RepliesComment[];
}

interface ActionRequest {
  requestField: "comment" | "reply" | "answer" | "question";
  userId: string;
  questionId?: string;
  commentId?: string;
  replyCommentId?: string;
  answerId?: string;
  content: string;
  classroomId?: string;
  title?: string;
}

function ClassQuestionPage() {
  return (
    <>
      <ClassQuestionDetail />
    </>
  );
}

async function loader({ params }: { params: Readonly<Params> }) {
  try {
    const { questionId, id } = params;
    const url = {
      fetchQuestions: `http://localhost:8080/api/v1/classroom/get-classroom-question/question-id=${questionId}`,
      fetchComments: `http://localhost:8080/api/v1/classroom/get-comments/question-id=${questionId}`,
    };

    const responses = await Promise.all([
      axios.get(url.fetchQuestions).catch(() => null),
      axios.get(url.fetchComments).catch(() => null),
    ]);

    if (!responses[0]?.data) {
      return redirect(`/class/${id}/discussion`);
    }
    return {
      questionsData: responses[0]?.data ?? null,
      commentsData: responses[1]?.data.entityResponses ?? [],
    };
  } catch (error) {
    return { error: true, message: "Server error" };
  }
}

async function action({ request }: { request: Request }) {
  try {
    const { method } = request;
    const data = Object.fromEntries(
      await request.formData()
    ) as unknown as ActionRequest;
    const { requestField } = data;

    const url: { [key: string]: { [key: string]: string } } = {
      comment: {
        POST: `http://localhost:8080/api/v1/classroom/add-comment`,
        PUT: `http://localhost:8080/api/v1/classroom/update-comment/${data.commentId}`,
        DELETE: `http://localhost:8080/api/v1/classroom/delete-comment/${data.commentId}`,
      },
      reply: {
        POST: `http://localhost:8080/api/v1/classroom/add-reply`,
        PUT: `http://localhost:8080/api/v1/classroom/update-reply/${data.replyCommentId}`,
        DELETE: `http://localhost:8080/api/v1/classroom/delete-reply/${data.replyCommentId}`,
      },
      answer: {
        POST: `http://localhost:8080/api/v1/classroom/add-answer`,
        PUT: `http://localhost:8080/api/v1/classroom/update-answer/${data.answerId}`,
        DELETE: `http://localhost:8080/api/v1/classroom/delete-answer/${data.answerId}`,
      },
      question: {
        PUT: `http://localhost:8080/api/v1/classroom/update-question`,
        DELETE: `http://localhost:8080/api/v1/classroom/delete-question/question-id=${data.questionId}&classroom-id=${data.classroomId}`,
      },
    };

    const payload: { [key: string]: { [key: string]: any } } = {
      comment: {
        POST: {
          content: data.content,
          questionId: Number(data.questionId),
          userId: Number(data.userId),
        },
        PUT: {
          content: data.content,
        },
      },
      reply: {
        POST: {
          content: data.content,
          commentId: Number(data.commentId),
          userId: Number(data.userId),
        },
        PUT: {
          content: data.content,
        },
      },
      answer: {
        POST: {
          content: data.content,
          questionId: Number(data.questionId),
          userId: Number(data.userId),
        },
        PUT: {
          content: data.content,
        },
      },
      question: {
        PUT: {
          classroomId: Number(data.classroomId),
          questionId: Number(data.questionId),
          title: data.title,
          content: data.content,
        },
      },
    };

    const successMsg: { [key: string]: { [key: string]: string } } = {
      comment: {
        POST: "Comment created",
        PUT: "Comment updated",
        DELETE: "Comment deleted",
      },
      reply: {
        POST: "Reply created",
        PUT: "Reply updated",
        DELETE: "Reply deleted",
      },
      answer: {
        POST: "Answer created",
        PUT: "Answer updated",
        DELETE: "Answer deleted",
      },
      question: {
        PUT: "Question updated",
        DELETE: "Question deleted",
      },
    };

    const errorMsg: { [key: string]: { [key: string]: string } } = {
      comment: {
        POST: "Cannot create comment",
        PUT: "Cannot update comment",
        DELETE: "Cannot delete comment",
      },
      reply: {
        POST: "Cannot create reply",
        PUT: "Cannot update reply",
        DELETE: "Cannot delete reply",
      },
      answer: {
        POST: "Cannot create answer",
        PUT: "Cannot update answer",
        DELETE: "Cannot delete answer",
      },
      question: {
        PUT: "Cannot update question",
        DELETE: "Cannot delete question",
      },
    };

    let res;

    if (method !== "DELETE") {
      res = await axios.request({
        url: url[requestField][method],
        method,
        data: payload[requestField][method],
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      });
    } else {
      res = await axios.delete(url[requestField][method], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      });
    }

    if (res.status !== 200) {
      return {
        error: true,
        msg: errorMsg[requestField][method],
      };
    } else {
      return {
        error: false,
        msg: successMsg[requestField][method],
      };
    }
  } catch (error) {
    return { error: true, msg: "Server error" };
  }
}
export { loader as classQuestionPageLoader, action as classQuestionPageAction };
export default ClassQuestionPage;
