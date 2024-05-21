import {
  Modal,
  Stack,
  Button,
  Select,
  Paper,
  Group,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const AddQuizSetsModal = ({
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
          <div className="p-4">
            <Modal.Header>
              <Modal.Title className="font-bold text-size text-2xl">
                Add quiz sets
              </Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
          </div>

          <Modal.Body>
            <Stack p={"xl"}>
              <Button variant="subtle" size="sm" leftSection={<IconPlus />}>
                Create new sets
              </Button>
              <div>
                <Select
                  className="w-1/4"
                  checkIconPosition="right"
                  data={["Your sets", "Folder sets", "Study sets"]}
                  defaultValue={"Your sets"}
                  allowDeselect={false}
                />
              </div>
              <Paper shadow="lg" radius="md" withBorder p="xl" className="py-4">
                <Group className="justify-between">
                  <Text className="font-bold text-lg">Quiz Set 1</Text>
                  <Button variant="default" size="sm" radius="md">
                    <IconPlus size={12} />
                  </Button>
                </Group>
              </Paper>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default AddQuizSetsModal;
