import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { SubmitFunction } from "react-router-dom";
const deleteClassModal = (classroomId: number, submit: SubmitFunction) => {
  modals.openConfirmModal({
    title: "Confirm class deletion",
    children: (
      <>
        <Text>
          Are you sure you want to delete this class?{" "}
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
        { classroomId: classroomId, actionType: "delete-classroom" },
        { method: "delete", action: "/class/1/sets" }
      );
    },
  });
};

export default deleteClassModal;
