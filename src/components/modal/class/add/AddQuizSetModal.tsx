import { Button, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Form } from "react-router-dom";
import { z } from "zod";
const formValidationSchema = z.object({
  classroomName: z
    .string()
    .min(1, { message: "Class name is required" })
    .max(50, { message: "Class name is too long" }),
});
function AddQuizSetModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const form = useForm({
    initialValues: {
      classroomName: "",
    },
    validate: zodResolver(formValidationSchema),
  });
  const handleSubmit = (values: typeof form.values) => {};
  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit class">
        <Form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            <TextInput
              label="Class name"
              {...form.getInputProps("classroomName")}
            />
            <Button type="submit">Save</Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default AddQuizSetModal;
