import { Params } from "react-router-dom";
import UpdateTestForm from "../../../components/test/UpdateTestForm";
import axios from "axios";
import { getCategoriesList } from "../create_form/CreateTestPage";

const UpdateTestSet = () => {
  return <UpdateTestForm />;
};

const loader = async ({ params }: { params: Readonly<Params> }) => {
  const { id } = params;
  try {
    const res = await axios
      .get(`http://localhost:8080/api/v1/test/get-test?id=${id}`)
      .catch(() => {
        throw new Error("Error while fetching data");
      });
    const res2 = await getCategoriesList();
    return {
      test: res.data,
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
    const url = `http://localhost:8080/api/v1/test/update-test`;
    const payload = {
      testId: Number(data?.testId),
      categoryId: Number(data?.categoryId),
      userId: Number(data?.userId),
      title: data?.title,
      description: data?.description,
      questions: JSON.parse(data?.questions as string),
    };
    console.log(payload);
    await axios.put(url, payload).catch(() => {
      throw new Error("Cannot update test");
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
export { loader as UpdateTestSetLoader, action as UpdateTestSetAction };
export default UpdateTestSet;
