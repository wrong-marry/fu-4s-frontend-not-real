import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import StudyModeNavbar from "../../components/navbar/study-mode/StudyModeNavbar";
import { Outlet, useNavigation } from "react-router-dom";

function StudyModeRoot() {
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
      <StudyModeNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default StudyModeRoot;
