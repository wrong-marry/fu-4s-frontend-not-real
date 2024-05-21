import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { TransformedValues, isNotEmpty, useForm } from "@mantine/form";
import { useContext, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { toast } from "react-toastify";
import { UserCredentialsContext } from "../../../../store/user-credentials-context";

function ClassModal({ opened, close }: { opened: boolean; close: () => void }) {
  const { info } = useContext(UserCredentialsContext);
  const fetcher = useFetcher();
  const { data, state, submit } = fetcher;
  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (data?.error) {
      toast.error(data?.msg);
    }
    if (!data?.error) {
      toast.success(data?.msg);
    }
  }, [data]);

  const form = useForm({
    initialValues: {
      className: "",
      classDescription: "",
      allowInvites: false,
    },
    validate: {
      className: isNotEmpty("Class name is required"),
    },
    transformValues: (values) => ({
      actionType: "create-classroom",
      userId: info?.userId as number,
      classroomName: values.className,
      classroomDescription: values.classDescription,
      allowInvites: values.allowInvites,
    }),
  });

  const handleSubmit = (values: TransformedValues<typeof form>) => {
    submit(values, { method: "post", action: "/class/1/sets" });
    form.reset();
    close();
  };
  return (
    <>
      <Modal
        radius={"lg"}
        opened={opened}
        onClose={close}
        centered
        size="xl"
        title="Create a new class"
      >
        <Stack>
          <TextInput
            placeholder="Enter class name (course, teacher, year, section etc.)"
            variant="filled"
            name="className"
            radius={"lg"}
            {...form.getInputProps("className")}
          />
          <TextInput
            placeholder="Enter a description (optional)"
            variant="filled"
            name="classDescription"
            radius={"lg"}
            {...form.getInputProps("classDescription")}
          />
          <Button
            className="self-end"
            variant="filled"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => {
              form.onSubmit(handleSubmit)();
            }}
          >
            Create class
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default ClassModal;
