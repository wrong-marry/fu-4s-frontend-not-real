import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { toast } from "react-toastify";

function FolderModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const fetcher = useFetcher();
  const { data, state } = fetcher;
  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.msg);
    }
    if (!data?.success) {
      toast.error(data?.msg);
    }
    setTimeout(() => {
      close();
    }, 1000);
  }, [data]);

  const form = useForm({
    initialValues: {
      folderTitle: "",
      folderDescription: "",
    },
    validate: {
      folderTitle: isNotEmpty("Folder title is required"),
    },
  });
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="xl"
        title="Create a new folder"
      >
        <fetcher.Form
          onSubmit={form.onSubmit(() => {
            fetcher.submit(
              {
                folderTitle: form.values.folderTitle,
                folderDescription: form.values.folderDescription,
                action: "create-folder",
              },
              { method: "post" }
            );
            form.reset();
          })}
        >
          <Stack gap={"md"}>
            <TextInput
              placeholder="Enter folder title"
              name="folderTitle"
              {...form.getInputProps("folderTitle")}
            />
            <TextInput
              placeholder="Enter a description (optional)"
              name="folderDescription"
              {...form.getInputProps("folderDescription")}
            />
            <Button
              className="self-end"
              type="submit"
              name="action"
              value="create-folder"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create folder
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
}

export default FolderModal;
