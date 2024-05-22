import { upperFirst } from "@mantine/hooks";
import { isEmail, matches, matchesField, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Stack,
  Container,
} from "@mantine/core";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import DocumentTitle from "../../document-title/DocumentTitle";

interface ResData {
  error: boolean | string | null;
  message: string;
  errorField: string;
}

export default function AuthForm(props: PaperProps) {
  const submit = useSubmit();
  const data: ResData | undefined = useActionData() as ResData | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";
  DocumentTitle(`FU-4S | ${upperFirst(isLogin ? "Login" : "Register")}`);

  let validationLogin = () => {
    return {
      username: (value:string) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      password: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
    };
  };

  let validationRegister = () => {
    return {
      email: isEmail("Please enter a valid email"),
      password: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
      confirmPassword: matchesField("password", "Passwords are not the same"),
    };
  };

  const form = useForm({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },

    validate: isLogin ? validationLogin() : validationRegister(),
  });

  const assignRegisterPayload = (formFieldData: any) => {
    return {
      firstname: formFieldData.firstname,
      lastname: formFieldData.lastname,
      email: formFieldData.email,
      password: formFieldData.password,
      username: formFieldData.username,
    };
  };

  const assignLoginPayload = (formFieldData: any) => {
    return {
      username: formFieldData.username,
      password: formFieldData.password,
    };
  };

  useEffect(() => {
    if (data?.error) {
      if (Array.isArray(data.errorField)) {
        data.errorField.forEach((e: any) => {
          form.setFieldError(e, data?.message);
          toast.error(data?.message);
        });
      }
      toast.error(data?.message);
    }
  }, [data]);

  return (
    <>
      <Container size="xs" h={"100vh"}>
        <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500} className="mb-3">
            {isLogin
              ? "Login to your FU-4S account"
              : "Create new FU-4S account"}
          </Text>

          {/* <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
            <TwitterButton radius="xl">Twitter</TwitterButton>
          </Group> */}
{/* 
          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          /> */}

          <Form
            method="post"
            onSubmit={form.onSubmit(() => {
              submit(
                isLogin
                  ? assignLoginPayload(form.values)
                  : assignRegisterPayload(form.values),
                { method: "post" }
              );
            })}
          >
            <Stack>
              {!isLogin && (
                <>
                  <Group grow>
                    <TextInput
                      required
                      label="Firstname"
                      placeholder="Your first name"
                      radius="md"
                      name="firstName"
                      {...form.getInputProps("firstname")}
                    />
                    <TextInput
                      required
                      label="Lastname"
                      placeholder="Your last name"
                      radius="md"
                      name="lastname"
                      {...form.getInputProps("lastname")}
                    />
                  </Group>

                  <TextInput
                      label="Email"
                      placeholder="youremail@domain"
                      radius="md"
                      name="email"
                      {...form.getInputProps("email")}
                  />
                </>
              )}

              <TextInput
                  required
                  label="Username"
                  placeholder="Your username"
                  radius="md"
                  name="username"
                  {...form.getInputProps("username")}
              />


              <PasswordInput
                label="Password"
                placeholder="Your password"
                radius="md"
                name="password"
                {...form.getInputProps("password")}
                description={
                  !isLogin
                    ? "from 8 to 32 characters, at least 1 number, 1 symbol, 1 uppercase letter and 1 lowercase letter"
                    : null
                }
              />
              {!isLogin && (
                <PasswordInput
                  required
                  label="Confirm password"
                  placeholder="Your password"
                  radius="md"
                  name="confirmPassword"
                  {...form.getInputProps("confirmPassword")}
                />
              )}

              {/* {!isLogin && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  {...form.getInputProps("terms", { type: "checkbox" })}
                />
              )} */}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Stack>
                <Link
                  to={`?mode=${isLogin ? "register" : "login"}`}
                  className="text-blue-600 text-sm"
                  onClick={() => form.reset()}
                >
                  {!isLogin
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </Link>
                <Link
                  to="/forgotten"
                  className="text-blue-600 text-sm"
                  onClick={() => form.reset()}
                >
                  Forgot your password?
                </Link>
              </Stack>
              <Button type="submit" radius="xl" loading={isSubmitting}>
                {upperFirst(isLogin ? "Login" : "Register")}
              </Button>
            </Group>
          </Form>
        </Paper>
      </Container>
    </>
  );
}
