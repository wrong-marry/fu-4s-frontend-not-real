import { Carousel } from "@mantine/carousel";
import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Carousel.module.css";
import { useNavigate } from "react-router-dom";

interface Quiz {
  quizId: string;
  quizName: string;
  numberOfQuestions: number;
  userName: string;
  view: number;
  timeRecentViewQuiz: string; // Change the type to string
  // Add other properties as needed
}

function PopularQuiz() {
  const navigate = useNavigate();

  const [popularQuiz, setpopularQuiz] = useState<Quiz[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/quiz/get-all-quiz")
      .then((res) => {
        const sortedList =
          res && res.data
            ? res.data.sort(
                (a: { view: number }, b: { view: number }) => b.view - a.view
              )
            : [];
        setpopularQuiz(sortedList);
      })
      .catch((error) => {
        // Handle error here
        console.log("Error fetching data:", error);
        // You can set an error state or do other error handling if needed
      });
  }, []);

  const handleClickUpdateTime = async (quizId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/quiz/update-time-quiz?id=${quizId}`
    );
  };

  const handleClickIncreaseView = async (quizId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/quiz/increase-view?quiz-id=${quizId}`
    );
  };

  return (
    <>
      {popularQuiz.length > 0 ? (
        <Carousel
          slideSize={"33.333333%"}
          height={"150px"}
          align={"start"}
          slideGap="lg"
          controlsOffset="xs"
          controlSize={30}
          dragFree
          classNames={classes}
        >
          {popularQuiz.map((quiz, index) => (
            <Carousel.Slide key={index}>
              <Card
                shadow="sm"
                padding={"lg"}
                radius="md"
                withBorder
                component="a"
                className="h-full"
              >
                <Stack
                  className="h-full justify-between"
                  onClick={() => {
                    handleClickUpdateTime(quiz.quizId);
                    handleClickIncreaseView(quiz.quizId);
                    navigate(`/quiz/set/${quiz.quizId}`);
                  }}
                >
                  <Stack gap={3}>
                    <Text fw={500}>{quiz.quizName}</Text>
                    <Badge color="indigo">
                      {quiz.numberOfQuestions} Question
                    </Badge>
                  </Stack>
                  <Group gap={"xs"}>
                    <Avatar variant="filled" radius="xl" size="sm" />
                    <Text size="sm">{quiz.userName}</Text>
                  </Group>
                </Stack>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Text c={"dimmed"}>No popular quizzes available :(</Text>
      )}
    </>
  );
}

export default PopularQuiz;
