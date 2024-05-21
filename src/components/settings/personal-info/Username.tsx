import { Group, Stack, Title, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { UserCredentialsContext } from "../../../store/user-credentials-context";
import EditPersonalInfoInput from "./edit/EditPersonalInfoInput";
import { fetchAllUser } from "../../../utils/loader/user/user";

const Username = () => {
  const { info } = useContext(UserCredentialsContext);
  const [opened, { open, close }] = useDisclosure();
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  useEffect(() => {
    fetchAllUser().then((data) => {
      setUsersInfo(data);
    });
  }, []);
  const zodValidationSchema = z.object({
    content: z
      .string()
      .min(1, { message: "Username cannot be empty" })
      .max(20, { message: "Username is too long" })
      .refine((userName) => {
        return usersInfo.every((user) => user.userName !== userName);
      }, "Username is already taken by another user, please choose another one."),
  });
  return (
    <>
      <Group className={!opened ? "justify-between" : ""}>
        <Stack gap={"xs"} className={opened ? "w-full" : ""}>
          <Title order={5}>Username</Title>
          {opened ? (
            <EditPersonalInfoInput
              close={close}
              zodValidationSchema={zodValidationSchema}
              fieldName="userName"
            />
          ) : (
            <Text>{`${info?.userName}`}</Text>
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

export default Username;
