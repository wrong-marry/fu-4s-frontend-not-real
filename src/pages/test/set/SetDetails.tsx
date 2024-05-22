import { Carousel, Embla } from "@mantine/carousel";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Menu,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  Link,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import axios from "axios";
import {
  IconPencil,
  IconPlayerPause,
  IconPlayerPlay,
  IconSettings,
  IconStarFilled,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import classes from "./SetDetails.module.css";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "react-toastify";
import RatingModal from "../../../components/modal/set-details/RatingModal";
import { useDisclosure } from "@mantine/hooks";
import DocumentTitle from "../../../components/document-title/DocumentTitle";
import { UserCredentialsContext } from "../../../store/user-credentials-context";
import DeleteModal from "../../../components/modal/set-details/DeleteModal";

export interface UserRating {
  userId: number;
  testId: number;
  rate: number;
  createAt: Date | null;
  isRated: boolean;
}

export interface SetDetails {
  userId: number | null;
  avatar: string | null;
  testId: number | null;
  userName: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  testName: string | null;
  rate: number | undefined;
  numberOfQuestions: number | null;
  createAt: string | null;
  view: number | null;
  description: string | null;
  timeRecentViewTest: string | number | null;
  questions:
    | [
        {
          questionId: number;
          questionContent: string | null;
          answers: [
            {
              answerId: number;
              content: string | null;
              isCorrect: boolean | null;
            }
          ];
        }
      ]
    | null;
  error?: boolean;
  msg?: string;
}
function SetDetails() {
  const { info } = useContext(UserCredentialsContext);
  const loaderData = useLoaderData() as SetDetails;
  console.log(loaderData);
  DocumentTitle(`${loaderData?.testName}`);
  const questionsData = loaderData?.questions;
  const [opened, { open, close }] = useDisclosure();
  const [isQuestion, setIsQuestion] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [userRating, setUserRating] = useState<UserRating | null>();
  const [averageRate, setAverageRate] = useState(0);
  const submit = useSubmit();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData?.error) {
      navigate("/");
    }
  }, []);

  if (!isAutoPlaying) {
    autoplay.current.stop();
  } else {
    autoplay.current.reset();
  }

  useEffect(() => {
    if (!loaderData) {
      navigate("/");
    }
  });

  useEffect(() => {
    checkRating(info?.userId, loaderData?.testId);
    getAverageRate(loaderData?.testId);
  }, [opened]);

  async function checkRating(uid: number | undefined, qid: number | null) {
    const res = await axios.get(
      `http://localhost:8080/api/v1/test/get-rating?user-id=${uid}&test-id=${qid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      }
    );
    setUserRating(res.data);
  }

  async function getAverageRate(qid: number | null) {
    const res = await axios.get(
      `http://localhost:8080/api/v1/test/get-average-rate-test?id=${qid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AT")}`,
        },
      }
    );
    setAverageRate(res.data);
  }

  const handleScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  function handleFlashcardClick() {
    setIsQuestion(!isQuestion);
  }

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla]);

  useEffect(() => {
    isAutoPlaying
      ? toast.info("Flashcard autoplay is on")
      : toast.info("Flashcard autoplay is off");
  }, [isAutoPlaying]);

  const rows = questionsData?.map((question, index) => (
    <Paper shadow="md" radius="lg" p="xl" withBorder key={index}>
      <Group>
        <div className="basis-2/3">
          <Text>{question.questionContent}</Text>
        </div>
        <Divider orientation="vertical" />
        <div className="basis-1/4">
          {question.answers.map((answer) => (
            <Text key={answer.content} fw={700}>
              {answer.isCorrect && answer.content}
            </Text>
          ))}
        </div>
      </Group>
    </Paper>
  ));

  const flashcards = questionsData?.map((question, index) => (
    <Carousel.Slide key={index}>
      {isQuestion ? (
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          withBorder
          h={"100%"}
          className="flex flex-col items-center justify-center"
          onClick={() => handleFlashcardClick()}
        >
          <Text className="text-3xl text-justify" fw={600}>
            {question.questionContent}
          </Text>
        </Paper>
      ) : (
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          withBorder
          h={"100%"}
          className="flex flex-col items-center justify-center"
          key={index}
          onClick={() => handleFlashcardClick()}
        >
          {question.answers.map((answer) => (
            <Text className="text-3xl text-justify" fw={600}>
              {answer.isCorrect && answer.content}
            </Text>
          ))}
        </Paper>
      )}
    </Carousel.Slide>
  ));

  const handleDelete = () => {
    submit(
      {
        testId: loaderData?.testId,
        userId: info?.userId as number,
        action: "delete-test",
      },
      {
        method: "delete",
      }
    );
  };

  return (
    <>
      <RatingModal
        opened={opened}
        close={close}
        isRated={userRating?.isRated}
        userId={info?.userId as number}
        testId={loaderData?.testId as number}
        setUserRating={
          setUserRating as React.Dispatch<React.SetStateAction<UserRating>>
        }
      />
      <Container>
        {/* infomation section */}
        <Stack>
          <Text c={"dimmed"} size="sm">
            {loaderData?.categoryName}
          </Text>
          <Title order={1}>{loaderData?.testName}</Title>
          <Group>
            <Badge
              leftSection={<IconUsers size={14} />}
            >{`${loaderData?.view} views`}</Badge>

            <Badge
              leftSection={<IconStarFilled size={14} color="yellow" />}
            >{`${averageRate ? averageRate : 0}`}</Badge>

            {userRating?.isRated && (
              <Badge color="orange">{`Your rating: ${userRating?.rate}`}</Badge>
            )}

            <Button variant="light" size="compact-sm" onClick={() => open()}>
              Leave your rating
            </Button>
          </Group>
        </Stack>
        {/* Button section */}
        <Group className="mt-10">
          <Button.Group>
            <Button variant="filled">
              <Link to={`/${loaderData?.testId}/study/flashcard/`}>
                Flashcard
              </Link>
            </Button>
            <Button variant="filled">
              <Link to={`/${loaderData?.testId}/study/learn/`}>Learn</Link>
            </Button>
            <Button variant="filled">Practice</Button>
          </Button.Group>
        </Group>
        {/* Flashcard section */}
        <Carousel
          align={"start"}
          height={500}
          className="mt-10 rounded-md"
          onSlideChange={() => {
            setIsQuestion(true);
          }}
          getEmblaApi={setEmbla}
          classNames={classes}
          plugins={[autoplay.current]}
        >
          {flashcards}
        </Carousel>
        <Group className="justify-between mt-5">
          <Progress value={scrollProgress} size="sm" className="basis-1/3" />
          <ActionIcon
            variant="subtle"
            size="lg"
            radius="xl"
            aria-label="autoplay"
            onClick={() => {
              setIsAutoPlaying(!isAutoPlaying);
            }}
          >
            {isAutoPlaying ? (
              <IconPlayerPause size={24} />
            ) : (
              <IconPlayerPlay size={24} />
            )}
          </ActionIcon>
        </Group>

        {/* Author section */}
        <Group className="justify-between mt-10">
          <Group>
            <Avatar src={loaderData?.avatar} size={"lg"} />
            <Stack gap={0}>
              <Text c={"dimmed"} size="sm">
                Created by
              </Text>
              <Text className="capitalize">
                {loaderData?.userFirstName + " " + loaderData?.userLastName}
              </Text>
            </Stack>
          </Group>
          {loaderData?.userId === info?.userId && (
            <Center>
              <Menu>
                <Menu.Target>
                  <Tooltip label="Settings for this set">
                    <ActionIcon variant="subtle" size="xl" radius={"xl"}>
                      <IconSettings stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconPencil size={14} />}
                    component={Link}
                    to={`/test/set/${loaderData?.testId}/edit`}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => DeleteModal({ handleDelete })}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Center>
          )}
        </Group>

        {loaderData?.description && (
          <Stack className="mt-10">
            <Divider />
            <Title order={4}>About this set</Title>
            <Text>{loaderData?.description}</Text>
          </Stack>
        )}

        {/* Question details */}
        <Group className="my-10">
          <Title order={3}>
            Terms in this set ({loaderData?.numberOfQuestions})
          </Title>
        </Group>
        <Stack>{rows}</Stack>
      </Container>
    </>
  );
}

export default SetDetails;

export async function loader({ params }: { params: Readonly<Params> }) {
  const { id } = params;
  try {
    const res = await axios
      .get(`http://localhost:8080/api/v1/test/get-test?id=${id}`)
      .catch(() => {
        throw new Error("Error while loading data");
      });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
}

export async function action({ request }: { request: Request }) {
  try {
    let res;
    const data = Object.fromEntries(await request.formData());
    const AT = "Bearer " + localStorage.getItem("AT");
    const action = data.action;
    const payload = {
      testId: Number(data.testId),
      userId: Number(data.userId),
      rate: Number(data.rate),
    };

    switch (action) {
      case "create-rating":
        res = await axios
          .post(`http://localhost:8080/api/v1/test/create-rating`, payload, {
            headers: {
              Authorization: AT,
            },
          })
          .catch(() => {
            throw new Error("Cannot creating rating");
          });
        return {
          success: true,
          msg: "Success",
        };
      case "update-rating":
        res = await axios
          .put(`http://localhost:8080/api/v1/test/update-rating`, payload, {
            headers: {
              Authorization: AT,
            },
          })
          .catch(() => {
            throw new Error("Cannot update rating");
          });
        return {
          success: true,
          msg: "Updated",
        };
      case "delete-test":
        res = await axios
          .delete(
            `http://localhost:8080/api/v1/test/delete-test?id=${payload?.testId}&userId=${payload?.userId}`,
            {
              headers: {
                Authorization: AT,
              },
            }
          )
          .catch(() => {
            throw new Error("Cannot delete test");
          });
        return redirect("/");
      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
