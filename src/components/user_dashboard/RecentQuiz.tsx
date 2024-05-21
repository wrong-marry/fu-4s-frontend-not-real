import { Carousel } from "@mantine/carousel";
import { Card, Text, Badge, Group, Stack, Avatar } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Carousel.module.css";
import { useNavigate } from "react-router-dom";
function RecentQuiz() {
  interface Quiz {
    quizId: string;
    quizName: string;
    numberOfQuestions: number;
    userName: string;
    view: number;
    timeRecentViewQuiz: string; // Change the type to string
    // Add other properties as needed
  }

  const [recentQuiz, setrecentQuiz] = useState<Quiz[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/quiz/get-all-quiz")
      .then((res) => {
        const sortedList =
          res && res.data
            ? res.data.sort(
                (
                  a: { timeRecentViewQuiz: string | number | Date },
                  b: { timeRecentViewQuiz: string | number | Date }
                ) => {
                  const timeA = new Date(a.timeRecentViewQuiz).getTime();
                  const timeB = new Date(b.timeRecentViewQuiz).getTime();
                  return timeB - timeA; // Sort in descending order for most recent views first
                }
              )
            : [];
        setrecentQuiz(sortedList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error gracefully, e.g., display an error message to the user
      });
  }, []);

  const handleClickUpdateTime = async (quizId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/quiz/update-time-quiz/${quizId}`
    );
    alert("Update successful!");
  };

  const handleClickIncreaseView = async (quizId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/quiz/increase-view?quiz-id=${quizId}`
    );
  };
  return (
    <>
      {recentQuiz.length === 0 ? (
        <Text c={"dimmed"}>No recent quizzes available :(</Text>
      ) : (
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
          {recentQuiz?.map((quiz, index) => (
            <Carousel.Slide key={index}>
              <Card
                shadow="sm"
                radius="md"
                padding={"lg"}
                withBorder
                component="a"
                className="h-full"
              >
                <Stack
                  onClick={() => {
                    handleClickUpdateTime(quiz.quizId);
                    handleClickIncreaseView(quiz.quizId);
                    navigate(`/quiz/set/${quiz.quizId}`);
                  }}
                  className="cursor-pointer justify-between h-full"
                >
                  <Stack gap={2}>
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
      )}
    </>
  );
}

export default RecentQuiz;
