import { Stack, Title, Card, Group, Select, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";

const ChangeTheme = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  return (
    <>
      <Stack>
        <Title order={4}>Appearance</Title>
        <Card shadow="xs" withBorder p="xl" radius={"md"}>
          <Group className="justify-between">
            <Title order={5}>Theme</Title>
            <Select
              value={computedColorScheme === "dark" ? "Dark" : "Light"}
              data={["Light", "Dark"]}
              allowDeselect={false}
              onChange={toggleColorScheme}
            />
          </Group>
        </Card>
      </Stack>
    </>
  );
};

export default ChangeTheme;
