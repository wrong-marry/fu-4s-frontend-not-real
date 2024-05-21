import { Paper, Group, Textarea, ActionIcon } from "@mantine/core";
import { TransformedValues, useForm, zodResolver } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { z } from "zod";
import { UserCredentialsContext } from "../../../../store/user-credentials-context";

const EditPersonalInfoInput = ({
  close,
  fieldName,
  zodValidationSchema,
  placeholder,
}: {
  close: () => void;
  fieldName: "email" | "telephone" | "userName";
  zodValidationSchema: z.Schema<any>;
  placeholder?: string;
}) => {
  const { info } = useContext(UserCredentialsContext);

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: zodResolver(zodValidationSchema),
    transformValues: (values) => ({
      actionType: "update-profile",
      userId: String(info?.userId),
      accountType: info?.accountType as string,
      userName:
        fieldName === "userName" ? values.content : (info?.userName as string),
      firstName: info?.firstName,
      lastName: info?.lastName,
      email: fieldName === "email" ? values.content : (info?.email as string),
      telephone:
        fieldName === "telephone"
          ? values.content
          : (info?.telephone as string),
    }),
  });
  const submit = useSubmit();
  const isSubmiting = useNavigation().state === "submitting";

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    submit(values as any, { method: "put" });
    form.reset();
    close();
  };

  useEffect(() => {
    form.initialize({
      content: (info?.[fieldName] as string) || "",
    });
  });
  return (
    <>
      <Paper radius="md" p="xs" shadow="md" className="grow" withBorder>
        <Form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Group>
            <Textarea
              placeholder={placeholder}
              {...form.getInputProps("content")}
              autoFocus
              autosize
              className="grow"
            />
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

export default EditPersonalInfoInput;
