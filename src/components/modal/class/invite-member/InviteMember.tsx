import { Button, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { z } from "zod";
import { UserCredentialsContext } from "../../../../store/user-credentials-context";
import { toast } from "react-toastify";

function InviteMember({
  opened,
  close,
  classId,
}: {
  opened: boolean;
  close: () => void;
  classId: number;
}) {
  const fetcher = useFetcher();
  const { info } = useContext(UserCredentialsContext);
  const { data, state } = fetcher;
  const isSubmitting = state === "submitting";
  useEffect(() => {
    if (data?.error) {
      toast.error(data?.msg);
    } else {
      toast.success(data?.msg);
    }
  }, [data]);
  const form = useForm({
    initialValues: {
      emails: "",
    },
    validate: (values) => ({
      emails:
        values.emails.length > 0 &&
        values.emails
          .trim()
          .split(",")
          .every(
            (email) =>
              z.string().email().safeParse(email).success &&
              email !== info?.email
          )
          ? null
          : "Invalid email",
    }),
    transformValues: (values) => ({
      inviteMails: values.emails.trim().split(","),
      classroomId: classId,
      actionType: "invite-member",
    }),
  });
  return (
    <>
      <Modal opened={opened} onClose={close} title="Invite member" centered>
        <fetcher.Form
          onSubmit={form.onSubmit((values) => {
            fetcher.submit(values, {
              method: "post",
            });
          })}
        >
          <Stack>
            <Textarea
              label="Emails"
              description="Enter email of user that you want to invite, separated by comma"
              placeholder="Enter email of user that you want to invite, separated by comma"
              {...form.getInputProps("emails")}
              autosize
              withAsterisk
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Invite
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
}

export default InviteMember;
