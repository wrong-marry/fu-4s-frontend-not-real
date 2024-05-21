import {
  Paper,
  Group,
  Avatar,
  Badge,
  Text,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { ClassData, Member } from "../../../../pages/class/ClassPage";
import { IconDots, IconLogout, IconTrash } from "@tabler/icons-react";
import deleteMemberModal from "../../../modal/class/delete/DeleteMemberModal";
import { useSubmit } from "react-router-dom";
import { useContext } from "react";
import { UserCredentialsContext } from "../../../../store/user-credentials-context";
import leaveClassModal from "../../../modal/class/delete/LeaveClassModal";

const MemberList = ({
  members,
  classData,
}: {
  members: Member[];
  classData: ClassData;
}) => {
  const submit = useSubmit();
  const { info } = useContext(UserCredentialsContext);
  const teacherCard = members?.find(
    (member) => member.userId === classData?.teacherId
  );
  const rows = members
    ?.filter((member) => member.userId !== classData?.teacherId)
    ?.map((member, index) => (
      <Paper
        key={index}
        className="mt-3"
        shadow="lg"
        radius="md"
        withBorder
        p="lg"
      >
        <Group className="justify-between">
          <Group>
            <Avatar
              src={null}
              alt={`Avatar of ${member.userFirstName} ${member.userLastName}`}
              size={"sm"}
            >
              {`${member.userFirstName
                .charAt(0)
                .toUpperCase()}${member.userLastName.charAt(0).toUpperCase()}`}
            </Avatar>
            <Text className="font-semibold text-sm">
              {`${member.userFirstName} ${member.userLastName}`}
            </Text>
            <Badge
              color={classData?.teacherId === member.userId ? "orange" : "blue"}
              autoContrast
            >
              {classData?.teacherId === member.userId ? "Teacher" : "Student"}
            </Badge>
            <Text className="text-sm" c={"dimmed"}>
              {`As know as ${member.userName}`}
            </Text>
          </Group>
          {classData?.teacherId === info?.userId ? (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => {
                    deleteMemberModal(classData, member, submit);
                  }}
                >
                  Remove from class
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : member.userId === info?.userId ? (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={() => {
                    leaveClassModal(classData, member, submit);
                  }}
                >
                  Leave class
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : null}
        </Group>
      </Paper>
    ));
  return (
    <>
      <Paper className="mt-3" shadow="lg" radius="md" withBorder p="lg">
        <Group className="justify-between">
          <Group>
            <Avatar
              src={null}
              alt={`Avatar of ${teacherCard?.userFirstName} ${teacherCard?.userLastName}`}
              size={"sm"}
            >
              {`${teacherCard?.userFirstName
                .charAt(0)
                .toUpperCase()}${teacherCard?.userLastName
                .charAt(0)
                .toUpperCase()}`}
            </Avatar>
            <Text className="font-semibold text-sm">
              {`${teacherCard?.userFirstName} ${teacherCard?.userLastName}`}
            </Text>
            <Badge
              color={
                classData?.teacherId === teacherCard?.userId ? "orange" : "blue"
              }
              autoContrast
            >
              {classData?.teacherId === teacherCard?.userId
                ? "Teacher"
                : "Student"}
            </Badge>
            <Text className="text-sm" c={"dimmed"}>
              {`As know as ${teacherCard?.userName}`}
            </Text>
          </Group>
        </Group>
      </Paper>
      {rows}
    </>
  );
};

export default MemberList;
