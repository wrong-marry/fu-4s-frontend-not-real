import { Group, Stack, Title, Button, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { UserCredentialsContext } from "../../../store/user-credentials-context";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import EditPersonalInfoInput from "./edit/EditPersonalInfoInput";
import { fetchAllUser } from "../../../utils/loader/user/user";

const Email = () => {
  const { info } = useContext(UserCredentialsContext);
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  useEffect(() => {
    fetchAllUser().then((data) => {
      setUsersInfo(data);
    });
  }, []);
  const [opened, { open, close }] = useDisclosure();
  const zodValidationSchema = z.object({
    content: z
      .string()
      .email({ message: "Please enter a valid email" })
      .refine((email) => {
        return usersInfo.every((user) => user.email !== email);
      }, "Email is already taken by another user, please choose another one."),
  });
  return (
    <>
      <Group className={!opened ? "justify-between" : ""}>
        <Stack gap={"xs"} className={opened ? "w-full" : ""}>
          <Title order={5}>Email</Title>
          {opened ? (
            <EditPersonalInfoInput
              close={close}
              zodValidationSchema={zodValidationSchema}
              fieldName="email"
            />
          ) : (
            <Text>{`${info?.email}`}</Text>
          )}
        </Stack>
        {!opened && (
          <Button variant="outline" color="orange" onClick={open}>
            Edit
          </Button>
        )}
      </Group>
    </>
  );
};

export default Email;
