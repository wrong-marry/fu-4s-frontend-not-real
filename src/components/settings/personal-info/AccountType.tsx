import { Group, Title, Select } from "@mantine/core";
import { useContext } from "react";
import { UserCredentialsContext } from "../../../store/user-credentials-context";
import { useSubmit } from "react-router-dom";

const AccountType = () => {
  const { info } = useContext(UserCredentialsContext);
  const submit = useSubmit();
  return (
    <>
      <Group className="justify-between">
        <Title order={5}>Account type</Title>
        <Select
          defaultValue={info?.accountType as string}
          data={["Student", "Teacher"]}
          allowDeselect={false}
          placeholder="Select account type"
          onChange={(value) => {
            submit(
              {
                actionType: "update-profile",
                userId: String(info?.userId),
                accountType: value,
                userName: info?.userName as string,
                firstName: info?.firstName,
                lastName: info?.lastName,
                email: info?.email as string,
                telephone: info?.telephone as string,
              } as any,
              { method: "put" }
            );
          }}
        />
      </Group>
    </>
  );
};

export default AccountType;
