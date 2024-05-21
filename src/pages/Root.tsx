import { Outlet, useNavigation } from "react-router-dom";
import axios from "axios";
import { nprogress } from "@mantine/nprogress";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useEffect } from "react";
interface FolderRequest {
  folderTitle: string;
}
interface ActionRequest extends FolderRequest {
  action: string;
  userId: number;
}

function Root() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "loading") {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation.state]);
  return (
    <>
      <Navbar />
      <main className="mt-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Root;

export async function action({ request }: { request: Request }) {
  try {
    const data = Object.fromEntries(
      await request.formData()
    ) as unknown as ActionRequest;
    const AT = "Bearer " + localStorage.getItem("AT");
    const action = data.action;
    const payload = {
      folderName: data.folderTitle,
      userId: Number(localStorage.getItem("uid")),
    };

    if (action === "create-folder") {
      await axios
        .post("http://localhost:8080/api/v1/folder/create-folder", payload, {
          headers: {
            Authorization: AT,
          },
        })
        .catch(() => {
          throw new Error("Something went wrong");
        });
      return {
        success: true,
        msg: "Folder created successfully",
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
