import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Form, useSubmit } from "react-router-dom";

const UpdateFolderModal = ({
  opened,
  close,
  form,
}: {
  opened: boolean;
  close: () => void;
  form: UseFormReturnType<{ folderName: string }>;
}) => {
  const submit = useSubmit();
  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit folder">
        <Form
          onSubmit={form.onSubmit((values) =>
            submit(values, { method: "put" })
          )}
        >
          <Stack>
            <TextInput
              label="Folder name"
              placeholder="Enter folder name"
              {...form.getInputProps("folderName")}
            />
            <Button type="submit">Save</Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateFolderModal;
