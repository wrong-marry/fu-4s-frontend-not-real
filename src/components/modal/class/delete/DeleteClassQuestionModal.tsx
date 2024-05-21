import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { SubmitFunction, redirect } from "react-router-dom";
import { Question } from "../../../../pages/class/ClassQuestionPage";
const deleteClassQuestionModal = (
  question: Question,
  submit: SubmitFunction,
  classroomId: string
) => {
  modals.openConfirmModal({
    title: "Confirm deletion",
    children: (
      <>
        <Text>
          Are you sure you want to delete this question?{" "}
          <Text c={"red"} span inherit fw={"bold"}>
            This action cannot be undone.
          </Text>{" "}
        </Text>
      </>
    ),
    labels: {
      confirm: "Delete",
      cancel: "Cancel",
    },
    onCancel: () => {
      return;
    },
    onConfirm: () => {
      submit(
        {
          classroomId: classroomId,
          questionId: question.classQuestionId,
          requestField: "question",
        },
        { method: "delete" }
      );
    },
  });
};

export default deleteClassQuestionModal;
