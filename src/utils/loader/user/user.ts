import axios from "axios";

export async function getUser(username: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/users/profile/${username}`,{
          headers: {
            Authorization: "Bearer " + localStorage.getItem("AT"),
          },
        }
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
