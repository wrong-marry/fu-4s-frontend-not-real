import { Paper, Group, Textarea, ActionIcon } from "@mantine/core";
import { TransformedValues, useForm, zodResolver } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { Form, useSubmit } from "react-router-dom";
import { z } from "zod";
import {
  Comments,
  RepliesComment,
} from "../../../../pages/class/ClassQuestionPage";

interface Props {
  toggler: (id: number, object: RepliesComment | Comments) => void;
  object: RepliesComment | Comments;
  requestField: string;
}
const formValidationSchema = z.object({
  edit: z
    .string()
    .max(2000, "Must be less than 2000 characters")
    .min(1, "Content is required"),
});
function EditInput({ toggler, object, requestField }: Props) {
  const submit = useSubmit();
  const decider =
    requestField === "comment"
      ? { commentId: object.commentId }
      : {
          replyCommentId: (object as RepliesComment).replyCommentId as number,
        };
  const form = useForm({
    initialValues: {
      edit: object.content,
    },
    validate: zodResolver(formValidationSchema),
    transformValues: (values) => ({
      requestField: requestField,
      content: values.edit,
    }),
  });

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    const payload = {
      ...values,
      ...decider,
    };
    submit(payload as any, { method: "put" });
    form.setFieldValue("edit", "");
    toggler(object.commentId, object);
  };
  return (
    <Paper radius="md" p="xs" shadow="md" className="grow">
      <Form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Group>
          <Textarea
            placeholder="Edit reply"
            {...form.getInputProps("edit")}
            autoFocus
            autosize
            className="grow"
          />
          <ActionIcon variant="subtle" type="submit">
            <IconSend size={20} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            c="red"
            onClick={() => {
              toggler(object.commentId, object);
            }}
          >
            <IconX size={20} />
          </ActionIcon>
        </Group>
      </Form>
    </Paper>
  );
}

export default EditInput;
