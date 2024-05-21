import { Paper, Group, Textarea, ActionIcon } from "@mantine/core";
import { TransformedValues, useForm, zodResolver } from "@mantine/form";
import { IconSend, IconX } from "@tabler/icons-react";
import { Form, SubmitFunction } from "react-router-dom";
import { z } from "zod";
import { Comments } from "../../../../pages/class/ClassQuestionPage";
interface EditCommentProps {
  submit: SubmitFunction;
  toggleEditComment: (commentId: number, comment: Comments) => void;
  commentId: number;
  comment: Comments;
}
const formValidationSchema = z.object({
  editComment: z
    .string()
    .max(2000, "Comment must be less than 2000 characters")
    .min(1, "Comment is required"),
});
function EditCommentInput({
  commentId,
  toggleEditComment,
  submit,
  comment,
}: EditCommentProps) {
  const form = useForm({
    initialValues: {
      editComment: comment.content,
    },
    validate: zodResolver(formValidationSchema),
    transformValues: (values) => ({
      requestField: "comment",
      content: values.editComment,
      commentId: commentId,
    }),
  });
  const handleEditCommentSubmit = (values: TransformedValues<typeof form>) => {
    submit({ ...values }, { method: "put" });
    form.setFieldValue("editComment", "");
    toggleEditComment(commentId, comment);
  };
  return (
    <>
      <Paper radius="md" p="xs" shadow="md" className="grow">
        <Form
          onSubmit={form.onSubmit((values) => {
            handleEditCommentSubmit(values);
          })}
        >
          <Group>
            <Textarea
              placeholder="Edit comment"
              {...form.getInputProps("editComment")}
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
              onClick={() => toggleEditComment(commentId, comment)}
            >
              <IconX size={20} />
            </ActionIcon>
          </Group>
        </Form>
      </Paper>
    </>
  );
}

export default EditCommentInput;
