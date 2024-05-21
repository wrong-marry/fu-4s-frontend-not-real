import { Button, PasswordInput, Stack } from "@mantine/core";
import { matches, matchesField, useForm } from "@mantine/form";
import { Form, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { toast } from "react-toastify";
import DocumentTitle from "../../document-title/DocumentTitle";
function ResetPasswordForm({ token }: { token: string }) {
  DocumentTitle("QuizToast | Reset Password");
  const submit = useSubmit();
  const actionData = useActionData() as { success: boolean, msg: string };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validate: {
      newPassword: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
      confirmNewPassword: matchesField("newPassword", "Passwords are not the same"),
    },
  })

  if (actionData?.success) {
    toast.success(actionData.msg);
  }
  return (
    <div className="max-w-screen h-screen">
      <div className="w-9/12 h-screen mx-auto flex items-center justify-center">
        <div className="w-2/3 h-2/3 ">
          <h1 className="text-4xl font-extrabold mb-2">
            Time to reset your password :)
          </h1>
          <h2 className="font-thin text-base italic">
            ... don&apos;t forget it, as it&apos;s important!
          </h2>
          <div className="font-light mt-10"></div>
          <Form method="post" onSubmit={form.onSubmit(() => submit({ token, ...form.values }, { method: "post" }))}>
            <Stack gap={"md"}>
              <PasswordInput
                radius="md"
                size="md"
                label="new password"
                withAsterisk
                placeholder="type new password"
                {...form.getInputProps("newPassword")}
              />

              <PasswordInput
                size="md"
                radius="md"
                label="confirm new password"
                withAsterisk
                placeholder="confirm your new password"
                {...form.getInputProps("confirmNewPassword")}
              />

              <Button variant="filled" radius="md" type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting}>
                Confirm
              </Button>
            </Stack>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
