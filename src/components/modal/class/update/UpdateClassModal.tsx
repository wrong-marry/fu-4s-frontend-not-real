import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Form, useSubmit } from "react-router-dom";
import { ClassData } from "../../../../pages/class/ClassPage";

function UpdateClassModal({
  opened,
  close,
  form,
  classEntity,
}: {
  opened: boolean;
  close: () => void;
  form: UseFormReturnType<{ classroomName: string }>;
  classEntity: ClassData | null;
}) {
  const submit = useSubmit();
  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit class">
        <Form
          onSubmit={form.onSubmit((values) => {
            submit(
              {
                ...values,
                classroomId: classEntity!.classId,
                actionType: "update-classroom",
              },
              {
                method: "put",
              }
            );
            close();
          })}
        >
          <Stack>
            <TextInput
              label="Class name"
              placeholder="Enter classname"
              {...form.getInputProps("classroomName")}
            />
            <Button type="submit">Save</Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateClassModal;
