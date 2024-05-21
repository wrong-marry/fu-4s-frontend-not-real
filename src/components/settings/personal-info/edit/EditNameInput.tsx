import { Paper, Group, Textarea, ActionIcon, Stack } from "@mantine/core";
import { useForm, zodResolver, TransformedValues } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { useSubmit, useNavigation, Form } from "react-router-dom";
import { z } from "zod";
import { UserCredentialsContext } from "../../../../store/user-credentials-context";
const EditNameInput = ({
  close,
  zodValidationSchema,
  placeholder,
}: {
  close: () => void;
  zodValidationSchema: z.Schema<any>;
  placeholder?: string;
}) => {
  const { info } = useContext(UserCredentialsContext);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(zodValidationSchema),
    transformValues: (values) => ({
      actionType: "update-profile",
      userId: String(info?.userId),
      accountType: info?.accountType as string,
      userName: info?.userName as string,
      firstName: values.firstName,
      lastName: values.lastName,
      email: info?.email as string,
      telephone: info?.telephone as string,
    }),
  });
  const submit = useSubmit();
  const isSubmiting = useNavigation().state === "submitting";

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    submit(values, { method: "put" });
    form.reset();
    close();
  };

  useEffect(() => {
    form.initialize({
      firstName: info?.firstName as string,
      lastName: info?.lastName as string,
    });
  }, []);
  return (
    <>
      <Paper radius="md" p="xs" shadow="md" className="grow" withBorder>
        <Form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Group>
            <Stack className="grow">
              <Textarea
                label="Firstname"
                placeholder={placeholder || "Enter first name"}
                {...form.getInputProps("firstName")}
                autoFocus
                autosize
                className="grow"
              />
              <Textarea
                label="Lastname"
                placeholder={placeholder || "Enter last name"}
                {...form.getInputProps("lastName")}
                autosize
                className="grow"
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
            <ActionIcon variant="subtle" c="red" type="button" onClick={close}>
              <IconX size={20} />
            </ActionIcon>
          </Group>
        </Form>
      </Paper>
    </>
  );
};

export default EditNameInput;
