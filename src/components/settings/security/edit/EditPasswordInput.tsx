import { ActionIcon, Group, Paper, PasswordInput, Stack } from "@mantine/core";
import { isNotEmpty, matches, matchesField, useForm } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { Form, useNavigation, useSubmit } from "react-router-dom";

const EditPasswordInput = ({ close }: { close: () => void }) => {
  const isSubmiting = useNavigation().state === "submitting";
  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      currentPassword: isNotEmpty("Current password is required"),
      newPassword: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
      confirmPassword: matchesField("newPassword", "Passwords do not match"),
    },
    transformValues: (values) => ({
      actionType: "update-password",
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    }),
  });
  return (
    <>
      <Paper radius="md" p="xs" shadow="md" className="grow" withBorder>
        <Form
          onSubmit={form.onSubmit((values) => {
            submit(values as any, { method: "patch" });
          })}
        >
          <Group>
            <Stack className="grow">
              <PasswordInput
                {...form.getInputProps("currentPassword")}
                placeholder="Enter current password"
                label="Current password"
              />
              <PasswordInput
                {...form.getInputProps("newPassword")}
                placeholder="Enter new password"
                label="New password"
              />
              <PasswordInput
                {...form.getInputProps("confirmPassword")}
                placeholder="Confirm new password"
                label="Confirm new password"
              />
            </Stack>
            <ActionIcon
              variant="subtle"
              type="submit"
              loading={isSubmiting}
              disabled={isSubmiting}
            >
              <IconSend size={20} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              c="red"
              type="button"
              onClick={() => {
                close();
              }}
            >
              <IconX size={20} />
            </ActionIcon>
          </Group>
        </Form>
      </Paper>
    </>
  );
};

export default EditPasswordInput;
