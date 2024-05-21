import {
  Paper,
  Group,
  Textarea,
  ActionIcon,
  Stack,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Form, useParams, useSubmit } from "react-router-dom";
import { z } from "zod";
import { Question } from "../../../../pages/class/ClassQuestionPage";
interface Props {
  question: Question | null;
  setEditDiscussion: React.Dispatch<React.SetStateAction<boolean>>;
}
const formValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(750, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content is too long"),
});
const EditDiscussion = ({ question, setEditDiscussion }: Props) => {
  const { id: classId } = useParams();
  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: zodResolver(formValidationSchema),
    transformValues: (values) => ({
      title: values.title,
      content: values.content,
      classroomId: classId,
      questionId: question?.classQuestionId,
    }),
  });

  useEffect(() => {
    if (question) {
      form.initialize({
        title: question.title,
        content: question.content,
      });
    }
  }, [question]);
  return (
    <>
      <Paper radius="md" p="xs" shadow="md" className="grow">
        <Form
          onSubmit={form.onSubmit((values) => {
            submit(
              {
                ...(values as {}),
                requestField: "question",
              },
              { method: "put" }
            );
            setEditDiscussion(false);
          })}
        >
          <Group>
            <Stack className="grow">
              <Textarea
                label="Title"
                placeholder="Edit title"
                {...form.getInputProps("title")}
                autoFocus
                autosize
                className="grow"
              />

              <Textarea
                label="Content"
                placeholder="Edit title"
                {...form.getInputProps("content")}
                autosize
                className="grow"
              />
            </Stack>
            <Center>
              <ActionIcon variant="subtle" type="submit">
                <IconSend size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                c="red"
                onClick={() => {
                  setEditDiscussion(false);
                }}
              >
                <IconX size={20} />
              </ActionIcon>
            </Center>
          </Group>
        </Form>
      </Paper>
    </>
  );
};

export default EditDiscussion;
