import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

const DeleteModal = ({ handleDelete }: { handleDelete: () => void }) => {
  openConfirmModal({
    title: "Confirm your deletion",
    children: <Text>Are you sure you want to delete this set?</Text>,
    labels: { confirm: "Delete", cancel: "Cancel" },
    onConfirm: () => {
      handleDelete();
    },
    onCancel: () => {},
  });
};

export default DeleteModal;
