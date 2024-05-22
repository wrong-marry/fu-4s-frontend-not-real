import { redirect } from "react-router-dom";
import { getUser } from "../user/user";

export function getAuthCredentials() {
  const authToken = getAuthToken();
  const username = getAuthUsername();

  if (!authToken || !username) {
    return null;
  }
  return getUser(username);
}

export async function checkAuth() {
  const authCredentials = await getAuthCredentials();
  if (authCredentials === null || authCredentials?.error === true) {
    return redirect("/auth?mode=login");
  }
  return null;
}

export async function preventAuth() {
  if (isLoggedIn()) {
    return redirect("/home");
  }
  return null;
}

export function isLoggedIn() {
  const authToken = getAuthToken();
  const userId = getAuthUsername();
  if (!authToken || !userId) {
    return false;
  }
  return true;
}

export function getAuthToken() {
  return localStorage.getItem("AT");
}

export function getAuthUsername() {
  return localStorage.getItem("username");
}

export function assignLoginPayload(formFieldData: any) {
  return {
    username: formFieldData.username,
    password: formFieldData.password,
  };
}

export function assignRegisterPayload(formFieldData: any) {
  return {
    firstName: formFieldData.firstName,
    lastName: formFieldData.lastName,
    email: formFieldData.email,
    password: formFieldData.password,
    username: formFieldData.username
  };
}
