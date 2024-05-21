import { Button, Stack, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import DocumentTitle from "../../document-title/DocumentTitle";

function ForgotPasswordForm({
  setForgotEmail,
}: {
  setForgotEmail: Dispatch<SetStateAction<string>>;
}) {
  DocumentTitle("QuizToast | Forgot Password");
  const submit = useSubmit();
  const actionData = useActionData() as { hasEmail: boolean };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: isEmail("Please enter a valid email"),
    },
  });

  if (actionData?.hasEmail) {
    setForgotEmail(form.values.email);
  }

  return (
    <div className="max-w-screen h-screen">
      <div className="w-9/12 h-screen mx-auto flex items-center justify-center">
        <div className="w-2/3 h-2/3 ">
          <h1 className="text-4xl font-extrabold mb-2">
            Oh no! You forgot your password?
          </h1>
          <h2 className="text-xl italic">
            ... don&apos;t worry, we are here to help!
          </h2>
          <div className="font-light mt-10">
            Enter the email you signed up with. We&apos;ll send you a link to
            log in and reset your password. If you signed up with your
            parent&apos;s email, we&apos;ll send them a link.
          </div>
          <div className="mt-10">
            <Form
              method="post"
              onSubmit={form.onSubmit(() => {
                submit(form.values, { method: "post" });
              })}
            >
              <Stack>
                <TextInput
                  size="md"
                  radius="md"
                  label="enter your email"
                  placeholder="type here"
                  {...form.getInputProps("email")}
                />

                <Button
                  variant="filled"
                  radius="md"
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                >
                  Send email
                </Button>
              </Stack>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
