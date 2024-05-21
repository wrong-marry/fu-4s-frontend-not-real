import axios from "axios";
export async function forgotPasswordAction({ request }: { request: Request }) {
  try {
    const data = Object.fromEntries(await request.formData());
    console.log(data);
    let response;
    if (data?.email) {
      response = await axios
        .post("http://localhost:8080/api/v1/auth/reset-password-request", data)
        .catch(() => {
          throw new Error("Cannot send email at the moment.");
        });
    }
    return response?.data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
}

export async function resetPasswordAction({ request }: { request: Request }) {
  try {
    const data = Object.fromEntries(await request.formData());
    console.log(data);
    const { token, newPassword } = data;
    const response = await axios
      .post(`http://localhost:8080/api/v1/auth/reset-password?token=${token}`, {
        newPassword: newPassword,
      })
      .catch(() => {
        throw new Error("Cannot reset your password!");
      });

    return response?.data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
}
