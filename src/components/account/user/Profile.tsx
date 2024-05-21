import { useState, useEffect } from "react";
import {
  Tabs,
  rem,
  Text,
  Stack,
  Avatar,
  Group,
  Select,
  Container,
  Paper,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconFolder,
  IconSchool,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Classes,
  Folder,
  StudySet,
  UserData,
  fetchClassesData,
  fetchFolderData,
  fetchStudySetsData,
} from "../../../pages/account/user/ProfilePage";
const iconStyle = { width: rem(12), height: rem(12) };
const loadingIndicator = (
  <LoadingOverlay
    visible
    zIndex={0}
    overlayProps={{ radius: "sm", blur: 0, backgroundOpacity: 0 }}
    loaderProps={{ color: "orange", type: "oval" }}
  />
);

export default function Profile({
  userData,
  tabPath,
}: {
  userData: UserData;
  tabPath: string | undefined;
}) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  const [mutatedStudySets, setMutatedStudySets] = useState<StudySet[]>([]);
  const [mutatedClasses, setMutatedClasses] = useState<Classes[]>([]);
  const [mutatedFolders, setMutatedFolders] = useState<Folder[]>([]);

  const [studySetsFilter, setStudySetsFilter] = useState<string>("Recent");
  const [foldersFilter, setFoldersFilter] = useState<string>("Recent");

  useEffect(() => {
    if (userData) {
      fetchStudySets(userData.userId);
      fetchClasses(userData.userId);
      fetchFolders(userData.userId);
    }
  }, [userData]);

  function handleSetsFilter(value: string) {
    switch (value) {
      case "Recent":
      case "Created":
      
    }
  }

  async function fetchStudySets(userId: number) {
    setLoading(true);
    try {
      const sets = await fetchStudySetsData(userId);
      setStudySets(sets);
    } catch (error) {
      console.error("Error fetching study sets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClasses(userId: number) {
    setLoading(true);
    try {
      const classesData = await fetchClassesData(userId);
      setClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFolders(userId: number) {
    setLoading(true);
    try {
      const foldersData = await fetchFolderData(userId);
      setFolders(foldersData);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="container">
      <Group>
        <Avatar src={null} alt="no image here" size={"lg"}>
          {userData?.firstName!.charAt(0).toUpperCase() +
            userData?.lastName!.charAt(0).toUpperCase()}
        </Avatar>

        <Stack gap={0}>
          <Text size="lg" className="font-bold">
            {userData.userName}
          </Text>
          <Text c={"dimmed"} className="capitalize" size="sm">
            {userData?.firstName + " " + userData?.lastName}
          </Text>
        </Stack>
      </Group>

      <Tabs
        value={tabPath}
        className="mt-5"
        onChange={(value) => navigate(`/user/profile/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="sets" leftSection={<IconSchool style={iconStyle} />}>
            Study sets
          </Tabs.Tab>
          <Tabs.Tab
            value="folders"
            leftSection={<IconFolder style={iconStyle} />}
          >
            Folder
          </Tabs.Tab>
          <Tabs.Tab
            value="classes"
            leftSection={<IconUsersGroup style={iconStyle} />}
          >
            Classes
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="sets">
          {/* Select component for filtering */}
          <Select
            className="my-5 w-[120px]"
            placeholder="Recent"
            checkIconPosition="right"
            data={["Recent", "Created", "Learned"]}
            value={studySetsFilter}
            onChange={(value) => setStudySetsFilter(value || "Recent")}
            allowDeselect={false}
          />
          {/* Content rendering based on the filter */}
          {isLoading
            ? loadingIndicator
            : studySets
                .filter((set) => {
                  if (studySetsFilter === "Recent") {
                    // Filter sets created within the last month
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return new Date(set.createdAt) > oneMonthAgo;
                  }
                  return true;
                })
                .map((set, index) => (
                  <Link to={`/quiz/set/${set.quizId}`} key={index}>
                    <Paper
                      key={index}
                      className="mt-3"
                      shadow="lg"
                      radius="md"
                      withBorder
                      p="lg"
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
                  </Link>
                ))}
        </Tabs.Panel>

        <Tabs.Panel value="folders">
          <Select
            className="my-5 w-[120px]"
            placeholder="Recent"
            checkIconPosition="right"
            data={["Recent", "Created", "Studied"]}
            value={studySetsFilter}
            onChange={(value) => setFoldersFilter(value || "Recent")}
            allowDeselect={false}
          />
          {isLoading
            ? loadingIndicator
            : folders
                .filter((set) => {
                  if (foldersFilter === "Recent") {
                    // Filter sets created within the last month
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return new Date(set.createdAt) > oneMonthAgo;
                  }
                  return true;
                })
                .map((folder, index) => (
                  <Link to={`/folder/${folder.folderId}`} key={index}>
                    <Paper
                      key={index}
                      className="mt-3"
                      shadow="lg"
                      radius="md"
                      withBorder
                      p="lg"
                    >
                      <Stack gap="xs">
                        <Text className="font-semibold text-sm">
                          {folder.numberOfQuizSet}{" "}
                          {folder.numberOfQuizSet > 1 ? "sets" : "set"}
                        </Text>
                        <Text className="font-bold text-xl">
                          {folder.folderName}
                        </Text>
                      </Stack>
                    </Paper>
                  </Link>
                ))}
        </Tabs.Panel>

        <Tabs.Panel value="classes">
          {isLoading
            ? loadingIndicator
            : classes.map((classItem, index) => (
                <Link to={`/class/${classItem.classId}/sets`} key={index}>
                  <Paper
                    key={index}
                    className="mt-3"
                    shadow="lg"
                    radius="md"
                    withBorder
                    p="lg"
                  >
                    <Group key={index}>
                      <Text className="font-semibold text-sm">
                        {classItem.numberOfQuizSet}{" "}
                        {classItem.numberOfQuizSet > 1 ? "sets" : "set"}
                      </Text>
                      <Text className="font-semibold text-sm">
                        {classItem.numberOfStudent}{" "}
                        {classItem.numberOfStudent > 1 ? "members" : "member"}
                      </Text>
                    </Group>
                    <Group>
                      {
                        <IconUsers
                          style={iconStyle}
                          className="w-5 h-5 text-blue-600/100"
                        />
                      }
                      <Text className="font-bold text-xl">
                        {classItem.className}
                      </Text>
                    </Group>
                  </Paper>
                </Link>
              ))}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
