import { Params } from "react-router-dom";
import UpdateQuizForm from "../../../components/quiz/UpdateQuizForm";
import axios from "axios";
import { getCategoriesList } from "../create_form/CreateQuizPage";

const UpdateQuizSet = () => {
  return <UpdateQuizForm />;
};

const loader = async ({ params }: { params: Readonly<Params> }) => {
  const { id } = params;
  try {
    const res = await axios
      .get(`http://localhost:8080/api/v1/quiz/get-quiz?id=${id}`)
      .catch(() => {
        throw new Error("Error while fetching data");
      });
    const res2 = await getCategoriesList();
    return {
      quiz: res.data,
      categories: res2,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
};

const action = async ({ request }: { request: Request }) => {
  try {
    const data = Object.fromEntries(await request.formData());
    const url = `http://localhost:8080/api/v1/quiz/update-quiz`;
    const payload = {
      quizId: Number(data?.quizId),
      categoryId: Number(data?.categoryId),
      userId: Number(data?.userId),
      title: data?.title,
      description: data?.description,
      questions: JSON.parse(data?.questions as string),
    };
    console.log(payload);
    await axios.put(url, payload).catch(() => {
      throw new Error("Cannot update quiz");
    });
    return {
      error: false,
      msg: "Updated",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        msg: error.message,
      };
    }
  }
};
export { loader as UpdateQuizSetLoader, action as UpdateQuizSetAction };
export default UpdateQuizSet;
