import axios from "axios";
import { Params, useParams } from "react-router-dom";
import Folder from "../../components/folder/Folder";
export interface StudySet {
  testId: number;
  numberOfQuestion: number;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  testName: string;
  createdAt: Date;
}
export interface FolderData {
  folderId: number;
  folderName: string;
  numberOfTestSet: number;
  authorName: string;
  authorId: number;
  createdAt: string;
}
export interface UserCreatedStudySet {
  userId: number;
  testId: number;
  userName: string;
  userFirstName: string;
  userLastName: string;
  categoryId: number;
  testName: string;
  rate: number;
  numberOfQuestions: number;
  createAt: Date;
  view: number;
  timeRecentViewTest: Date;
}

interface RequestParams {
  folderId: string;
  folderName: string;
  userId: number;
}

export async function fetchFolderData(folderId: number) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/folder/folder-id=${folderId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching folders");
  }
}
export async function fetchStudySetsData(folderId: number) {
  try {
    const response = await axios
      .get(
        `http://localhost:8080/api/v1/folder/test-belong-folder/folder-id=${folderId}`
      )
      .catch(() => {
        return null;
      });
    return response?.data?.entityResponses;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchUserCreatedStudySetsData(userId: number) {
  try {
    const response = await axios
      .get(
        `http://localhost:8080/api/v1/test/get-test-create-by-user/user-id=${userId}`
      )
      .catch(() => {
        return null;
      });
    return response?.data;
  } catch (error) {
    throw new Error("Error fetching user created study sets");
  }
}
function FolderPage() {
  const { id } = useParams();

  return <Folder folderId={Number(id)} />;
}

async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const { folderId, folderName, userId } = Object.fromEntries(
      formData
    ) as unknown as RequestParams;
    const { method } = request;

    const url = {
      POST: "",
      PUT: `http://localhost:8080/api/v1/folder/update/folder-id=${folderId}`,
      DELETE: `http://localhost:8080/api/v1/folder/delete/folder-id=${folderId}`,
    };

    const payload = {
      POST: {},
      PUT: {
        folderName: folderName,
        userId: userId,
      },
    };

    const successMsg = {
      POST: "",
      PUT: "Updated successfully",
      DELETE: "Deleted successfully",
    };
    const errorMsg = {
      POST: "",
      PUT: "Update failed",
      DELETE: "Delete failed",
    };

    let res = null;

    if (method !== "DELETE") {
      res = await axios.request({
        method,
        url: url[method as keyof typeof url],
        data: payload[method as keyof typeof payload],
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      });
    } else if (method === "DELETE") {
      res = await axios.request({
        method,
        url: url[method as keyof typeof url],
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

async function loader({ params }: { params: Readonly<Params> }) {
  try {
    const { id } = params;
    const folder = await fetchFolderData(Number(id));
    const studySets = await fetchStudySetsData(Number(id));
    const userCreatedStudySets = await fetchUserCreatedStudySetsData(
      Number(id)
    );
    return { folder, studySets, userCreatedStudySets };
  } catch (error) {
    console.log(error);
  }
}

export { action as folderPageAction, loader as folderPageLoader };
export default FolderPage;
