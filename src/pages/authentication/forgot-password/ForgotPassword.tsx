
import ForgotPasswordForm from "../../../components/authentication/ForgotPassword/ForgotPasswordForm";
import { useState } from "react";
import Sent from "../../../components/authentication/ForgotPassword/Sent";


function ForgotPassword() {
  const [forgotEmail, setForgotEmail] = useState("");

  if (forgotEmail) {
    return <Sent forgotEmail={forgotEmail}/>
  }

  return <ForgotPasswordForm setForgotEmail={setForgotEmail} />;
}

export default ForgotPassword;
