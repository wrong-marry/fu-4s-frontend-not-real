import { Button, Card, Group, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditPasswordInput from "./edit/EditPasswordInput";

const Password = () => {
  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <Stack>
        <Title order={4}>Account and privacy</Title>
        <Card shadow="xs" withBorder p="xl" radius={"md"}>
          {opened ? (
            <EditPasswordInput close={close} />
          ) : (
            <Group className="justify-between">
              <Title order={5}>Password</Title>
              <Button variant="outline" color="orange" onClick={open}>
                Edit
              </Button>
            </Group>
          )}
        </Card>
      </Stack>
    </>
  );
};

export default Password;
