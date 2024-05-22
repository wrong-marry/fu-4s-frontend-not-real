import { Carousel } from "@mantine/carousel";
import { Card, Text, Badge, Group, Stack, Avatar } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Carousel.module.css";
import { useNavigate } from "react-router-dom";
function RecentTest() {
  interface Test {
    testId: string;
    testName: string;
    numberOfQuestions: number;
    userName: string;
    view: number;
    timeRecentViewTest: string; // Change the type to string
    // Add other properties as needed
  }

  const [recentTest, setRecentTest] = useState<Test[]>([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/getCompletedTest/${username}`)
      .then((res) => {
        const sortedList =
          res && res.data
            ? res.data.sort(
                (
                  a: { timeRecentViewTest: string | number | Date },
                  b: { timeRecentViewTest: string | number | Date }
                ) => {
                  const timeA = new Date(a.timeRecentViewTest).getTime();
                  const timeB = new Date(b.timeRecentViewTest).getTime();
                  return timeB - timeA; // Sort in descending order for most recent views first
                }
              )
            : [];
        setRecentTest(sortedList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error gracefully, e.g., display an error message to the user
      });
  }, []);

  const handleClickUpdateTime = async (testId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/test/update-time-test/${testId}`
    );
    alert("Update successful!");
  };

  const handleClickIncreaseView = async (testId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/test/increase-view?test-id=${testId}`
    );
  };
  return (
    <>
      {recentTest.length === 0 ? (
        <Text c={"dimmed"}>No recent tests available :(</Text>
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
          {recentTest?.map((test, index) => (
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
                    handleClickUpdateTime(test.testId);
                    handleClickIncreaseView(test.testId);
                    navigate(`/test/set/${test.testId}`);
                  }}
                  className="cursor-pointer justify-between h-full"
                >
                  <Stack gap={2}>
                    <Text fw={500}>{test.testName}</Text>
                    <Badge color="indigo">
                      {test.numberOfQuestions} Question
                    </Badge>
                  </Stack>
                  <Group gap={"xs"}>
                    <Avatar variant="filled" radius="xl" size="sm" />
                    <Text size="sm">{test.userName}</Text>
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

export default RecentTest;
