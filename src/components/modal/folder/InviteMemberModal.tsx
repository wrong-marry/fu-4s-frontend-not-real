import { Modal, JsonInput, Button, Text } from "@mantine/core";
import { IconXboxX } from "@tabler/icons-react";

const InviteMemberModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  return (
    <>
      <Modal.Root opened={opened} onClose={close} centered size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <div className="modal-header bg-blue-600 p-4">
            <Modal.Header className="bg-blue-600 p-4">
              <Modal.Title className="text-white font-bold text-size text-3xl">
                Invite members
              </Modal.Title>
              <Modal.CloseButton
                icon={
                  <IconXboxX
                    size={60}
                    stroke={1.5}
                    className="hover:text-red-500"
                  />
                }
                className="text-white bg-blue-600"
              />
            </Modal.Header>
          </div>
          <Modal.Body>
            <Text className="my-5 mx-4">
              To invite members to this class, add their FU-4S usernames or
              emails below (separate by commas or line breaks).
            </Text>
            <JsonInput
              className="my-5 mx-4"
              size="lg"
              placeholder="Enter usernames or email addresses (separated by commas or new lines)"
              validationError="Invalid JSON"
              formatOnBlur
              autosize
              minRows={4}
            />
            <div className="flex justify-end">
              <Button
                className="mb-5 mx-4 w-[100%] h-[50px] rounded-xl"
                variant="filled"
              >
                Send invites
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default InviteMemberModal;
