import { modals } from "@mantine/modals";
import { SubmitFunction } from "react-router-dom";
import { ClassData, Member } from "../../../../pages/class/ClassPage";
import { Text } from "@mantine/core";

const leaveClassModal = (
  classData: ClassData,
  member: Member,
  submit: SubmitFunction
) => {
  modals.openConfirmModal({
    title: "Confirm member deletion",
    children: (
      <>
        <Text>
          Are you sure you want to leave this class?{" "}
          <Text c={"red"} span inherit fw={"bold"}>
            This action cannot be undone.
          </Text>{" "}
        </Text>
      </>
    ),
    labels: {
      confirm: "Leave",
      cancel: "Cancel",
    },
    onCancel: () => {
      return;
    },
    onConfirm: () => {
      submit(
        {
          classroomId: classData.classId,
          userId: member.userId,
          actionType: "leave-class",
        },
        { method: "delete" }
      );
    },
  });
};

export default leaveClassModal;
