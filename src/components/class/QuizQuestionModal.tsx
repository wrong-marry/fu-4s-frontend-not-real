import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { TransformedValues, isNotEmpty, useForm } from "@mantine/form";
import { useContext } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { UserCredentialsContext } from "../../store/user-credentials-context";
interface SubmitFields {
  title: string;
  content: string;
}
function QuizQuestionModal({
  opened,
  close,
  classId,
}: {
  opened: boolean;
  close: () => void;
  classId: number;
}) {
  const { info } = useContext(UserCredentialsContext);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm<SubmitFields>({
    initialValues: {
      title: "",
      content: "",
    },
    validate: {
      title: isNotEmpty("Question title is required"),
      content: isNotEmpty("Question description is required"),
    },
    transformValues: (values) => ({
      ...values,
      userId: info?.userId,
      classroomId: classId,
      actionType: "create-class-discussion-question",
    }),
  });

  type Transformed = TransformedValues<typeof form>;

  const handleSubmit = (values: Transformed) => {
    submit(
      {
        ...values,
      },
      {
        method: "post",
      }
    );
  };
  return (
    <>
      <Modal
        radius={"lg"}
        opened={opened}
        onClose={close}
        centered
        size="xl"
        title="Create new question"
      >
        <Form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              placeholder="Enter question title"
              variant="filled"
              {...form.getInputProps("title")}
            />
            <TextInput
              placeholder="Enter a description"
              variant="filled"
              name="content"
              {...form.getInputProps("content")}
            />
            <Button
              className="self-end"
              variant="filled"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Create question
            </Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default QuizQuestionModal;
