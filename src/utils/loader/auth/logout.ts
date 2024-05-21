import { redirect } from "react-router-dom";

export default function logout() {
  localStorage.removeItem("AT");
  localStorage.removeItem("uid");
  sessionStorage.clear();
  return redirect("/");
}
