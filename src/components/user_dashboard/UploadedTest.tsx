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

interface Test {
  testId: string;
  testName: string;
  numberOfQuestions: number;
  userName: string;
  view: number;
  timeRecentViewTest: string; // Change the type to string
  // Add other properties as needed
}

function UploadedTest() {
  const navigate = useNavigate();

  const [uploadedTest, setuploadedTest] = useState<Test[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/test/get-all-test")
      .then((res) => {
        const sortedList =
          res && res.data
            ? res.data.sort(
                (a: { view: number }, b: { view: number }) => b.view - a.view
              )
            : [];
        setuploadedTest(sortedList);
      })
      .catch((error) => {
        // Handle error here
        console.log("Error fetching data:", error);
        // You can set an error state or do other error handling if needed
      });
  }, []);

  const handleClickUpdateTime = async (testId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/test/update-time-test?id=${testId}`
    );
  };

  const handleClickIncreaseView = async (testId: any) => {
    await axios.put(
      `http://localhost:8080/api/v1/test/increase-view?test-id=${testId}`
    );
  };

  return (
    <>
      {uploadedTest.length > 0 ? (
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
          {uploadedTest.map((test, index) => (
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
                    handleClickUpdateTime(test.testId);
                    handleClickIncreaseView(test.testId);
                    navigate(`/test/set/${test.testId}`);
                  }}
                >
                  <Stack gap={3}>
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
      ) : (
        <Text c={"dimmed"}>No uploaded tests available :(</Text>
      )}
    </>
  );
}

export default UploadedTest;
