import { redirect } from "react-router-dom";

export default function logout() {
  localStorage.removeItem("AT");
  localStorage.removeItem("username");
  sessionStorage.clear();
  return redirect("/");
}
