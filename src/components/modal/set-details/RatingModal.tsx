import { Button, Modal, Rating, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { toast } from "react-toastify";
import { UserRating } from "../../../pages/test/set/SetDetails";

function RatingModal({
  opened,
  close,
  isRated,
  testId,
  userId,
  setUserRating,
}: {
  opened: boolean;
  close: () => void;
  isRated: boolean | undefined;
  testId: number;
  userId: number;
  setUserRating: React.Dispatch<React.SetStateAction<UserRating>>;
}) {
  const submit = useSubmit();
  const actionData = useActionData() as { success: boolean; msg: string };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const action = isRated ? "update-rating" : "create-rating";
  const method = isRated ? "put" : "post";

  const form = useForm({
    initialValues: {
      rate: 1,
    },
    validate: {
      rate: (val) => (val === 0 ? "Rating is required" : null),
    },
  });

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData?.msg);
    }
    if (!actionData?.success) {
      toast.error(actionData?.msg);
    }
    setTimeout(() => {
      close();
    }, 1500);
  }, [actionData]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="How satisfied are you with this set?"
      >
        <Form
          onSubmit={form.onSubmit(() => {
            submit(
              {
                ...form.values,
                action: action,
                userId: userId,
                testId: testId,
              },
              { method: method }
            );
            setUserRating((prev) => ({
              ...prev,
              rate: form.values.rate,
              isRated: true,
            }));
          })}
        >
          <Stack>
            <Rating
              defaultValue={1}
              fractions={2}
              {...form.getInputProps("rate")}
              className="self-center"
              size={"lg"}
            />
            <Button
              variant="filled"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default RatingModal;
