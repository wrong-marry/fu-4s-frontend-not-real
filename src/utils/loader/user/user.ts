import axios from "axios";

export async function getUser(uid: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/users/profile/user-id=${uid}`
    );
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Cannot fetch user data at the moment.",
    };
  }
}

export async function fetchAllUser() {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/users/fetch-all"
    );
    return response?.data;
  } catch (error) {
    return {
      error: true,
      message: "Cannot fetch user data at the moment.",
    };
  }
}
