import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ClassData, Member } from "../../../../pages/class/ClassPage";
import { SubmitFunction } from "react-router-dom";

const deleteMemberModal = (
  classData: ClassData,
  member: Member,
  submit: SubmitFunction
) => {
  modals.openConfirmModal({
    title: "Confirm member deletion",
    children: (
      <>
        <Text>
          Are you sure you want to remove this member?{" "}
          <Text c={"red"} span inherit fw={"bold"}>
            This action cannot be undone.
          </Text>{" "}
        </Text>
      </>
    ),
    labels: {
      confirm: "Remove",
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
          actionType: "remove-member",
        },
        { method: "delete" }
      );
    },
  });
};

export default deleteMemberModal;
