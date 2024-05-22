import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Input,
  Menu,
  Modal,
  Paper,
  rem,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import {
  IconAlertTriangleFilled,
  IconBellFilled,
  IconBook,
  IconCheck,
  IconCirclePlus,
  IconCopy,
  IconDots,
  IconEdit,
  IconEraser,
  IconLayersSubtract,
  IconMinus,
  IconPlus,
  IconSearch,
  IconSettings,
  IconShare2,
  IconUserPlus,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import {
  StudySet,
  ClassData,
  fetchStudySetsData,
  fetchClassData,
  fetchMembersData,
  Member,
  fetchUserCreatedStudySetsData,
  addTestToClassApi,
  removeTestFromClassApi,
  Questions,
  fetchQuestionsData,
} from "../../pages/class/ClassPage";
import { format } from "date-fns";
import { Link, useActionData, useNavigate, useSubmit } from "react-router-dom";
import TestQuestionModal from "./TestQuestionModal";
import deleteClassModal from "../modal/class/delete/DeleteClassModal";
import UpdateClassModal from "../modal/class/update/UpdateClassModal";
import { useForm, isNotEmpty } from "@mantine/form";
import InviteMember from "../modal/class/invite-member/InviteMember";
import MemberList from "./tabs/members/MemberList";
import { UserCredentialsContext } from "../../store/user-credentials-context";

function Class({ classId, tab }: { classId: number; tab: string | undefined }) {
  const submit = useSubmit();
  const { info } = useContext(UserCredentialsContext);
  const actionData = useActionData();
  const iconSearch = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
  const [addSetsModalOpened, setAddSetsModalOpened] = useState(false);
  const [addQuestionModalOpened, setAddQuestionModalOpened] = useState(false);
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [studyUserCreatedSets, setUserCreatedSets] = useState<StudySet[]>([]);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [filterOption, setFilterOption] = useState<string>("Latest");
  const [opened, { open, close }] = useDisclosure(false);
  const [inputValue, setInputValue] = useState("");
  const clipboard = useClipboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [discussionSearchQuery, setDiscussionSearchQuery] = useState("");
  const [
    inviteModalOpened,
    { open: openInviteModal, close: closeInviteModal },
  ] = useDisclosure(false);

  const uid = Number(localStorage.getItem("uid"));
  const [commonTestIds, setCommonTestIds] = useState<number[]>([]);
  const navigate = useNavigate();
  let isMember = members?.some((member) => member.userId === info?.userId);
  let isOwner = classData?.teacherId === info?.userId;

  const form = useForm<{ classroomName: string }>({
    initialValues: {
      classroomName: "",
    },
    validate: {
      classroomName: isNotEmpty("Class name is required"),
    },
  });

  useEffect(() => {
    fetchStudySets(classId);
    fetchClassEntityData(classId);
    fetchMembers(classId);
    fetchQuestions(classId);
  }, [classId, actionData]);

  useEffect(() => {
    if (classData) {
      setInputValue(`http://localhost:5173/class/${classData.slugCode || ""}`);
      if (!isMember && !isOwner) {
        navigate(`/class/${classId}/sets`);
      }
    }
  }, [classData]);
  useEffect(() => {
    if (uid) {
      fetchUserCreatedStudySets(uid);
    }
  }, [uid]);
  useEffect(() => {
    const updatedCommonTestIds = studySets
      .filter((set) => {
        return studyUserCreatedSets.some(
          (userSet) => userSet.testId === set.testId
        );
      })
      .map((set) => set.testId);

    setCommonTestIds(updatedCommonTestIds);
  }, [studySets, studyUserCreatedSets]);

  async function fetchStudySets(classId: number) {
    true;
    try {
      const sets = await fetchStudySetsData(classId);
      setStudySets(sets);
    } catch (error) {
      console.error("Error fetching study sets:", error);
    }
  }
  async function fetchQuestions(classId: number) {
    true;
    try {
      const questionsData = await fetchQuestionsData(classId);
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  async function fetchUserCreatedStudySets(userId: number) {
    try {
      const sets = await fetchUserCreatedStudySetsData(userId);
      setUserCreatedSets(sets);
    } catch (error) {
      console.error("Error fetching user created study sets:", error);
    } finally {
    }
  }
  async function fetchClassEntityData(classId: number) {
    try {
      const classData = await fetchClassData(classId);
      setClassData(classData);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  }
  async function fetchMembers(classId: number) {
    try {
      const memberData = await fetchMembersData(classId);
      setMembers(memberData);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  }

  async function addTestToClass(classId: number, testId: number) {
    try {
      // Make API call to add test to class
      await addTestToClassApi(classId, testId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error adding test to class:", error);
    }
  }

  async function removeTestFromClass(classId: number, testId: number) {
    try {
      // Make API call to remove test from class
      await removeTestFromClassApi(classId, testId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error removing test from class:", error);
    }
  }
  function fetchFilteredStudySetsData(
    classId: number,
    filterOption: string
  ): StudySet[] {
    let filteredSets: StudySet[] = [];

    if (filterOption === "Latest") {
      // Filter the study sets based on the createdAt date in descending order (latest first)
      filteredSets = studySets
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } else if (filterOption === "Alphabetical") {
      // Filter the study sets based on the test set name in alphabetical order
      filteredSets = studySets
        .slice()
        .sort((a, b) => a.testName.localeCompare(b.testName));
    } else {
      // Handle other filter options if needed
      // For example, handle other types of filters or default behavior
      filteredSets = studySets;
    }

    return filteredSets;
  }

  const fetchFilteredStudySets = async (classId: number) => {
    try {
      // Make API call to fetch study sets based on the filter option
      const filteredSets = await fetchFilteredStudySetsData(
        classId,
        filterOption
      );
      setStudySets(filteredSets);
    } catch (error) {
      console.error("Error fetching filtered study sets:", error);
    }
  };
  useEffect(() => {
    fetchFilteredStudySets(classId);
  }, [classId, filterOption]);

  const handleFilterChange = (value: string | null) => {
    if (value !== null) {
      setFilterOption(value);
    }
  };
  const handleAddQuestionClose = () => {
    setAddQuestionModalOpened(false);
  };

  const handleAddQuestionOpen = () => {
    setAddQuestionModalOpened(true);
  };

  const handleUpdateClass = () => {
    form.setFieldValue("classroomName", classData!.className);
    open();
  };

  return (
    <>
      {/* Add test sets modal */}
      <Modal.Root
        opened={addSetsModalOpened}
        onClose={() => setAddSetsModalOpened(false)}
        centered
        size="lg"
      >
        <Modal.Overlay />
        <Modal.Content>
          <div className="p-4">
            <Modal.Header>
              <Modal.Title className="font-bold text-size text-2xl">
                Add test sets
              </Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
          </div>

          <Modal.Body>
            <Stack p={"xl"}>
              <Button variant="subtle" size="sm" leftSection={<IconPlus />}>
                <Link to="/create-test">Create new sets</Link>
              </Button>
              <Select
                className="w-1/4"
                checkIconPosition="right"
                data={["Your sets", "Folder sets", "Study sets"]}
                defaultValue={"Your sets"}
                onChange={(value) => handleFilterChange(value)}
                allowDeselect={false}
              />
              {studyUserCreatedSets?.map((set) => (
                <Stack key={set.testId}>
                  <Paper
                    shadow="lg"
                    radius="md"
                    withBorder
                    p="xl"
                    className="py-4"
                  >
                    <Group className="justify-between">
                      <Text className="font-bold text-lg">{set.testName}</Text>
                      {commonTestIds?.includes(set.testId) ? (
                        // If the test ID exists, render the minus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            removeTestFromClass(classId, set.testId);
                            const updatedCommonTestIds = commonTestIds.filter(
                              (id) => id !== set.testId
                            );
                            setCommonTestIds(updatedCommonTestIds);
                          }}
                        >
                          <IconMinus size={12} />
                        </Button>
                      ) : (
                        // If the test ID does not exist, render the plus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            addTestToClass(classId, set.testId);
                            const updatedCommonTestIds = [
                              ...commonTestIds,
                              set.testId,
                            ];
                            setCommonTestIds(updatedCommonTestIds);
                          }}
                        >
                          <IconPlus size={12} />
                        </Button>
                      )}
                    </Group>
                  </Paper>
                </Stack>
              ))}
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <UpdateClassModal
        opened={opened}
        close={close}
        form={form}
        classEntity={classData}
      />
      <InviteMember
        opened={inviteModalOpened}
        close={closeInviteModal}
        classId={classId}
      />
      <Container className="container">
        <Grid gutter={"lg"}>
          <Grid.Col span={8}>
            <Stack gap={"lg"}>
              <Group>
                <Text c={"dimmed"}>{`${classData?.numberOfTestSet} sets`}</Text>
                <Divider orientation="vertical" />
                <Group gap={"md"}>
                  <Text c={"dimmed"}>created by</Text>
                  <Group gap={"xs"}>
                    <Avatar size={"sm"} />
                    <Text>{classData?.teacherName}</Text>
                  </Group>
                </Group>
              </Group>
              <Group className="justify-between">
                <Group>
                  <IconUsers size={35} color="blue" />
                  <Text className="font-bold text-3xl">
                    {classData?.className}
                  </Text>
                </Group>
                {isOwner || isMember ? (
                  <Group className="items-center">
                    <ActionIcon variant="filled" aria-label="Settings">
                      <IconBellFilled size={20} />
                    </ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <Button variant="light" color="gray">
                          <IconDots size={14} />
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
                        <Menu.Item
                          leftSection={<IconAlertTriangleFilled size={14} />}
                          color="red"
                        >
                          Report
                        </Menu.Item>

                        {classData?.teacherId === info?.userId && (
                          <>
                            <Menu.Divider />
                            <Menu.Item>
                              <Menu trigger="hover" position="right">
                                <Menu.Target>
                                  <Menu.Item
                                    leftSection={<IconSettings size={14} />}
                                  >
                                    Settings
                                  </Menu.Item>
                                </Menu.Target>
                                <Menu.Dropdown className="ml-2">
                                  <Menu.Item
                                    leftSection={<IconCirclePlus size={14} />}
                                    onClick={() => setAddSetsModalOpened(true)}
                                  >
                                    Add sets
                                  </Menu.Item>
                                  <Menu.Item
                                    leftSection={<IconUserPlus size={14} />}
                                    onClick={openInviteModal}
                                  >
                                    Invite members
                                  </Menu.Item>
                                  <Menu.Item
                                    leftSection={<IconEdit size={14} />}
                                    onClick={handleUpdateClass}
                                  >
                                    Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    color="red"
                                    leftSection={<IconEraser size={14} />}
                                    onClick={() =>
                                      deleteClassModal(classId, submit)
                                    }
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
                ) : (
                  <Button color="pink" autoContrast>
                    Request to join class
                  </Button>
                )}
              </Group>

              <Tabs
                color="indigo"
                value={tab}
                onChange={(value) => navigate(`/class/${classId}/${value}`)}
              >
                <Tabs.List>
                  <Tabs.Tab value="sets">Sets</Tabs.Tab>
                  {isMember && (
                    <>
                      <Tabs.Tab value="members" disabled={!isMember}>
                        Members
                      </Tabs.Tab>
                      <Tabs.Tab value="discussion" disabled={!isMember}>
                        Discussion
                      </Tabs.Tab>
                    </>
                  )}
                </Tabs.List>

                <Tabs.Panel value="sets">
                  <Stack gap={"sm"} className="mt-5">
                    <Group className="justify-between">
                      <Select
                        checkIconPosition="right"
                        data={["Latest", "Alphabetical"]}
                        defaultValue={"Latest"}
                        allowDeselect={false}
                      />
                      <TextInput
                        variant="filled"
                        radius="xl"
                        placeholder="Filter by title"
                        rightSectionPointerEvents="none"
                        rightSection={iconSearch}
                        className="w-[375px]"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                      />
                    </Group>
                    {studySets
                      ?.filter((set) =>
                        set.testName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      ?.map((set, index) => (
                        <Link to={`/test/set/${set.testId}`} key={index}>
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
                                  <Avatar
                                    src={null}
                                    alt="no image here"
                                    size={"sm"}
                                  >
                                    {set
                                      ?.authorFirstName!.charAt(0)
                                      .toUpperCase() +
                                      set
                                        ?.authorLastName!.charAt(0)
                                        .toUpperCase()}
                                  </Avatar>
                                  <Text className="font-semibold text-sm">
                                    {set.author}
                                  </Text>
                                </Group>
                              </Group>
                              <Text className="font-bold text-xl pt-1">
                                {set.testName}
                              </Text>
                            </Paper>
                          </Stack>
                        </Link>
                      ))}
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="members">
                  <Stack gap={"sm"} className="mt-5">
                    <Group className="justify-between">
                      <Select
                        checkIconPosition="right"
                        data={["Latest", "Alphabetical"]}
                        defaultValue={"Latest"}
                        allowDeselect={false}
                      />
                      <TextInput
                        variant="filled"
                        radius="xl"
                        placeholder="Filter by name"
                        rightSectionPointerEvents="none"
                        rightSection={iconSearch}
                        className="w-[375px]"
                        value={memberSearchQuery}
                        onChange={(event) =>
                          setMemberSearchQuery(event.target.value)
                        }
                      />
                    </Group>
                    <MemberList
                      members={members}
                      classData={classData as ClassData}
                    />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="discussion">
                  <Stack gap={"sm"} className="mt-5">
                    <Group className="justify-between">
                      <Select
                        checkIconPosition="right"
                        data={["Latest", "Alphabetical"]}
                        defaultValue={"Latest"}
                        allowDeselect={false}
                      />
                      <TextInput
                        variant="filled"
                        radius="xl"
                        placeholder="Filter by title"
                        rightSectionPointerEvents="none"
                        rightSection={iconSearch}
                        value={discussionSearchQuery}
                        onChange={(event) =>
                          setDiscussionSearchQuery(event.target.value)
                        }
                      />
                    </Group>
                    <Group className="justify-center">
                      <Button
                        className="w-[100%]"
                        variant="outline"
                        onClick={handleAddQuestionOpen}
                        leftSection={<IconPlus size={14} />}
                      >
                        Add new question
                      </Button>
                    </Group>
                    <TestQuestionModal
                      opened={addQuestionModalOpened}
                      close={handleAddQuestionClose}
                      classId={classId}
                    />

                    {Array.isArray(questions) &&
                      questions
                        ?.filter((question) =>
                          question.title
                            .toLowerCase()
                            .includes(discussionSearchQuery.toLowerCase())
                        )
                        ?.map((question, index) => (
                          <Link
                            to={`./question/${question.classQuestionId}`}
                            key={index}
                          >
                            <Paper
                              withBorder
                              p="xl"
                              shadow="md"
                              className="mb-5"
                            >
                              <Group>
                                <Avatar
                                  src={null}
                                  alt={`Avatar of ${question.userFirstName} ${question.userLastName}`}
                                  size="lg"
                                >
                                  {`${question.userFirstName
                                    .charAt(0)
                                    .toUpperCase()}${question.userLastName
                                    .charAt(0)
                                    .toUpperCase()}`}
                                </Avatar>
                                <Stack gap={0}>
                                  <Text className="font-semibold text-md">{`${question.userFirstName} ${question.userLastName}`}</Text>
                                  <Text className="text-xs">
                                    {format(question.createAt, "MM/dd/yyyy")}
                                  </Text>
                                </Stack>
                              </Group>
                              <Stack gap={"sm"} className="mt-3">
                                <Title order={4}>{question.title}</Title>
                                <Text className="font-normal text-sm">
                                  {question.content}
                                </Text>
                              </Stack>
                            </Paper>
                          </Link>
                        ))}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4} className="flex justify-end">
            <Paper
              className="w-4/5 max-h-80"
              shadow="lg"
              radius="md"
              withBorder
              p="xl"
            >
              <Stack>
                {(isOwner || isMember) && (
                  <>
                    <Stack gap="xs">
                      <Title order={5} className="uppercase font-medium">
                        Invite link
                      </Title>
                      <Group>
                        <Input
                          value={inputValue}
                          onChange={(event) =>
                            setInputValue(event.target.value)
                          }
                          readOnly
                          radius="sm"
                          w={"100%"}
                          variant="filled"
                        />
                        <Tooltip
                          label="Link copied!"
                          offset={5}
                          position="bottom"
                          radius="xl"
                          transitionProps={{
                            duration: 100,
                            transition: "slide-down",
                          }}
                          opened={clipboard.copied}
                        >
                          <Button
                            variant="light"
                            rightSection={
                              clipboard.copied ? (
                                <IconCheck
                                  style={{ width: rem(20), height: rem(20) }}
                                  stroke={1.5}
                                />
                              ) : (
                                <IconCopy
                                  style={{ width: rem(20), height: rem(20) }}
                                  stroke={1.5}
                                />
                              )
                            }
                            fullWidth
                            radius="xl"
                            size="sm"
                            onClick={() => clipboard.copy(inputValue)}
                          >
                            Copy link to clipboard
                          </Button>
                        </Tooltip>
                      </Group>
                    </Stack>
                    <Divider />
                  </>
                )}
                <Stack>
                  <Title order={5} className="uppercase font-normal">
                    Class details
                  </Title>
                  <Stack gap="xs">
                    <Group>
                      <IconLayersSubtract size={20} color="gray" />
                      <Text className="font-semibold text-[14px]">
                        {classData?.numberOfTestSet !== undefined
                          ? classData?.numberOfTestSet > 1
                            ? `${classData?.numberOfTestSet} sets`
                            : `${classData?.numberOfTestSet} set`
                          : "No test sets available"}
                      </Text>
                    </Group>
                    <Group>
                      <IconUsersGroup size={20} color="gray" />
                      <Text className="font-semibold text-[14px]">
                        {classData?.numberOfStudent !== undefined
                          ? classData?.numberOfTestSet > 1
                            ? `${classData?.numberOfTestSet} members`
                            : `${classData?.numberOfTestSet} member`
                          : "1 member"}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default Class;
