import { Group, Stack, Title, Button, Text } from "@mantine/core";
import { useContext } from "react";
import {
  UserCredentialsContext,
} from "../../../store/user-credentials-context";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import EditNameInput from "./edit/EditNameInput";
const Name = () => {
  const { info } = useContext(UserCredentialsContext);
  const [opened, { open, close }] = useDisclosure();
  const zodValidationSchema = z.object({
    firstName: z
      .string()
      .min(1, { message: "Firstname cannot be empty" })
      .max(20, { message: "Firstname is too long" }),
    lastName: z
      .string()
      .min(1, { message: "Lastname cannot be empty" })
      .max(20, { message: "Lastname is too long" }),
  });
  return (
    <>
      <Group className={!opened ? "justify-between" : ""}>
        <Stack gap={"xs"} className={opened ? "w-full" : ""}>
          <Title order={5}>Name</Title>
          {opened ? (
            <EditNameInput
              close={close}
              zodValidationSchema={zodValidationSchema}
            />
          ) : (
            <Text>{`${info?.firstName} ${info?.lastName}`}</Text>
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

export default Name;
