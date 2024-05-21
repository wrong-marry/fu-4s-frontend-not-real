import { useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../../../components/authentication/ForgotPassword/ResetPasswordForm";
import { checkForgotEmailToken } from "../../../utils/check/check";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return <>
    {checkForgotEmailToken(token) ? <ResetPasswordForm token={token} /> : () => {
      throw new Response("Invalid token", { status: 404 });
    }}
  </>;
}

export default ResetPassword;
