import { Container, Stack, Title, Divider, Card } from "@mantine/core";
import AvatarInfo from "./personal-info/AvatarInfo";
import Name from "./personal-info/Name";
import Email from "./personal-info/Email";
import AccountType from "./personal-info/AccountType";
import Password from "./security/Password";
import ChangeTheme from "./appearance/ChangeTheme";
import { useEffect } from "react";
import { useActionData } from "react-router-dom";
import { toast } from "react-toastify";
import Username from "./personal-info/Username";
function Settings() {
  const actionData = useActionData() as { error: boolean; msg: string };
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.msg);
    } else {
      toast.success(actionData?.msg);
    }
  }, [actionData]);
  return (
    <>
      <Container size="md">
        <Stack>
          <Stack>
            <Title order={4}>Personal infomation</Title>
            <Card shadow="xs" withBorder p="xl" radius={"md"}>
              <AvatarInfo />
              <Divider my="xl" />
              <Username/>
              <Divider my="xl" />
              <Name />
              <Divider my="xl" />
              <Email />
              <Divider my="xl" />
              <AccountType />
            </Card>
          </Stack>
          <ChangeTheme />
          <Password />
        </Stack>
      </Container>
    </>
  );
}

export default Settings;
