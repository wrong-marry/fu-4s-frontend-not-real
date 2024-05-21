import { useSearchParams } from "react-router-dom";
import ClassInvitation from "../../components/class/ClassInvitation";

const ClassInvitationPage = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("id"));
  return <ClassInvitation />;
};

export default ClassInvitationPage;
