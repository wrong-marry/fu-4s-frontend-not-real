import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Menu,
  Paper,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertTriangleFilled,
  IconBook,
  IconBookmarkPlus,
  IconCirclePlus,
  IconDots,
  IconEdit,
  IconEraser,
  IconFolder,
  IconSearch,
  IconSettings,
  IconShare2,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { StudySet, FolderData } from "../../pages/folder/FolderPage";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import UpdateFolderModal from "../modal/folder/UpdateFolderModal";
import { UserCredentialsContext } from "../../store/user-credentials-context";
import AddQuizSetsModal from "../modal/folder/AddQuizSetsModal";
import InviteMemberModal from "../modal/folder/InviteMemberModal";
import { loadingIndicator } from "../../App";
import { toast } from "react-toastify";

interface LoaderData {
  folder: FolderData;
  studySets: StudySet[];
}
function Folder({ folderId }: { folderId: number }) {
  const { info } = useContext(UserCredentialsContext);
  const navigation = useNavigation();
  const actionData = useActionData() as { error: boolean; msg: string };
  const isLoading = navigation.state === "loading";
  const loaderData = useLoaderData() as LoaderData;
  const { folder, studySets } = loaderData;
  const iconSearch = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
  const [studySetsFilter, setStudySetsFilter] = useState<string>("Latest");
  const [opened, { open, close }] = useDisclosure(false);
  const isOwner = folder?.authorId === info?.userId;
  const [
    inviteModalOpened,
    { open: openInviteModal, close: closeInviteModal },
  ] = useDisclosure(false);
  const [addQuizSetOpened, { open: openAddQuizSet, close: closeAddQuizSet }] =
    useDisclosure(false);
  const form = useForm<{ folderName: string }>({
    initialValues: {
      folderName: "",
    },
    validate: {
      folderName: isNotEmpty("Folder name is required"),
    },
    transformValues: (values) => ({
      folderName: values.folderName,
      folderId: folderId,
      userId: info?.userId,
    }),
  });

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.msg);
    } else {
      toast.success(actionData?.msg);
    }
  }, [actionData]);
  const handleOpenUpdateModal = () => {
    form.setFieldValue("folderName", folder!.folderName);
    open();
  };

  if (isLoading) {
    return loadingIndicator;
  }

  return (
    <>
      <InviteMemberModal opened={inviteModalOpened} close={closeInviteModal} />
      <AddQuizSetsModal opened={addQuizSetOpened} close={closeAddQuizSet} />
      <UpdateFolderModal opened={opened} close={close} form={form} />
      <Container className="container">
        <Grid gutter={"lg"}>
          <Grid.Col span={12}>
            <Stack gap={"lg"}>
              <Group>
                <Text c={"dimmed"}>{folder?.numberOfQuizSet} sets</Text>
                <Divider orientation="vertical" />
                <Text>created by </Text>
                <Group gap={0}>
                  <Avatar size={"sm"} />
                  <Text>{folder?.authorName}</Text>
                </Group>
              </Group>
              <Group className="justify-between">
                <Group>
                  <IconFolder size={35} color="blue" />
                  <Text className="font-bold text-3xl">
                    {folder?.folderName}
                  </Text>
                </Group>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="light" color="gray" className="w-[50px]">
                      <IconDots />
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Item
                      leftSection={<IconBook size={14} />}
                      color="blue"
                    >
                      Study
                    </Menu.Item>
                    <Menu.Item leftSection={<IconShare2 size={14} />}>
                      Share
                    </Menu.Item>
                    <Menu.Item leftSection={<IconBookmarkPlus size={14} />}>
                      Bookmark
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconAlertTriangleFilled size={14} />}
                      color="red"
                    >
                      Report
                    </Menu.Item>
                    {isOwner && (
                      <>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconSettings size={14} />}>
                          <Menu trigger="hover" position="right">
                            <Menu.Target>
                              <Group className="ml-[2px]"> Settings</Group>
                            </Menu.Target>
                            <Menu.Dropdown className="ml-2">
                              <Menu.Item
                                leftSection={<IconCirclePlus size={14} />}
                                onClick={openAddQuizSet}
                              >
                                Add sets
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={handleOpenUpdateModal}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<IconEraser size={14} />}
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Menu.Item>
                      </>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </Group>
              <Group className="justify-between">
                <Select
                  checkIconPosition="right"
                  data={["Latest", "Alphabetical"]}
                  defaultValue={"Latest"}
                  allowDeselect={false}
                  onChange={(value) => setStudySetsFilter(value || "Latest")}
                />
                <TextInput
                  variant="filled"
                  radius="xl"
                  placeholder="Filter by title"
                  rightSectionPointerEvents="none"
                  rightSection={iconSearch}
                  className="w-[375px]"
                />
              </Group>
              <Divider />
              {studySets
                ?.filter((set) => {
                  if (studySetsFilter === "Recent") {
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return new Date(set.createdAt) > oneMonthAgo;
                  }
                  return true;
                })
                ?.map((set, index) => (
                  <Link to={`/quiz/set/${set.quizId}`} key={index}>
                    <Stack>
                      <Paper
                        key={index}
                        className="mt-3"
                        shadow="lg"
                        radius="md"
                        withBorder
                        p="xl"
                      >
                        <Group key={index}>
                          <Text className="font-semibold text-sm">
                            {set.numberOfQuestion}{" "}
                            {set.numberOfQuestion > 1 ? "terms" : "term"}
                          </Text>
                          <Group className="pl-4 ">
                            <Avatar src={null} alt="no image here" size={"sm"}>
                              {set?.authorFirstName!.charAt(0).toUpperCase() +
                                set?.authorLastName!.charAt(0).toUpperCase()}
                            </Avatar>
                            <Text className="font-semibold text-sm">
                              {set.author}
                            </Text>
                          </Group>
                        </Group>
                        <Text className="font-bold text-xl pt-1">
                          {set.quizName}
                        </Text>
                      </Paper>
                    </Stack>
                  </Link>
                ))}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default Folder;
