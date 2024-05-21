import {
  Group,
  Modal,
  Stack,
  Title,
  Text,
  Switch,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import { useContext, useEffect } from "react";
import { StudyModeContext } from "../../../store/study-mode-context";

function LearnSettings({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const { changeLearnShuffled, changeLearnSorted, settings } =
    useContext(StudyModeContext);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Settings"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack>
          <Group className="justify-between">
            <Stack gap={0}>
              <Title order={4}>Sort questions</Title>
              <Text size="sm">Sort the questions alphabetically</Text>
            </Stack>
            <Switch
              size="lg"
              onLabel="ON"
              offLabel="OFF"
              checked={settings.learn.isSorted}
              onChange={(e) => {
                changeLearnSorted(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  changeLearnShuffled(false);
                }
              }}
            />
          </Group>
          <Group className="justify-between">
            <Stack gap={0}>
              <Title order={4}>Shuffle questions</Title>
              <Text size="sm">Shuffle the questions order</Text>
            </Stack>
            <Switch
              size="lg"
              onLabel="ON"
              offLabel="OFF"
              checked={settings.learn.isShuffled}
              onChange={(e) => {
                changeLearnShuffled(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  changeLearnSorted(false);
                }
              }}
            />
          </Group>
          <Divider />
          <UnstyledButton
            className="text-red-500"
            onClick={() => {
              window.location.reload();
            }}
          >
            Restart Learn
          </UnstyledButton>
        </Stack>
      </Modal>
    </>
  );
}

export default LearnSettings;
